export interface FounderProfile {
  id: string;
  name: string;
  nickname: string;
  role: string;
  unitFocus: string;
  avatarPath: string;
  shortBio: string;
  fullBio: string;
  skills: string[];
}

export const foundersData: FounderProfile[] = [
  {
    id: "alfatih",
    name: "Syauqi Muhammad Al Fatih",
    nickname: "Alfatih",
    role: "Chief Executive Officer (CEO), CTO / AI Officer & Kepala Akademi & R&D AI",
    unitFocus: "KaryaKita WebTech (Lini 2) & KaryaKita AI Academy (Lini 5)",
    avatarPath: "/images/team/alfatih.webp",
    shortBio: "Arsitek teknologi dan pemimpin visi KaryaKita yang memadukan pengembangan web, desain UI/UX, dan prompt engineering AI untuk melahirkan solusi digital serta edukasi AI terapan.",
    fullBio: "Memiliki minat kuat di bidang pendidikan, teknologi, keuangan, dan manajemen. Alfatih berfokus merancang arsitektur sistem web (UI/UX & Web Development), kreasi konten berbasis AI, prompt engineering, hingga pengembangan kurikulum praktis agar bisnis dan talenta muda mampu memanfaatkan kecerdasan buatan secara produktif dan beretika.",
    skills: ["AI & Prompt Engineering", "UI/UX & Web Dev", "Design Graphics", "Tech Leadership"]
  },
  {
    id: "ilham",
    name: "Ilham Akbar",
    nickname: "Ilham",
    role: "Chief Business Development Officer (CBDO) & Chief Data Officer (CDO)",
    unitFocus: "KaryaKita Assist & Data (Lini 3) & Pengembangan Kemitraan B2B",
    avatarPath: "/images/team/ilham.webp",
    shortBio: "Penggerak kemitraan bisnis dan digitalisasi UMKM yang menerjemahkan kebutuhan klien menjadi solusi sistem informasi, analisis bisnis, dan pengelolaan data terstruktur.",
    fullBio: "Menekuni bidang bisnis, manajemen, teknologi informasi, dan pengembangan UMKM. Ilham memimpin penjajakan klien B2B, analisis proses bisnis (business analysis), tata kelola data, serta pendampingan transformasi digital agar UMKM dan institusi mitra dapat bertumbuh secara terukur.",
    skills: ["Business Development", "UMKM Digitalization", "Business Analysis", "Data Management"]
  },
  {
    id: "hilwa",
    name: "Hilwa Mufida",
    nickname: "Hilwa",
    role: "Chief Operating Officer (COO) & Head of Project Management",
    unitFocus: "Operasional Lintas 5 Unit & Project Management Studio",
    avatarPath: "/images/team/hilwa.webp",
    shortBio: "Pengendali ritme operasional dan manajemen proyek yang memastikan setiap layanan klien serta agenda event KaryaKita selesai tepat waktu dengan standar Itqan.",
    fullBio: "Berfokus pada bidang bisnis, desain, dan manajemen. Hilwa mengawal dukungan bisnis digital (digital business support), editing, serta perencanaan dan eksekusi proyek maupun event studio agar kolaborasi lintas unit berjalan rapi, transparan, dan sesuai SLA klien.",
    skills: ["Project Management", "Event Operations", "Digital Business Support", "Editing"]
  },
  {
    id: "syarah",
    name: "Syarah Fauziah",
    nickname: "Syarah",
    role: "Chief Marketing Officer (CMO)",
    unitFocus: "KaryaKita Media & Affiliate (Lini 4) & Strategi Merek",
    avatarPath: "/images/team/syarah.webp",
    shortBio: "Perancang strategi pemasaran digital, branding, dan pengembangan produk yang membantu bisnis membangun citra kuat sekaligus mendorong pertumbuhan audiens secara organik.",
    fullBio: "Memadukan ketertarikan di bidang bisnis, manajemen, dan pemasaran dengan passion kuat pada industri kuliner (food business), digital marketing, content creation, serta product development. Syarah memimpin strategi komunikasi merek, kampanye promosi, dan pertumbuhan kanal digital KaryaKita maupun klien.",
    skills: ["Digital Marketing", "Branding & Promotion", "Content Creation", "Product Development"]
  },
  {
    id: "novita",
    name: "Novita Rani",
    nickname: "Novita",
    role: "Chief Financial Officer (CFO) & VP of Growth Systems",
    unitFocus: "Keuangan Syariah (Syirkah 'Abdan) & Sistem Pertumbuhan",
    avatarPath: "/images/team/novita.webp",
    shortBio: "Penjaga tata kelola keuangan syariah yang disiplin sekaligus perancang sistem promosi, pengolahan data operasional, dan dukungan manajemen proyek berbasis angka.",
    fullBio: "Menggabungkan ketelitian analitis dengan kreativitas di bidang bisnis, desain, sistem promosi, pengolahan data, editing, dan manajemen proyek/event. Novita memastikan transparansi arus kas, verifikasi Payment Gate, serta perhitungan Zakat dan bagi hasil Syirkah 'Abdan berjalan akuntabel.",
    skills: ["Syariah Finance", "Data Processing", "Promotion Systems", "Project & Event Mgmt"]
  },
  {
    id: "aywa",
    name: "Nazwa Azahra",
    nickname: "Aywa",
    role: "Chief Revenue Officer (CRO)",
    unitFocus: "KaryaKita AI Academy (Lini 5), Media & Affiliate (Lini 4) & Assist (Lini 3)",
    avatarPath: "/images/team/aywa.webp",
    shortBio: "Spesialis pertumbuhan pendapatan melalui jaringan afiliasi, promosi online-offline, dukungan eksekusi workshop AI Academy, serta layanan desain dan asistensi teknis.",
    fullBio: "Aktif mengembangkan strategi promosi produk pihak ketiga secara online maupun offline (jasa afiliasi), layanan desain grafis, editing, serta dukungan asistensi dan dokumentasi teknis. Aywa berperan penting memperluas jangkauan peserta KaryaKita AI Academy dan mesin konversi komersial studio.",
    skills: ["Affiliate & Promotion", "Revenue Growth", "Graphic Design & Editing", "Technical Assistance"]
  },
  {
    id: "ahmad",
    name: "Ahmad Maulana",
    nickname: "Joe",
    role: "Creative Director & Lead Multimedia Producer",
    unitFocus: "KaryaKita Design (Lini 1) & Produksi Multimedia KaryaKita Media (Lini 4)",
    avatarPath: "/images/team/ahmad.webp",
    shortBio: "Pengarah visual dan produser multimedia yang mengubah konsep bisnis menjadi identitas grafis tajam serta konten video berkinerja tinggi.",
    fullBio: "Berfokus penuh pada dunia editing dan desain visual. Ahmad mengawal standar estetika seluruh aset merek, materi kampanye, serta produksi video pendek dan multimedia agar setiap karya KaryaKita tampil profesional, konsisten, dan mudah dikenali audiens.",
    skills: ["Visual Design", "Video Editing", "Creative Direction", "Multimedia Production"]
  }
];
