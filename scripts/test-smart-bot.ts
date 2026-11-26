/**
 * Test Suite untuk Smart Bot Engine & Offline Resiliency
 * File: scripts/test-smart-bot.ts
 */

import { generateGeminiReply } from "../src/lib/ai/gemini-whatsapp";
import { getSmartKnowledgeReply, isKaryaKitaRelevant, clearActiveSessions } from "../src/lib/ai/smart-bot-engine";
import { BOT_PERSONA } from "../src/config/bot-persona";

async function runTests() {
  console.log("===============================================================");
  console.log("🧪 MEMULAI PENGUJIAN SMART BOT ENGINE & OFFLINE RESILIENCY");
  console.log("===============================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details ? "- " + details : ""}`);
      failed++;
    }
  }

  // 1. Test Sapaan / Greeting
  const replyGreeting = getSmartKnowledgeReply("Halo selamat siang", "Budi");
  assert(
    "Sapaan harus menyebut nama pengguna dan memperkenalkan KaryaKita",
    replyGreeting.includes("Kak Budi") && replyGreeting.includes("KaryaKita AI & Venture Studio")
  );

  // 2. Test AI Academy
  const replyAi = getSmartKnowledgeReply("saya mau ikut workshop ai batch 1 dong");
  assert(
    "Query AI Academy harus memuat info promo Rp25.000 dan link pendaftaran",
    replyAi.includes("Rp25.000") && replyAi.includes("https://karyakita-ai.vercel.app/daftar/ai-academy")
  );

  // 3. Test WebTech
  const replyWeb = getSmartKnowledgeReply("mau bikin landing page untuk bisnis");
  assert(
    "Query WebTech harus memuat info Landing Page, DP 50%, dan link order",
    replyWeb.includes("Landing Page Next.js") &&
      replyWeb.includes("DP 50%") &&
      replyWeb.includes("https://karyakita-ai.vercel.app/order?unit=webtech")
  );

  // 4. Test Design
  const replyDesign = getSmartKnowledgeReply("berapa biaya jasa desain logo dan figma?");
  assert(
    "Query Desain harus memuat info Logo Starter dan UI/UX Figma",
    replyDesign.includes("KaryaKita Design") && replyDesign.includes("https://karyakita-ai.vercel.app/order?unit=design")
  );

  // 5. Test Assist & Data
  const replyData = getSmartKnowledgeReply("bisa bantu olah data spss untuk skripsi?");
  assert(
    "Query Data harus memuat info SPSS dan statistik",
    replyData.includes("SPSS") && replyData.includes("KaryaKita Assist & Data")
  );

  // 6. Test Media
  const replyMedia = getSmartKnowledgeReply("mau pesan video reels dan tiktok");
  assert(
    "Query Media harus memuat info video dan affiliate",
    replyMedia.includes("Single Performance Video") && replyMedia.includes("KaryaKita Media")
  );

  // 7. Test Bundling
  const replyBundle = getSmartKnowledgeReply("ada paket bundling lengkap ga?");
  assert(
    "Query Bundling harus memuat Digital Launchpad dan Full Venture Transformation",
    replyBundle.includes("Digital Launchpad") && replyBundle.includes("Full Venture Transformation")
  );

  // 8. Test Pricelist
  const replyPrice = getSmartKnowledgeReply("minta pricelist daftar harga semua lini dong");
  assert(
    "Query Pricelist harus memuat ringkasan harga 5 lini bisnis",
    replyPrice.includes("Daftar Harga Resmi") && replyPrice.includes("Design") && replyPrice.includes("WebTech")
  );

  // 9. Test Payment & Syariah
  const replyPay = getSmartKnowledgeReply("rekening transfer kemana dan skemanya gimana?");
  assert(
    "Query Pembayaran harus memuat Bank BSI, DP 50%, dan akad Ijarah",
    replyPay.includes("Bank Syariah Indonesia (BSI)") &&
      replyPay.includes("7234891023") &&
      replyPay.includes("Ijarah")
  );

  // 10. Test Human Handover via generateGeminiReply
  const replyHandover = await generateGeminiReply("62812345678", "saya mau hubungi admin sekarang", "Ahmad");
  assert(
    "Keyword 'hubungi admin' harus memicu handover",
    replyHandover.includes("Tim Admin / Founder KaryaKita")
  );

  // 11. Test Resiliency generateGeminiReply saat GEMINI_API_KEY kosong (kondisi saat ini)
  const replyOffline = await generateGeminiReply("62812345678", "info kelas ai dong", "Siti");
  assert(
    "generateGeminiReply saat offline/no-key TIDAK BOLEH mengembalikan pesan kendala teknis",
    !replyOffline.includes("sedang mengalami sedikit kendala teknis") &&
      replyOffline.includes("KaryaKita AI Academy") &&
      replyOffline.includes("Rp25.000")
  );

  // 12. Test Unrecognized Query Fallback
  const replyGeneral = await generateGeminiReply("62812345678", "xyz123 random text", "Doni");
  assert(
    "Pesan yang tidak dikenali harus memberikan menu panduan ramah, BUKAN pesan error kendala teknis",
    !replyGeneral.includes("kendala teknis") && replyGeneral.includes("KaryaKita WebTech")
  );

  // 13. Test Filter Relevansi KaryaKita (Pesan Pribadi vs Pesan Bisnis)
  clearActiveSessions();
  assert(
    "Pesan pribadi sehari-hari 'Bro di mana?' HARUS diabaikan (false)",
    isKaryaKitaRelevant("Bro di mana?") === false
  );
  assert(
    "Pesan santai 'Besok kuliah jam berapa?' HARUS diabaikan (false)",
    isKaryaKitaRelevant("Besok kuliah jam berapa?") === false
  );
  assert(
    "Pesan pendek 'P' HARUS diabaikan (false)",
    isKaryaKitaRelevant("P") === false
  );
  assert(
    "Pesan jasa website HARUS dianggap relevan (true)",
    isKaryaKitaRelevant("halo mau tanya jasa pembuatan landing page", "628999111") === true
  );
  assert(
    "Pesan workshop AI HARUS dianggap relevan (true)",
    isKaryaKitaRelevant("info pendaftaran workshop ai batch 1") === true
  );
  assert(
    "Pesan pricelist harga HARUS dianggap relevan (true)",
    isKaryaKitaRelevant("minta pricelist biaya desain logo dong") === true
  );
  assert(
    "Percakapan lanjutan dari nomor yang sedang konsultasi HARUS diizinkan (true)",
    isKaryaKitaRelevant("oke yang itu berapa hari selesainya?", "628999111") === true
  );

  console.log("\n===============================================================");
  console.log(`HASIL AKHIR: ${passed} LULUS, ${failed} GAGAL`);
  console.log("===============================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test crash:", err);
  process.exit(1);
});
