export interface PortfolioItem {
  id: string;
  title: string;
  categoryBadge: string;
  tagline: string;
  description: string;
  liveUrl: string;
  imagePath: string;
  highlights: string[];
  techStack: string[];
}

export const portfolioData: PortfolioItem[] = [
  {
    id: "karyakita-hub",
    title: "KaryaKita Hub",
    categoryBadge: "KaryaKita WebTech (Lini 2) & Design (Lini 1)",
    tagline: "Pusat komando operasional, pemantauan proyek, dan tata kelola keuangan syariah untuk tim digital.",
    description: "Aplikasi internal venture studio untuk mengoordinasikan beban kerja 7 anggota di 5 unit bisnis, memastikan disiplin pembayaran DP 50%, verifikasi Payment Gate, dan notulen syura mingguan.",
    liveUrl: "https://karyakita-hub.vercel.app/",
    imagePath: "/images/portfolio/karyakita-hub.webp",
    highlights: [
      "Papan tugas Kanban & Tabel dengan indikator beban kerja seimbang mahasiswa",
      "Modul Async Check-In mingguan (< 90 detik via ponsel) & arsip notulen Syura",
      "Payment Gate transparan dengan hak akses berbasis peran (RBAC Security)"
    ],
    techStack: ["Next.js App Router", "Tailwind CSS", "Prisma ORM", "PostgreSQL", "RBAC Security"]
  },
  {
    id: "si26-hub",
    title: "SI.26 Class Information Hub",
    categoryBadge: "KaryaKita WebTech (Lini 2) & Assist & Data (Lini 3)",
    tagline: "Portal informasi kelas, manajemen kas transparan, dan sistem presensi terintegrasi untuk 41 mahasiswa.",
    description: "Portal resmi kelas Sistem Informasi 2026 STMIK Tazkia yang memecahkan masalah pencatatan uang kas tercecer, rekap izin presensi, hitung mundur tugas kuliah, serta ruang aspirasi mahasiswa.",
    liveUrl: "https://hub-si26.vercel.app/",
    imagePath: "/images/portfolio/si26-hub.webp",
    highlights: [
      "Matriks kas 41 mahasiswa, buku kas bertingkat, & unggah bukti bayar mandiri 3 langkah",
      "Presensi mandiri berbasis NIM & ekspor laporan resmi Kemahasiswaan siap cetak A4/CSV",
      "Pelacak tenggat tugas kuliah waktu nyata (WIB) & forum berbagi ilmu/peluang anonim"
    ],
    techStack: ["Next.js", "Tailwind CSS", "Prisma ORM", "Neon PostgreSQL", "Cloud Storage S3/R2"]
  }
];
