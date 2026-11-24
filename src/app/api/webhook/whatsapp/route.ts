/**
 * WhatsApp Cloud API Webhook Handler
 * Next.js App Router (TypeScript)
 *
 * Endpoint: /api/webhook/whatsapp
 * Menangani handshake verifikasi GET dan pemrosesan pesan masuk POST dengan proteksi HMAC-SHA256
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSafeEnv } from "@/lib/env";
import { markMessageAsRead, sendWhatsAppTextMessage } from "@/lib/whatsapp/client";
import { generateGeminiReply } from "@/lib/ai/gemini-whatsapp";
import { BOT_PERSONA } from "@/config/bot-persona";

// ==========================================
// 1. TIPE DATA PAYLOAD WEBHOOK WHATSAPP
// ==========================================
interface WhatsAppIncomingMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; mime_type?: string; sha256?: string };
  audio?: { id: string; mime_type?: string };
  video?: { id: string; mime_type?: string };
  document?: { id: string; filename?: string; mime_type?: string };
  sticker?: { id: string; mime_type?: string };
  location?: { latitude: number; longitude: number; name?: string; address?: string };
}

interface WhatsAppWebhookStatus {
  id: string;
  status: "sent" | "delivered" | "read" | "failed" | string;
  timestamp: string;
  recipient_id: string;
  errors?: unknown[];
}

interface WhatsAppWebhookValue {
  messaging_product: string;
  metadata?: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: Array<{
    profile: { name: string };
    wa_id: string;
  }>;
  messages?: WhatsAppIncomingMessage[];
  statuses?: WhatsAppWebhookStatus[];
}

interface WhatsAppWebhookChange {
  field: string;
  value: WhatsAppWebhookValue;
}

interface WhatsAppWebhookEntry {
  id: string;
  changes: WhatsAppWebhookChange[];
}

interface WhatsAppWebhookPayload {
  object: string;
  entry?: WhatsAppWebhookEntry[];
}

// ==========================================
// 2. IN-MEMORY IDEMPOTENCY CACHE (Anti Balas Ganda)
// ==========================================
// Menyimpan message.id selama 10 menit (600.000 ms) untuk mencegah reply ganda akibat webhook retry dari Meta.
class IdempotencyCache {
  private cache = new Map<string, number>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;

  constructor(ttlMinutes = 10, maxEntries = 5000) {
    this.ttlMs = ttlMinutes * 60 * 1000;
    this.maxEntries = maxEntries;
  }

  has(messageId: string): boolean {
    const now = Date.now();
    const expiry = this.cache.get(messageId);
    if (!expiry) return false;
    if (now > expiry) {
      this.cache.delete(messageId);
      return false;
    }
    return true;
  }

  set(messageId: string): void {
    const now = Date.now();
    // Prune entries jika ukuran cache mendekati batas
    if (this.cache.size >= this.maxEntries) {
      for (const [id, exp] of this.cache.entries()) {
        if (now > exp) this.cache.delete(id);
      }
      if (this.cache.size >= this.maxEntries) {
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey) this.cache.delete(oldestKey);
      }
    }
    this.cache.set(messageId, now + this.ttlMs);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Instance global idempotency cache
const processedMessages = new IdempotencyCache(10);

// ==========================================
// 2. HELPER VERIFIKASI KEAMANAN TANDA TANGAN HMAC-SHA256
// ==========================================
function verifyMetaSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string | undefined
): boolean {
  if (!signatureHeader || !appSecret) {
    return false;
  }

  const parts = signatureHeader.split("=");
  if (parts.length !== 2 || parts[0] !== "sha256") {
    return false;
  }

  const providedHash = parts[1];
  const calculatedHash = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex");

  // Panjang hash wajib identik (64 hex characters) sebelum timingSafeEqual untuk menghindari exception
  if (providedHash.length !== calculatedHash.length) {
    return false;
  }

  try {
    const providedBuffer = Buffer.from(providedHash, "hex");
    const calculatedBuffer = Buffer.from(calculatedHash, "hex");
    if (providedBuffer.length !== calculatedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(providedBuffer, calculatedBuffer);
  } catch (err) {
    console.error("[Webhook WhatsApp] Gagal membandingkan timingSafeEqual:", err);
    return false;
  }
}

// ==========================================
// 3. GET HANDLER: Verifikasi Webhook Meta
// ==========================================
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const env = getSafeEnv();
  const verifyToken = env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[Webhook WhatsApp] Verifikasi handshake Meta GET BERHASIL");
    return new Response(challenge || "", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.warn(
    `[Webhook WhatsApp] Verifikasi handshake GAGAL. Mode: ${mode}, Token diterima: ${token}`
  );
  return new Response("Forbidden", { status: 403 });
}

// ==========================================
// 4. POST HANDLER: Penerimaan Pesan Masuk
// ==========================================
export async function POST(req: NextRequest) {
  const env = getSafeEnv();
  const appSecret = env.WHATSAPP_APP_SECRET;

  // 1. Baca raw body sekali untuk verifikasi tanda tangan
  const rawBody = await req.text();

  // 2. Verifikasi Keamanan Signature Header x-hub-signature-256
  const signatureHeader = req.headers.get("x-hub-signature-256");
  const isValidSignature = verifyMetaSignature(rawBody, signatureHeader, appSecret);

  if (!isValidSignature) {
    console.warn(
      "[Webhook WhatsApp] Tanda tangan x-hub-signature-256 TIDAK VALID. Permintaan ditolak."
    );
    return new Response("Unauthorized", { status: 401 });
  }

  // 3. Parse JSON Payload
  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
  } catch (err) {
    console.error("[Webhook WhatsApp] Format JSON payload rusak:", err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 4. Validasi Struktur WhatsApp Payload
  if (payload.object !== "whatsapp_business_account" && !payload.entry) {
    return NextResponse.json({ status: "ignored" }, { status: 200 });
  }

  const entry = payload.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;

  if (!value) {
    return NextResponse.json({ status: "no_value" }, { status: 200 });
  }

  // 5. ABAIKAN WEBHOOK STATUS (sent, delivered, read, failed) - Anti-Loop Mutlak
  if (value.statuses && Array.isArray(value.statuses) && value.statuses.length > 0) {
    const statusType = value.statuses[0]?.status;
    console.log(`[Webhook WhatsApp] Mengabaikan event status: ${statusType}`);
    return NextResponse.json({ status: "status_ignored" }, { status: 200 });
  }

  // 6. Cek Keberadaan Pesan Masuk
  const messages = value.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ status: "no_messages" }, { status: 200 });
  }

  const incomingMessage = messages[0];
  const messageId = incomingMessage.id;
  const fromNumber = incomingMessage.from;
  const messageType = incomingMessage.type;
  const senderName = value.contacts?.[0]?.profile?.name;

  console.log(
    `[Webhook WhatsApp] Pesan masuk dari ${fromNumber} (${senderName || "Anonim"}), Type: ${messageType}, ID: ${messageId}`
  );

  // 7. IDEMPOTENSI: Mencegah Balas Ganda
  if (processedMessages.has(messageId)) {
    console.log(`[Webhook WhatsApp] Pesan ${messageId} sudah diproses sebelumnya (Idempotent). Diabaikan.`);
    return NextResponse.json({ status: "duplicate_ignored" }, { status: 200 });
  }
  // Tandai pesan sudah diterima
  processedMessages.set(messageId);

  // 8. SAKLAR BOT: Cek apakah Auto-Reply sedang Aktif
  if (env.AUTO_REPLY_ENABLED !== "true") {
    console.log("[Webhook WhatsApp] AUTO_REPLY_ENABLED = false. Pesan dicatat tanpa balasan otomatis.");
    return NextResponse.json({ status: "auto_reply_disabled" }, { status: 200 });
  }

  // 9. Centang Biru (Mark as Read) secara Asinkron agar Pengalaman Responsif
  markMessageAsRead(messageId).catch((err) => {
    console.warn("[Webhook WhatsApp] Gagal markMessageAsRead:", err);
  });

  // 10. Tangani Pesan Non-Teks (Gambar, Audio, Dokumen, Stiker, dll.)
  if (messageType !== "text") {
    try {
      await sendWhatsAppTextMessage(fromNumber, BOT_PERSONA.nonTextMessage);
    } catch (err) {
      console.error("[Webhook WhatsApp] Gagal mengirim balasan non-teks:", err);
    }
    return NextResponse.json({ status: "non_text_handled" }, { status: 200 });
  }

  // 11. Tangani Pesan Teks Melalui Gemini API
  const userText = incomingMessage.text?.body || "";

  try {
    const aiReply = await generateGeminiReply(fromNumber, userText, senderName);
    await sendWhatsAppTextMessage(fromNumber, aiReply);
  } catch (err) {
    console.error("[Webhook WhatsApp] Gagal merumuskan atau mengirim balasan AI:", err);
    // Kirim balasan darurat fallback jika pengiriman utama gagal
    try {
      await sendWhatsAppTextMessage(fromNumber, BOT_PERSONA.fallbackMessage);
    } catch (sendErr) {
      console.error("[Webhook WhatsApp] Gagal mengirim pesan fallback:", sendErr);
    }
  }

  // Selalu kembalikan 200 OK ke Meta agar webhook tidak diblokir
  return NextResponse.json({ status: "success" }, { status: 200 });
}
