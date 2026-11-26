/**
 * Bot WhatsApp Pribadi Berbasis Scan QR (Baileys) + Gemini AI
 * File: scripts/run-personal-wa.ts
 *
 * Cara Menjalankan:
 * npx tsx scripts/run-personal-wa.ts
 */

import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState as initMultiFileAuthState,
  fetchLatestBaileysVersion,
  WAMessage,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import pino from "pino";
import http from "http";
import fs from "fs";
import path from "path";
import { generateGeminiReply } from "../src/lib/ai/gemini-whatsapp";
import { BOT_PERSONA } from "../src/config/bot-persona";

// Load environment variables dari .env lalu .env.local (prioritas lebih tinggi)
for (const envFile of [".env", ".env.local"]) {
  const envPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const idx = trimmed.indexOf("=");
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
          if (val !== "" && (!process.env[key] || envFile === ".env.local")) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length >= 10);
if (!hasGeminiKey) {
  console.log("\n💡 INFO ENGINE: GEMINI_API_KEY belum terisi di .env.local.");
  console.log("   Bot otomatis berjalan dalam mode 'Smart Knowledge Engine' (Offline Cerdas).");
  console.log("   Bot siap menjawab lengkap tentang 5 lini bisnis, harga resmi, workshop AI Rp25rb, dan link order.");
  console.log("   (Opsional) Pasang GEMINI_API_KEY dari https://aistudio.google.com/app/apikey untuk mengaktifkan AI Generatif.\n");
} else {
  console.log("\n✅ ENGINE GEMINI AI AKTIF: Terhubung ke Google Gemini (" + (process.env.GEMINI_MODEL || "gemini-3.5-flash") + ") + Smart Fallback.\n");
}

// Port untuk Web QR (berguna jika di-deploy ke Free VPS / Render / Railway)
const PORT = process.env.PORT || 3001;
let currentQR: string | null = null;
let isConnected = false;
let connectedUser = "";

// Buat Web Server Ringan untuk melihat QR via Browser di HP atau Laptop
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

  if (isConnected) {
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>WhatsApp Bot - Terhubung</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: white; text-align: center; }
          .card { background: #1e293b; padding: 2rem; border-radius: 1rem; border: 1px solid #334155; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .badge { background: #059669; color: white; padding: 0.4rem 1rem; border-radius: 9999px; font-weight: bold; display: inline-block; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">● TERHUBUNG</div>
          <h2>Bot WhatsApp Aktif!</h2>
          <p>Akun: <b>${connectedUser}</b></p>
          <p style="color: ${hasGeminiKey ? "#34d399" : "#60a5fa"}; font-size: 0.85rem; font-weight: bold;">
            ${hasGeminiKey ? "✅ Gemini AI 3.5 Flash + Smart Fallback" : "⚡ Smart Knowledge Engine (Mode Offline Cerdas)"}
          </p>
          <p style="color: #94a3b8; font-size: 0.9rem;">
            ${hasGeminiKey ? "Bot AI siap membalas pesan masuk secara natural & otomatis 24/7." : "Bot siap menjawab tanya-jawab seputar 5 lini bisnis KaryaKita & link pesanan secara instan."}
          </p>
        </div>
      </body>
      </html>
    `);
    return;
  }

  if (currentQR) {
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(currentQR)}`;
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Scan QR WhatsApp Bot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="15">
        <style>
          body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: white; text-align: center; }
          .card { background: #1e293b; padding: 2rem; border-radius: 1rem; border: 1px solid #334155; max-width: 420px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          img { border-radius: 0.5rem; background: white; padding: 10px; margin: 1rem 0; }
          ol { text-align: left; color: #94a3b8; font-size: 0.85rem; line-height: 1.6; padding-left: 1.2rem; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2 style="margin-top: 0;">Scan QR WhatsApp</h2>
          <p style="color: #94a3b8; font-size: 0.9rem;">Pindai kode QR ini dari aplikasi WhatsApp di HP Anda:</p>
          <img src="${qrImageUrl}" alt="WhatsApp QR Code" width="280" height="280" />
          <ol>
            <li>Buka WhatsApp di HP Anda</li>
            <li>Ketuk <b>Menu (titik 3)</b> atau <b>Pengaturan</b></li>
            <li>Pilih <b>Perangkat Tertaut</b> > <b>Tautkan Perangkat</b></li>
            <li>Arahkan kamera HP ke kode QR di atas</li>
          </ol>
          <p style="font-size: 0.75rem; color: #64748b;">Halaman ini otomatis reload setiap 15 detik jika QR berubah.</p>
        </div>
      </body>
      </html>
    `);
    return;
  }

  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="refresh" content="3">
      <style>body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: white; }</style>
    </head>
    <body>
      <p>Sedang menyiapkan koneksi WhatsApp... Mohon tunggu sejenak.</p>
    </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`🌐 Web UI QR aktif di: http://localhost:${PORT}`);
});

async function startWhatsAppBot() {
  const authDir = path.resolve(process.cwd(), "auth_info_baileys");
  const { state, saveCreds } = await initMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();

  console.log("===============================================================");
  console.log(`🤖 MEMULAI BOT WHATSAPP PRIBADI + GEMINI AI (v${version.join(".")})`);
  console.log("===============================================================");

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    generateHighQualityLinkPreview: false,
  });

  // Event Update Koneksi & QR Code
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      currentQR = qr;
      isConnected = false;
      console.log("\n📱 SILAKAN PINDAI KODE QR BERIKUT MENGGUNAKAN WHATSAPP DI HP:");
      console.log("(WhatsApp > Titik Tiga / Pengaturan > Perangkat Tertaut > Tautkan Perangkat)\n");
      qrcode.generate(qr, { small: true });
      console.log(`\n💡 Anda juga bisa scan melalui browser di: http://localhost:${PORT}\n`);
    }

    if (connection === "close") {
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      isConnected = false;
      currentQR = null;

      console.warn(`[Koneksi Terputus] Status: ${statusCode}. Mencoba sambung ulang: ${shouldReconnect}`);

      if (shouldReconnect) {
        setTimeout(startWhatsAppBot, 3000);
      } else {
        console.error("❌ Anda telah keluar (Logged Out) dari WhatsApp. Menghapus sesi lama...");
        if (fs.existsSync(authDir)) {
          fs.rmSync(authDir, { recursive: true, force: true });
        }
        setTimeout(startWhatsAppBot, 2000);
      }
    } else if (connection === "open") {
      isConnected = true;
      currentQR = null;
      connectedUser = sock.user?.id ? sock.user.id.split(":")[0] : "Nomor Pribadi";

      console.log("\n===============================================================");
      console.log(`✅ BOT WHATSAPP PRIBADI BERHASIL TERHUBUNG!`);
      console.log(`📞 Nomor Aktif: +${connectedUser}`);
      console.log(`🧠 AI Engine: ${hasGeminiKey ? `Google Gemini Flash (${process.env.GEMINI_MODEL || "gemini-2.5-flash"}) + Smart Fallback` : "Smart Knowledge Engine (Mode Offline Cerdas)"}`);
      console.log(`🚀 Siap membalas pesan masuk secara otomatis!`);
      console.log("===============================================================\n");
    }
  });

  // Simpan Kredensial Saat Berubah
  sock.ev.on("creds.update", saveCreds);

  // Penanganan Pesan Masuk
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      await handleIncomingMessage(sock, msg);
    }
  });
}

// In-Memory Idempotency Cache untuk nomor pribadi (mencegah balas ganda)
const processedMsgMap = new Set<string>();

async function handleIncomingMessage(sock: ReturnType<typeof makeWASocket>, msg: WAMessage) {
  // 1. Abaikan pesan dari diri sendiri
  if (!msg.key || msg.key.fromMe) return;

  const remoteJid = msg.key.remoteJid;
  if (!remoteJid) return;

  // 2. Abaikan pesan broadcast status / story WA & channel newsletter
  if (
    remoteJid === "status@broadcast" ||
    remoteJid.includes("@broadcast") ||
    remoteJid.endsWith("@newsletter")
  ) {
    return;
  }

  // 3. Abaikan pesan grup (hanya balas pesan pribadi / direct message)
  if (remoteJid.endsWith("@g.us")) return;

  // 4. Idempotensi ID pesan
  const messageId = msg.key.id;
  if (messageId && processedMsgMap.has(messageId)) return;
  if (messageId) {
    processedMsgMap.add(messageId);
    // Hapus setelah 10 menit
    setTimeout(() => processedMsgMap.delete(messageId), 10 * 60 * 1000);
  }

  // 5. Ekstrak teks pesan (termasuk pesan sementara / disappearing & viewOnce)
  const rawContent = msg.message;
  if (!rawContent) return;
  const messageContent =
    rawContent.ephemeralMessage?.message ||
    rawContent.viewOnceMessage?.message ||
    rawContent.viewOnceMessageV2?.message ||
    rawContent;

  const userText =
    messageContent.conversation ||
    messageContent.extendedTextMessage?.text ||
    messageContent.imageMessage?.caption ||
    messageContent.videoMessage?.caption;

  const senderNumber = remoteJid.replace(/@.+$/, "");
  const senderName = msg.pushName || "Kawan";

  // 6. Tangani pesan non-teks (jika hanya kirim stiker/audio/gambar tanpa caption)
  if (!userText || userText.trim() === "") {
    console.log(`[WA Pribadi] Pesan non-teks dari ${senderNumber} (${senderName})`);
    await sock.sendMessage(remoteJid, { text: BOT_PERSONA.nonTextMessage }, { quoted: msg });
    return;
  }

  console.log(`[WA Pribadi] Pesan dari ${senderNumber} (${senderName}): "${userText}"`);

  // Tandai pesan sudah dibaca (centang biru)
  try {
    await sock.readMessages([msg.key]);
  } catch {}

  // 7. Hasilkan Balasan dari Gemini AI
  try {
    const aiReply = await generateGeminiReply(senderNumber, userText, senderName);

    // Kirim balasan dengan fitur quote ke pesan pengguna
    await sock.sendMessage(remoteJid, { text: aiReply }, { quoted: msg });
    console.log(`[WA Pribadi] Balasan AI terkirim ke ${senderNumber}`);
  } catch (err) {
    console.error("[WA Pribadi] Gagal membalas pesan:", err);
    await sock.sendMessage(remoteJid, { text: BOT_PERSONA.fallbackMessage }, { quoted: msg });
  }
}

// Jalankan Bot
startWhatsAppBot().catch((err) => {
  console.error("Fatal error saat menjalankan Bot WhatsApp Pribadi:", err);
});
