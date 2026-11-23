export interface ServiceUnit {
  id: string;
  line: number;
  name: string;
  shortName: string;
  accentColor: string;
  badgeText: string;
  tagline: string;
  description: string;
  services: string[];
  ctaText: string;
  isSpecial?: boolean;
}

export const servicesData: ServiceUnit[] = [
  {
    id: "design",
    line: 1,
    name: "KaryaKita Design",
    shortName: "Design Studio",
    accentColor: "#7C3AED",
    badgeText: "Lini 1 · Brand Identity & UI/UX",
    tagline: "Brand Identity & UI/UX Design Studio",
    description: "Membangun wajah merek yang berkarakter dan antarmuka produk yang mudah digunakan. Cocok untuk bisnis baru maupun rebranding UMKM yang ingin tampil lebih meyakinkan.",
    services: [
      "Desain Logo & Panduan Identitas Merek",
      "Desain UI/UX Website & Aplikasi (Figma)",
      "Aset Visual Kampanye & Pitch Deck Professional"
    ],
    ctaText: "Tanya Paket Desain →"
  },
  {
    id: "webtech",
    line: 2,
    name: "KaryaKita WebTech",
    shortName: "Web Engineering",
    accentColor: "#0284C7",
    badgeText: "Lini 2 · Custom Web Engineering",
    tagline: "Custom Web Engineering & Digital Systems",
    description: "Merancang landing page berkonversi tinggi hingga aplikasi web kustom (dashboard, portal, & sistem informasi). Cepat, aman, responsif di HP, dan mudah dikembangkan.",
    services: [
      "Landing Page & Company Profile Modern",
      "Web App & Dashboard Internal Kustom",
      "Integrasi Database & Cloud Deployment (Vercel/Neon)"
    ],
    ctaText: "Diskusi Proyek Web →"
  },
  {
    id: "data",
    line: 3,
    name: "KaryaKita Assist & Data",
    shortName: "Assist & Data",
    accentColor: "#0D9488",
    badgeText: "Lini 3 · Technical Assistance & Data",
    tagline: "Technical Assistance & Data Digitalization",
    description: "Mendukung keputusan bisnis Anda lewat pengolahan data rapi, analisis proses, dan dokumentasi teknis yang terstruktur. Menghemat waktu tim inti dari pekerjaan administratif rumit.",
    services: [
      "Analisis Bisnis & Digitalisasi Alur UMKM",
      "Pengolahan, Pembersihan & Visualisasi Data",
      "Asistensi Teknis & Dokumentasi Sistem Informasi"
    ],
    ctaText: "Konsultasi Data →"
  },
  {
    id: "media",
    line: 4,
    name: "KaryaKita Media & Affiliate",
    shortName: "Media & Growth",
    accentColor: "#EA580C",
    badgeText: "Lini 4 · Performance Video & Growth",
    tagline: "Performance Short-Video & Growth Network",
    description: "Menghidupkan pesan merek melalui konten video pendek yang menarik dan jaringan promosi afiliasi. Dirancang untuk memperluas jangkauan audiens sekaligus mendorong konversi penjualan.",
    services: [
      "Produksi & Editing Video Pendek (Reels/TikTok)",
      "Strategi Konten & Manajemen Promosi Digital",
      "Kemitraan Afiliasi & Pemasaran Produk Terkurasi"
    ],
    ctaText: "Mulai Kampanye →"
  },
  {
    id: "academy",
    line: 5,
    name: "KaryaKita AI Academy",
    shortName: "AI Academy",
    accentColor: "#0F4C3A",
    badgeText: "Lini 5 · Corporate & Public AI Workshop",
    tagline: "Corporate & Public AI Applied Education",
    description: "Membekali tim perusahaan, pendidik, dan masyarakat umum agar mahir memanfaatkan AI secara praktis dan beretika. Fokus pada studi kasus nyata, bukan sekadar teori.",
    services: [
      "Workshop Publik AI One-to-Many (Rp75.000)",
      "In-House Corporate AI Training (B2B)",
      "Modul Prompt Engineering & Otomasi Kerja Harian"
    ],
    ctaText: "Lihat Jadwal Kelas →",
    isSpecial: true
  }
];
