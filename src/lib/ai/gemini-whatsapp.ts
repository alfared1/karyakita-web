/**
 * Gemini AI Integration untuk WhatsApp Auto-Reply
 * Menggunakan Official Google GenAI SDK (@google/genai)
 */

import { GoogleGenAI } from "@google/genai";
import { BOT_PERSONA, isHumanHandoverRequested } from "../../config/bot-persona";
import { getSafeEnv } from "../env";

interface ChatTurn {
  role: "user" | "model";
  text: string;
  timestamp: number;
}

interface UserSession {
  turns: ChatTurn[];
  lastActive: number;
  isHandedOver?: boolean;
}

// In-Memory Conversational Memory per nomor pengirim
const sessionStore = new Map<string, UserSession>();

/**
 * Membersihkan sesi yang telah melewati batas TTL (default 30 menit)
 */
function cleanupExpiredSessions(): void {
  const now = Date.now();
  const ttlMs = BOT_PERSONA.sessionTtlMinutes * 60 * 1000;

  for (const [phoneNumber, session] of sessionStore.entries()) {
    if (now - session.lastActive > ttlMs) {
      sessionStore.delete(phoneNumber);
    }
  }
}

/**
 * Mengambil atau menginisialisasi sesi percakapan untuk nomor tertentu
 */
function getOrCreateSession(phoneNumber: string): UserSession {
  cleanupExpiredSessions();

  const now = Date.now();
  let session = sessionStore.get(phoneNumber);

  if (!session) {
    session = { turns: [], lastActive: now, isHandedOver: false };
    sessionStore.set(phoneNumber, session);
  } else {
    // Reset memori jika jeda pesan terakhir sudah melebihi TTL
    const ttlMs = BOT_PERSONA.sessionTtlMinutes * 60 * 1000;
    if (now - session.lastActive > ttlMs) {
      session.turns = [];
      session.isHandedOver = false;
    }
    session.lastActive = now;
  }

  return session;
}

/**
 * Menyimpan pesan ke riwayat percakapan sesi dan menjaga batas maksimal turn
 */
function appendTurn(phoneNumber: string, role: "user" | "model", text: string): void {
  const session = getOrCreateSession(phoneNumber);
  session.turns.push({
    role,
    text,
    timestamp: Date.now(),
  });

  // Pangkas ke batas maksimum percakapan terakhir (contoh: 8 turn)
  if (session.turns.length > BOT_PERSONA.maxTurnHistory) {
    session.turns = session.turns.slice(-BOT_PERSONA.maxTurnHistory);
  }
}

/**
 * Menghasilkan balasan cerdas berbasis Gemini API menggunakan Google GenAI SDK resmi.
 *
 * @param fromNumber Nomor telepon pengirim (misal: "6281234567890")
 * @param userMessage Pesan teks yang dikirim pengguna
 * @param senderName Nama kontak pengirim dari metadata WhatsApp (opsional)
 */
export async function generateGeminiReply(
  fromNumber: string,
  userMessage: string,
  senderName?: string
): Promise<string> {
  const trimmedMessage = userMessage.trim();

  // 1. Cek Permintaan Human Handover
  if (isHumanHandoverRequested(trimmedMessage)) {
    const session = getOrCreateSession(fromNumber);
    session.isHandedOver = true;
    appendTurn(fromNumber, "user", trimmedMessage);
    appendTurn(fromNumber, "model", BOT_PERSONA.handoverMessage);

    console.log(`[Gemini AI] Human handover diaktifkan untuk nomor: ${fromNumber}`);
    return BOT_PERSONA.handoverMessage;
  }

  // 2. Baca Konfigurasi Lingkungan
  const env = getSafeEnv();
  const apiKey = env.GEMINI_API_KEY;
  const modelName = env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    console.error("[Gemini AI] GEMINI_API_KEY tidak ditemukan di environment.");
    return BOT_PERSONA.fallbackMessage;
  }

  // 3. Siapkan Sesi & Konteks Riwayat Percakapan
  const session = getOrCreateSession(fromNumber);

  // Jika nama pengirim diketahui, tambahkan konteks nama di pesan pengguna saat ini
  const contextualUserMessage = senderName
    ? `[Nama Pengirim: ${senderName}]: ${trimmedMessage}`
    : trimmedMessage;

  // Format riwayat percakapan untuk input GenAI SDK
  const contents = [
    ...session.turns.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    })),
    {
      role: "user" as const,
      parts: [{ text: contextualUserMessage }],
    },
  ];

  // 4. Panggil Gemini API dengan Timeout Pelindung (15 detik)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: BOT_PERSONA.systemInstruction,
        temperature: 0.7,
        abortSignal: controller.signal,
      },
    });

    clearTimeout(timeoutId);

    const replyText = response.text?.trim();

    if (!replyText) {
      console.warn("[Gemini AI] Model mengembalikan respon teks kosong.");
      return BOT_PERSONA.fallbackMessage;
    }

    // Simpan ke riwayat sesi lokal
    appendTurn(fromNumber, "user", trimmedMessage);
    appendTurn(fromNumber, "model", replyText);

    return replyText;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      console.error("[Gemini AI] Timeout: API Gemini memakan waktu lebih dari 15 detik.");
    } else {
      console.error("[Gemini AI] Error saat memanggil Gemini API:", err);
    }

    return BOT_PERSONA.fallbackMessage;
  }
}

/**
 * Utilitas untuk menginspeksi atau mereset memori sesi pengirim (berguna untuk testing atau debug)
 */
export function getSessionHistory(phoneNumber: string): ChatTurn[] {
  return sessionStore.get(phoneNumber)?.turns || [];
}

export function clearSession(phoneNumber: string): void {
  sessionStore.delete(phoneNumber);
}
