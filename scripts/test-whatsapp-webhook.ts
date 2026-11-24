/**
 * Skrip Uji Cepat Webhook WhatsApp & Integrasi Gemini
 * File: scripts/test-whatsapp-webhook.ts
 *
 * Cara Menjalankan:
 * npx tsx scripts/test-whatsapp-webhook.ts
 * atau:
 * node --experimental-strip-types scripts/test-whatsapp-webhook.ts
 */

import crypto from "crypto";
import { GET, POST } from "../src/app/api/webhook/whatsapp/route";
import { NextRequest } from "next/server";
import { splitMessage } from "../src/lib/whatsapp/client";
import { isHumanHandoverRequested } from "../src/config/bot-persona";

// Set environment variable simulasi untuk pengujian lokal
const TEST_APP_SECRET = "test_meta_app_secret_1234567890abcdef";
const TEST_VERIFY_TOKEN = "karyakita_test_verify_token_2026";

process.env.WHATSAPP_APP_SECRET = TEST_APP_SECRET;
process.env.WHATSAPP_VERIFY_TOKEN = TEST_VERIFY_TOKEN;
process.env.WHATSAPP_PHONE_NUMBER_ID = "1234567890";
process.env.WHATSAPP_ACCESS_TOKEN = "EAATestToken";
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSy_MockApiKeyForTest";
process.env.AUTO_REPLY_ENABLED = "true";

function generateSignature(body: string, secret: string): string {
  const hmac = crypto.createHmac("sha256", secret).update(body, "utf8").digest("hex");
  return `sha256=${hmac}`;
}

async function runTests() {
  console.log("===============================================================");
  console.log("🚀 MEMULAI PENGUJIAN WEBHOOK WHATSAPP & GEMINI AUTO-REPLY");
  console.log("===============================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(description: string, condition: boolean) {
    if (condition) {
      console.log(`✅ [PASS] ${description}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${description}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST 1: Verifikasi Webhook GET dengan Token Valid
  // -------------------------------------------------------------
  console.log("--- Uji 1: Verifikasi Handshake GET (Meta Webhook) ---");
  const challengeCode = "challenge_1122334455";
  const getReqValid = new NextRequest(
    `http://localhost:3000/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=${TEST_VERIFY_TOKEN}&hub.challenge=${challengeCode}`
  );
  const getResValid = await GET(getReqValid);
  const getBodyValid = await getResValid.text();

  assert("GET dengan hub.verify_token yang cocok harus mengembalikan status 200", getResValid.status === 200);
  assert("GET harus mengembalikan nilai hub.challenge apa adanya", getBodyValid === challengeCode);

  // -------------------------------------------------------------
  // TEST 2: Verifikasi Webhook GET dengan Token Salah
  // -------------------------------------------------------------
  console.log("\n--- Uji 2: Verifikasi Handshake GET dengan Token Salah ---");
  const getReqInvalid = new NextRequest(
    `http://localhost:3000/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=salah_token&hub.challenge=${challengeCode}`
  );
  const getResInvalid = await GET(getReqInvalid);
  assert("GET dengan token salah harus ditolak dengan status 403 Forbidden", getResInvalid.status === 403);

  // -------------------------------------------------------------
  // TEST 3: Keamanan POST - Tanda Tangan HMAC-SHA256 Tidak Valid
  // -------------------------------------------------------------
  console.log("\n--- Uji 3: Keamanan Signature Header x-hub-signature-256 ---");
  const samplePayload = JSON.stringify({ object: "whatsapp_business_account" });
  const postReqBadSig = new NextRequest("http://localhost:3000/api/webhook/whatsapp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hub-signature-256": "sha256=1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff",
    },
    body: samplePayload,
  });
  const postResBadSig = await POST(postReqBadSig);
  assert("POST dengan tanda tangan HMAC palsu harus ditolak dengan status 401 Unauthorized", postResBadSig.status === 401);

  // -------------------------------------------------------------
  // TEST 4: Anti-Loop - Pengabaian Webhook Status (sent, delivered, read)
  // -------------------------------------------------------------
  console.log("\n--- Uji 4: Anti-Loop Webhook Status Meta ---");
  const statusPayload = JSON.stringify({
    object: "whatsapp_business_account",
    entry: [
      {
        id: "WABA_ID",
        changes: [
          {
            field: "messages",
            value: {
              messaging_product: "whatsapp",
              metadata: { display_phone_number: "6280000", phone_number_id: "1234567890" },
              statuses: [
                {
                  id: "wamid.HBgL...",
                  status: "delivered",
                  timestamp: "1710000000",
                  recipient_id: "6281234567890",
                },
              ],
            },
          },
        ],
      },
    ],
  });
  const statusSig = generateSignature(statusPayload, TEST_APP_SECRET);
  const postReqStatus = new NextRequest("http://localhost:3000/api/webhook/whatsapp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hub-signature-256": statusSig,
    },
    body: statusPayload,
  });
  const postResStatus = await POST(postReqStatus);
  const statusJson = await postResStatus.json();
  assert("Event statuses harus mengembalikan 200 OK ke Meta", postResStatus.status === 200);
  assert("Event statuses harus berstatus 'status_ignored' tanpa memicu pesan balasan", statusJson.status === "status_ignored");

  // -------------------------------------------------------------
  // TEST 5: Penanganan Pesan Non-Teks (Gambar/Stiker/Audio)
  // -------------------------------------------------------------
  console.log("\n--- Uji 5: Penanganan Pesan Masuk Non-Teks ---");
  const nonTextPayload = JSON.stringify({
    object: "whatsapp_business_account",
    entry: [
      {
        id: "WABA_ID",
        changes: [
          {
            field: "messages",
            value: {
              messaging_product: "whatsapp",
              metadata: { display_phone_number: "6280000", phone_number_id: "1234567890" },
              contacts: [{ profile: { name: "Budi Santoso" }, wa_id: "6281234567890" }],
              messages: [
                {
                  from: "6281234567890",
                  id: "wamid.NON_TEXT_MSG_001",
                  timestamp: "1710000001",
                  type: "image",
                  image: { id: "media_id_123" },
                },
              ],
            },
          },
        ],
      },
    ],
  });
  const nonTextSig = generateSignature(nonTextPayload, TEST_APP_SECRET);
  const postReqNonText = new NextRequest("http://localhost:3000/api/webhook/whatsapp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hub-signature-256": nonTextSig,
    },
    body: nonTextPayload,
  });
  const postResNonText = await POST(postReqNonText);
  const nonTextJson = await postResNonText.json();
  assert("Pesan non-teks harus ditangani dengan status 200", postResNonText.status === 200);
  assert("Pesan non-teks harus menghasilkan respons non_text_handled", nonTextJson.status === "non_text_handled");

  // -------------------------------------------------------------
  // TEST 6: Idempotensi (Anti Balas Ganda pada Pesan Berulang)
  // -------------------------------------------------------------
  console.log("\n--- Uji 6: Idempotensi Pesan Masuk (Anti Balas Ganda) ---");
  // Mengirim kembali payload nonTextPayload dengan ID yang sama
  const postReqDuplicate = new NextRequest("http://localhost:3000/api/webhook/whatsapp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hub-signature-256": nonTextSig,
    },
    body: nonTextPayload,
  });
  const postResDuplicate = await POST(postReqDuplicate);
  const duplicateJson = await postResDuplicate.json();
  assert("Pengiriman ulang message.id yang sama harus diabaikan", duplicateJson.status === "duplicate_ignored");

  // -------------------------------------------------------------
  // TEST 7: Deteksi Kata Kunci Human Handover
  // -------------------------------------------------------------
  console.log("\n--- Uji 7: Guardrail Human Handover ---");
  assert("Kata kunci 'hubungi admin' harus dikenali sebagai handover", isHumanHandoverRequested("Permisi mau hubungi admin bisa?"));
  assert("Kata kunci 'bicara dengan manusia' harus dikenali sebagai handover", isHumanHandoverRequested("Saya ingin bicara dengan manusia"));
  assert("Pertanyaan reguler tidak boleh memicu handover", !isHumanHandoverRequested("Berapa estimasi waktu pengerjaan website landing page?"));

  // -------------------------------------------------------------
  // TEST 8: Pemecah Pesan Panjang (Safe 4096-char split)
  // -------------------------------------------------------------
  console.log("\n--- Uji 8: Pemecah Teks Pesan Panjang WhatsApp ---");
  const shortText = "Halo, ini pesan pendek.";
  assert("Pesan di bawah batas tidak boleh dipecah", splitMessage(shortText).length === 1);

  const longText = "Paragraf pertama.\n\n" + "A".repeat(3000) + "\n\nParagraf kedua.\n\n" + "B".repeat(2000);
  const splitChunks = splitMessage(longText, 3500);
  assert("Pesan di atas batas harus dipecah menjadi beberapa chunk", splitChunks.length > 1);
  assert("Setiap chunk harus di bawah batas maksimum", splitChunks.every((c) => c.length <= 3500));

  // -------------------------------------------------------------
  // TEST 9: Simulasi Pesan Teks Masuk (End-to-End Routing)
  // -------------------------------------------------------------
  console.log("\n--- Uji 9: Alur Pesan Teks Masuk (End-to-End Routing) ---");
  const textPayload = JSON.stringify({
    object: "whatsapp_business_account",
    entry: [
      {
        id: "WABA_ID",
        changes: [
          {
            field: "messages",
            value: {
              messaging_product: "whatsapp",
              metadata: { display_phone_number: "6280000", phone_number_id: "1234567890" },
              contacts: [{ profile: { name: "Siti Rahma" }, wa_id: "6289876543210" }],
              messages: [
                {
                  from: "6289876543210",
                  id: "wamid.TEXT_MSG_001",
                  timestamp: "1710000002",
                  type: "text",
                  text: { body: "Halo KaryaKita, saya ingin tahu apa saja layanan pembuatan website?" },
                },
              ],
            },
          },
        ],
      },
    ],
  });
  const textSig = generateSignature(textPayload, TEST_APP_SECRET);
  const postReqText = new NextRequest("http://localhost:3000/api/webhook/whatsapp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hub-signature-256": textSig,
    },
    body: textPayload,
  });
  const postResText = await POST(postReqText);
  const textJson = await postResText.json();
  assert("Pesan teks yang sah harus mengembalikan status 200 OK ke Meta", postResText.status === 200);
  assert("Pesan teks harus selesai diproses dengan status success", textJson.status === "success");

  // -------------------------------------------------------------
  // REKAPITULASI HASIL
  // -------------------------------------------------------------
  console.log("\n===============================================================");
  console.log(`HASIL AKHIR PENGUJIAN: ${passed} LULUS, ${failed} GAGAL`);
  console.log("===============================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("🎉 SEMUA UJI UNIT & INTEGRASI WEBHOOK WHATSAPP SELESAI DENGAN SEMPURNA!\n");
  }
}

runTests().catch((err) => {
  console.error("Terjadi error fatal saat menjalankan pengujian:", err);
  process.exit(1);
});
