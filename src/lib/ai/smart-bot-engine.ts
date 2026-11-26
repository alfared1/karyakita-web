/**
 * Smart Local Knowledge Engine untuk Bot WhatsApp KaryaKita
 * Berfungsi sebagai Local Knowledge Core & Offline Fallback yang Cerdas.
 * 
 * Memastikan bot SELALU memberikan jawaban yang akurat, informatif, dan solutif
 * mengenai 5 unit bisnis KaryaKita, harga resmi, skema DP 50%, workshop AI Academy,
 * dan link order resmi — TANPA PERNAH mengembalikan pesan error teknis ke pengguna.
 */

import { BOT_PERSONA, isHumanHandoverRequested } from "../../config/bot-persona";

export interface IntentMatch {
  intent: string;
  response: string;
}

// In-Memory tracker nomor telepon yang sedang aktif dalam sesi tanya jawab KaryaKita (TTL 30 menit)
const activeKaryaKitaSessions = new Map<string, number>();

/**
 * Filter Relevansi KaryaKita:
 * Memastikan bot HANYA membalas pesan yang berkaitan dengan KaryaKita (layanan, harga, workshop, order).
 * Pesan pribadi sehari-hari dari teman/keluarga (misal: "Bro di mana?", "Besok kuliah ga?") diabaikan agar dijawab manual oleh pemilik.
 */
export function isKaryaKitaRelevant(text: string, fromNumber?: string): boolean {
  if (!text || text.trim() === "") return false;

  const norm = normalizeText(text);
  const now = Date.now();
  const sessionTtlMs = 30 * 60 * 1000;

  // 1. Jika nomor ini sedang aktif dalam sesi konsultasi KaryaKita dalam 30 menit terakhir, izinkan percakapan lanjutan
  if (fromNumber) {
    const lastTime = activeKaryaKitaSessions.get(fromNumber);
    if (lastTime && now - lastTime < sessionTtlMs) {
      activeKaryaKitaSessions.set(fromNumber, now);
      return true;
    }
  }

  // 2. Daftar Kata Kunci Relevan Seputar KaryaKita, 5 Lini Bisnis, & Layanan Komersial
  const businessKeywords = [
    // Entitas & Brand
    "karyakita", "karya kita", "venture studio", "studio", "tazkia",

    // Lini 1: Design
    "desain", "design", "logo", "figma", "ui", "ux", "branding", "brand",
    "visual identity", "mockup", "guideline", "identitas visual", "bikin logo", "jasa logo",

    // Lini 2: WebTech
    "web", "website", "landing page", "landingpage", "webtech", "nextjs",
    "frontend", "backend", "dashboard", "aplikasi web", "custom web",
    "bikin web", "jasa web", "buat web", "buatkan web", "pembuatan web",
    "domain", "hosting", "sistem informasi", "coding",

    // Lini 3: Assist & Data
    "data", "olah data", "statistik", "spss", "analisis data", "skripsi",
    "tesis", "sop", "pitch deck", "pitchdeck", "feasibility", "kelayakan",
    "studi kelayakan", "bantu data",

    // Lini 4: Media & Affiliate
    "video", "reels", "tiktok", "konten", "promosi video", "video produk",
    "affiliate", "afiliasi", "komisi", "co selling", "co-selling", "marketing video",

    // Lini 5: AI Academy
    "academy", "ai academy", "workshop", "pelatihan", "kelas ai",
    "belajar ai", "webinar", "materi ai", "prompt", "sertifikat",
    "batch 1", "promo 25", "25.000", "25rb", "rp25", "daftar ai",
    "kursus ai", "training ai",

    // Paket Bundling
    "bundle", "bundling", "launchpad", "transformasi", "paket hemat", "paket lengkap",

    // Transaksional / Komersial / Keuangan
    "harga", "price", "pricelist", "daftar harga", "tarif", "biaya",
    "ongkos", "bayar berapa", "berapaan", "fee", "order", "pesan",
    "booking", "pembayaran", "bayar", "rekening", "norek", "bsi", "transfer",
    "invoice", "dp", "down payment", "portofolio", "portfolio", "contoh karya",
    "akad", "syariah", "ijarah", "riba",

    // Pertanyaan Jasa & Konsultasi
    "jasa", "layanan", "bisa bantu buat", "bisa buatin", "bisa bikinin",
    "ada jasa", "apakah melayani", "konsultasi",

    // Pesan Proyek & Alur Order
    "pesan proyek", "order proyek", "mau pesan", "mau order", "bikin order",
    "cara pesan", "cara order", "form order", "link order", "alur order",
    "status order", "pantau pesanan", "monitor", "bikin web", "pesan desain",

    // Human Handover & Perwakilan Tim
    "hubungi admin", "bicara dengan manusia", "bicara admin", "cs manusia",
    "kontak owner", "kontak admin", "chat admin", "chat manusia",
    "operator", "customer service", "perwakilan tim", "hubungi tim",
    "kontak tim", "kontak perwakilan", "bicara dengan tim", "founder", "pic tim"
  ];

  const words = norm.split(" ");
  const isMatched = businessKeywords.some((kw) => {
    // Jika kata kunci pendek (<= 3 huruf seperti "web", "ui", "ux", "dp"), harus cocok sebagai kata utuh
    if (kw.length <= 3) {
      return words.includes(kw);
    }
    return norm.includes(kw);
  });

  if (isMatched && fromNumber) {
    activeKaryaKitaSessions.set(fromNumber, now);
  }

  return isMatched;
}

/**
 * Utilitas untuk mengosongkan riwayat nomor aktif (berguna untuk testing)
 */
export function clearActiveSessions(): void {
  activeKaryaKitaSessions.clear();
}

/**
 * Normalisasi teks input pengguna untuk pencarian keyword yang tangguh
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Menghasilkan balasan berbasis Local Knowledge Engine yang cerdas
 */
export function getSmartKnowledgeReply(userMessage: string, senderName?: string): string {
  const norm = normalizeText(userMessage);
  const nameTag = senderName && senderName.trim() !== "" ? `Kak ${senderName}` : "Kak";

  // 1. Cek Human Handover / Hubungi Perwakilan Tim
  if (isHumanHandoverRequested(userMessage)) {
    return BOT_PERSONA.handoverMessage;
  }

  // 1.1 Intent Khusus: Pesan Proyek & Alur Order B2B
  const orderKeywords = [
    "pesan proyek", "order proyek", "mau pesan proyek", "mau pesan", "mau order",
    "bikin proyek", "buat proyek", "cara pesan", "cara order", "link order",
    "form order", "formulir order", "formulir pemesanan", "alur pemesanan",
    "bagaimana cara pesan", "gimana cara order", "order b2b", "pesan web", "pesan desain"
  ];
  if (orderKeywords.some((k) => norm.includes(k))) {
    return `📝 *Panduan Pemesanan Proyek Resmi KaryaKita*

Halo ${nameTag}! Untuk menjamin transparansi akad dan keamanan transaksi, seluruh pemesanan proyek B2B diproses secara resmi melalui portal terintegrasi kami:

🚀 *3 Langkah Mudah Memesan Proyek:*
1️⃣ *Buka Formulir Pemesanan:*
   👉 https://karyakita-ai.vercel.app/order
   Pilih unit layanan yang Anda butuhkan (*WebTech, Design, Assist & Data, Media, atau Bundling*).
2️⃣ *Akad Syariah DP 50% di Awal:*
   Transfer komitmen DP 50% (Akad Ijarah bi al-'Amal) ke rekening resmi BSI Studio (an. *KaryaKita Studio / Novita Rani CFO*). Transaksi bebas gharar & tanpa denda bunga riba!
3️⃣ *Akses Portal Monitoring Real-Time:*
   Setelah verifikasi pembayaran, Anda akan langsung mendapatkan tautan monitoring live (https://karyakita-ai.vercel.app/monitor/[orderCode]) yang tersinkronisasi langsung dengan sistem *KaryaKita Hub OS* untuk memantau progres pengerjaan, status perbaikan/revisi, dan serah terima hasil akhir.

💬 Perlu konsultasi ruang lingkup sebelum memesan? Ketik *hubungi perwakilan tim* untuk berdiskusi langsung dengan tim kami!`;
  }

  // 2. Intent: Sapaan / Salam / Greeting
  const greetingKeywords = [
    "halo", "hello", "hai", "hi", "hey", "helo",
    "assalamu", "assalamualaikum", "assalam", "samlikum", "salam",
    "selamat pagi", "selamat siang", "selamat sore", "selamat malam",
    "ping", "halo bot", "karyakita"
  ];
  const words = norm.split(" ");
  const isGreetingWord = words.some((w) => ["pagi", "siang", "sore", "malam", "halo", "hai", "p", "tes", "test"].includes(w));
  if (
    (greetingKeywords.some((k) => norm.includes(k)) || isGreetingWord) &&
    norm.length < 35 &&
    !norm.includes("video") &&
    !norm.includes("bundle") &&
    !norm.includes("harga") &&
    !norm.includes("web")
  ) {
    return `Halo ${nameTag}! Selamat datang di *KaryaKita AI & Venture Studio*. 🙏

Kami adalah venture studio digital yang digerakkan oleh 7 mahasiswa Sistem Informasi STMIK Tazkia, siap membantu bisnis & institusi Anda dengan solusi digital modern berstandar syariah.

Ada yang bisa kami bantu hari ini? Anda bisa menanyakan seputar:
1️⃣ *Website & Landing Page* (KaryaKita WebTech)
2️⃣ *Workshop AI Academy* (Promo Batch 1 cuma Rp25.000!)
3️⃣ *Desain Logo & UI/UX* (KaryaKita Design)
4️⃣ *Olah Data & Pitch Deck* (KaryaKita Assist & Data)
5️⃣ *Video Konten & Affiliate* (KaryaKita Media)
💰 *Daftar Harga & Paket Bundling*

📌 *Perintah Cepat:*
• Ketik *pesan proyek* untuk membuka form order & skema DP 50%
• Ketik *hubungi perwakilan tim* untuk berdiskusi langsung dengan PIC
Website resmi: https://karyakita-ai.vercel.app`;
  }

  // 3. Intent: Workshop AI Academy (Batch 1 Promo Rp25.000)
  const aiKeywords = [
    "academy", "ai academy", "workshop", "pelatihan", "kelas ai",
    "belajar ai", "webinar", "materi ai", "prompt", "sertifikat",
    "batch 1", "promo 25", "25.000", "25rb", "rp25", "daftar ai",
    "kursus", "training ai"
  ];
  if (aiKeywords.some((k) => norm.includes(k))) {
    return `🎓 *KaryaKita AI Academy (Lini 5)*

Program edukasi & akselerasi kecerdasan buatan praktis untuk mahasiswa, profesional, dan pelaku usaha.

🔥 *PROMO SPESIAL BATCH 1: Workshop Publik*
• Harga Promo: *Rp25.000* (Diskon dari harga normal Rp75.000)
• Fasilitas: Akses live interactive, template AI prompt siap pakai, studi kasus nyata, dan e-sertifikat resmi.
• Pembayaran: 100% lunas di muka (verifikasi pembayaran langsung).

📌 *Layanan Korporat / In-House:*
• Corporate In-House AI Training: *Rp1.500.000*
• Executive AI Advisory (1-on-1): *Rp750.000*

🔗 *Daftar Workshop Batch 1 Sekarang:*
https://karyakita-ai.vercel.app/daftar/ai-academy

Slot promo terbatas untuk Batch 1 ya ${nameTag}!`;
  }

  // 4. Intent: WebTech / Website / Landing Page
  const webKeywords = [
    "web", "website", "landing page", "landingpage", "webtech",
    "nextjs", "frontend", "backend", "dashboard", "aplikasi web",
    "custom web", "bikin web", "jasa web", "buat web", "buatkan web"
  ];
  if (webKeywords.some((k) => norm.includes(k))) {
    return `💻 *KaryaKita WebTech (Lini 2)*

Layanan pembuatan website modern berbasis *Next.js App Router* dan cloud serverless yang cepat, responsif di ponsel, dan SEO-friendly.

📋 *Pilihan Paket:*
1. *Landing Page Next.js*: Mulai *Rp1.250.000* (DP 50%: Rp625.000)
   Cocok untuk promosi produk, UMKM, personal branding, & event.
2. *Corporate Website*: Mulai *Rp2.500.000* (DP 50%: Rp1.250.000)
   Multi-halaman, profil perusahaan, struktur SEO lengkap, & CMS.
3. *Custom Web App & Dashboard*: Mulai *Rp3.500.000* (DP 50%: Rp1.750.000)
   Sistem database (PostgreSQL), login role-based, & manajemen operasional.

🛡️ *Skema Pembayaran Syariah:*
DP 50% di muka sebagai pengikat komitmen produksi (Akad Ijarah), pelunasan 50% setelah website selesai dan disetujui bersama (*zero riba*).

🔗 *Formulir Pemesanan Resmi:*
https://karyakita-ai.vercel.app/order?unit=webtech`;
  }

  // 5. Intent: Design / Logo / UI UX / Branding
  const designKeywords = [
    "desain", "design", "logo", "figma", "ui", "ux", "branding",
    "visual identity", "mockup", "brand guideline", "identitas visual",
    "bikin logo", "jasa logo"
  ];
  if (designKeywords.some((k) => norm.includes(k))) {
    return `🎨 *KaryaKita Design (Lini 1)*

Identitas visual dan desain antarmuka digital yang berkarakter kuat, estetik, dan fungsional.

📋 *Pilihan Paket:*
• *Brand Identity & Logo Starter*: Mulai *Rp500.000* (DP 50%: Rp250.000)
  Konsep logo orisinal, filosofi brand, palet warna, & format master (SVG/PNG/PDF).
• *Full Visual Identity & Guidelines*: Mulai *Rp1.000.000* (DP 50%: Rp500.000)
  Panduan identitas merek komprehensif, tipografi, kartu nama, & template medsos.
• *UI/UX Design Figma*: Mulai *Rp1.500.000* (DP 50%: Rp750.000)
  High-fidelity wireframe, sistem komponen Figma, dan interactive prototype aplikasi.

🔗 *Formulir Pemesanan Desain:*
https://karyakita-ai.vercel.app/order?unit=design`;
  }

  // 6. Intent: Assist & Data / Skripsi / Olah Data / SOP / Pitch Deck
  const dataKeywords = [
    "data", "olah data", "statistik", "spss", "analisis data",
    "skripsi", "tesis", "sop", "pitch deck", "pitchdeck",
    "feasibility", "kelayakan", "studi kelayakan", "assist", "bantu data"
  ];
  if (dataKeywords.some((k) => norm.includes(k))) {
    return `📊 *KaryaKita Assist & Data (Lini 3)*

Dukungan riset data, olah data statistik kuantitatif, dan penyusunan dokumen bisnis strategis.

📋 *Pilihan Paket:*
• *Data Cleaning & Analisis Statistik*: Mulai *Rp250.000* (DP 50%: Rp125.000)
  Olah data SPSS/Python, uji instrumen (validitas/reliabilitas), regresi, & interpretasi ilmiah.
• *Pitch Deck & SOP*: Mulai *Rp500.000* (DP 50%: Rp250.000)
  Slide presentasi bisnis persuasif untuk investor & dokumen standar operasional rapi.
• *Studi Kelayakan Bisnis*: Mulai *Rp1.000.000* (DP 50%: Rp500.000)
  Riset pasar mendalam, proyeksi cash-flow, dan analisis kelayakan investasi.

🔗 *Konsultasi & Order Layanan Data:*
https://karyakita-ai.vercel.app/order?unit=assist`;
  }

  // 7. Intent: Media & Affiliate / Video
  const mediaKeywords = [
    "media", "video", "affiliate", "tiktok", "reels", "konten",
    "promosi video", "video produk", "afiliasi", "komisi",
    "co selling", "marketing", "bikin video"
  ];
  if (mediaKeywords.some((k) => norm.includes(k))) {
    return `🎬 *KaryaKita Media & Affiliate (Lini 4)*

Produksi video promosi berkonversi tinggi dan jaringan promosi afiliasi digital.

📋 *Pilihan Paket:*
• *Single Performance Video*: *Rp150.000* (DP 50%: Rp75.000)
  1 video vertikal (Reels/TikTok) dengan hook persuasif, audio jernih, & visual dinamis.
• *Monthly Growth (10 Video)*: *Rp1.250.000* (DP 50%: Rp625.000)
  Paket konten video bulanan terencana untuk membangun konsistensi brand Anda.
• *Dedicated Affiliate Co-Selling*: *Rp500.000* (DP 50%: Rp250.000) + bagi hasil komisi penjualan (10%–25%).

🔗 *Formulir Pemesanan Media:*
https://karyakita-ai.vercel.app/order?unit=media`;
  }

  // 8. Intent: Bundling / Paket Hemat
  const bundleKeywords = [
    "bundle", "bundling", "paket hemat", "paket lengkap", "launchpad",
    "transformasi", "semua layanan", "paket komplit", "borongan"
  ];
  if (bundleKeywords.some((k) => norm.includes(k))) {
    return `🚀 *Paket Bundling Ekosistem KaryaKita*

Akselerasi bisnis Anda dengan paket gabungan lintas lini berbiaya jauh lebih hemat:

1. *Digital Launchpad Bundle*: *Rp2.500.000* (DP 50%: Rp1.250.000)
   • Brand Identity & Logo Master
   • Landing Page Next.js Cepat & Modern
   • 3 Video Konten Promosi Media Sosial
   • Dokumen SOP Bisnis Dasar

2. *Full Venture Transformation*: *Rp4.500.000* (DP 50%: Rp2.250.000)
   • Full Brand Guidelines & Design System
   • Corporate Website / Web App + Dashboard
   • 10 Video Konten Bulanan
   • In-House AI Workflow Training untuk tim internal

🔗 *Formulir Pemesanan Bundling:*
https://karyakita-ai.vercel.app/order?unit=bundle`;
  }

  // 9. Intent: Pricelist / Daftar Harga / Biaya
  const priceKeywords = [
    "harga", "price", "pricelist", "daftar harga", "tarif",
    "biaya", "ongkos", "bayar berapa", "berapaan", "fee"
  ];
  if (priceKeywords.some((k) => norm.includes(k))) {
    return `💰 *Daftar Harga Resmi Layanan KaryaKita:*\n
🎨 *1. KaryaKita Design:* Mulai Rp500 rb (Logo, Branding, UI/UX Figma)
💻 *2. KaryaKita WebTech:* Mulai Rp1,25 jt (Landing Page Next.js, Corporate Web, Web App)
📊 *3. KaryaKita Assist & Data:* Mulai Rp250 rb (Olah data SPSS, Pitch Deck, SOP)
🎬 *4. KaryaKita Media:* Mulai Rp150 rb (Video Reels/TikTok & Affiliate Co-Selling)
🎓 *5. KaryaKita AI Academy:* *Promo Batch 1 Rp25.000* (Corporate Training Rp1,5 jt)
🚀 *Paket Bundling Launchpad:* Rp2,5 jt (Brand + Web + 3 Video + SOP)

🛡️ Semua pengerjaan proyek B2B menerapkan *Akad Syariah DP 50% di muka* dan pelunasan setelah selesai.

🔗 *Formulir Pemesanan & Hitung Estimasi:*
https://karyakita-ai.vercel.app/order`;
  }

  // 10. Intent: Pembayaran / Rekening / Transfer / Skema Syariah
  const paymentKeywords = [
    "pembayaran", "bayar", "rekening", "bsi", "transfer", "invoice",
    "akad", "syariah", "ijarah", "dp", "denda", "bunga", "riba", "norek"
  ];
  if (paymentKeywords.some((k) => norm.includes(k))) {
    return `🛡️ *Tata Cara Pembayaran & Skema Syariah KaryaKita*

KaryaKita menjalankan prinsip *Akad Ijarah bi al-'Amal* (jasa kerja profesional) yang adil dan transparan:

1. *DP 50% di Muka*: Sebagai ikatan komitmen awal pengerjaan.
2. *Pelunasan 50%*: Ditransfer setelah hasil pengerjaan selesai dan Anda setujui.
3. *Zero Riba*: Bebas dari denda bunga keterlambatan.

💳 *Rekening Resmi Perusahaan:*
• Bank: *Bank Syariah Indonesia (BSI)*
• Atas Nama: *KaryaKita Studio / Novita Rani (CFO)*
• No. Rekening: *7234891023*

⚠️ *Penting:* Untuk kemudahan verifikasi otomatis dan mendapatkan kode tiket pesanan resmi, silakan submit pesanan Anda melalui portal:
https://karyakita-ai.vercel.app/order`;
  }

  // 11. Intent: Portofolio & Sistem yang Sudah Dibuat
  const portfolioKeywords = [
    "portofolio", "portfolio", "contoh web", "hasil karya", "karya",
    "project", "proyek", "studi kasus", "si26", "karyakita hub"
  ];
  if (portfolioKeywords.some((k) => norm.includes(k))) {
    return `🌐 *Portofolio & Karya Nyata KaryaKita*

Kami telah merancang dan mengoperasikan sistem digital live:

1. *KaryaKita Hub* (https://karyakita-hub.vercel.app/)
Pusat komando operasional internal venture studio untuk manajemen tugas 7 anggota, presensi kilat, dan tata kelola keuangan syariah.

2. *SI.26 Class Information Hub* (https://hub-si26.vercel.app/)
Portal informasi kelas resmi untuk 41 mahasiswa Sistem Informasi STMIK Tazkia yang mengelola kas transparan, presensi berbasis NIM, dan deadline tugas.

Lihat tampilan dan solusi lengkapnya di website kami:
🔗 https://karyakita-ai.vercel.app/#portofolio`;
  }

  // 12. Intent: Tentang Studio / Lokasi / Tim / Pendiri
  const aboutKeywords = [
    "siapa", "tentang", "lokasi", "alamat", "kantor", "tazkia",
    "bogor", "kampus", "pendiri", "founder", "alfatih", "tim", "latar belakang"
  ];
  if (aboutKeywords.some((k) => norm.includes(k))) {
    return `🏢 *Tentang KaryaKita AI & Venture Studio*

KaryaKita adalah AI & Venture Studio yang diinisiasi oleh 7 mahasiswa program studi Sistem Informasi STMIK Tazkia, Bogor, di bawah kepemimpinan *Syauqi Muhammad Al Fatih (Alfatih)*.

📍 *Lokasi:* Sentul City, Bogor, Jawa Barat (Kampus STMIK Tazkia).
Prinsip kerja kami berlandaskan nilai-nilai etika Islam: Shiddiq, Amanah, Fathanah, dan Tabligh.

Informasi lengkap profil tim:
🔗 https://karyakita-ai.vercel.app/#tim`;
  }

  // 13. Default Smart Directory (Pengganti pesan kendala teknis)
  return `Halo ${nameTag}! Terima kasih telah menghubungi *KaryaKita AI & Venture Studio*. 🙏

Kami siap membantu kebutuhan digitalisasi, pengembangan web, desain, olah data, dan pelatihan AI untuk bisnis maupun organisasi Anda.

Berikut panduan layanan kami:
1️⃣ *KaryaKita WebTech*: Landing page & web app cepat (mulai Rp1,25 jt)
2️⃣ *KaryaKita AI Academy*: Workshop AI praktis (Promo Batch 1 cuma Rp25.000!)
3️⃣ *KaryaKita Design*: Logo & UI/UX Figma (mulai Rp500 rb)
4️⃣ *KaryaKita Assist & Data*: Olah data statistik, SOP & Pitch Deck (mulai Rp250 rb)
5️⃣ *KaryaKita Media*: Video performa TikTok/Reels & Affiliate co-selling

🔗 *Tautan Resmi:*
• Website Utama: https://karyakita-ai.vercel.app
• Pesan Proyek (DP 50% Syariah): https://karyakita-ai.vercel.app/order
• Daftar Workshop AI Batch 1: https://karyakita-ai.vercel.app/daftar/ai-academy

📌 *Perintah Cepat Chat:*
• Ketik *pesan proyek* untuk panduan order & monitoring real-time
• Ketik *hubungi perwakilan tim* untuk berdiskusi dengan PIC`;
}
