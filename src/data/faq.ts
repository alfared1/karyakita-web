export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FaqItem[] = [
  {
    id: "faq-1",
    question: "Apakah saya bisa memesan satu layanan saja (misalnya hanya desain logo atau hanya website)?",
    answer: "Tentu bisa. Meskipun KaryaKita memiliki 5 unit layanan yang saling terintegrasi dari hulu ke hilir, setiap unit bisnis dapat dipesan secara independen sesuai skala kebutuhan, prioritas, dan anggaran bisnis Anda saat ini."
  },
  {
    id: "faq-2",
    question: "Bagaimana sistem pembayaran untuk proyek B2B di KaryaKita?",
    answer: "Kami menerapkan skema akad syariah yang adil dan transparan (Zero Gharar): pembayaran DP 50% di muka setelah ruang lingkup kerja (scope of work) disepakati bersama secara tertulis, dan pelunasan 50% sisanya dilakukan setelah hasil final disetujui sebelum serah terima file master/source code. Khusus untuk tiket Workshop Publik AI Academy, pembayaran dilakukan lunas 100% di muka."
  },
  {
    id: "faq-3",
    question: "Berapa lama estimasi pengerjaan proyek desain atau pembuatan website?",
    answer: "Durasi bergantung pada kompleksitas ruang lingkup. Untuk paket identitas visual (logo & brand guideline) atau pembuatan landing page modern umumnya selesai dalam 1–3 pekan. Sedangkan untuk aplikasi web kustom (seperti dashboard internal, portal data, atau sistem informasi) berkisar 3–6 pekan dengan pembaruan progres terstruktur setiap pekan."
  },
  {
    id: "faq-4",
    question: "Siapa saja yang bisa mengikuti Workshop Publik KaryaKita AI Academy?",
    answer: "Program ini terbuka untuk siapa saja: mahasiswa, staf kantor, pemilik UMKM, pendidik/dosen, maupun masyarakat umum yang ingin menguasai teknik pemanfaatan AI (prompt engineering, otomasi dokumen, dan riset) untuk mempercepat pekerjaan harian. Tidak diperlukan latar belakang coding atau teknologi khusus."
  },
  {
    id: "faq-5",
    question: "Apakah KaryaKita melayani klien di luar wilayah Bogor dan Jabodetabek?",
    answer: "Ya, kami melayani klien dari seluruh Indonesia. Seluruh alur kerja—mulai dari konsultasi awal via WhatsApp/Google Meet, penyusunan proposal, pemantauan milestone proyek secara berkala, hingga sesi workshop online—telah dioptimalkan secara digital untuk kolaborasi jarak jauh yang efektif."
  },
  {
    id: "faq-6",
    question: "Bagaimana jaminan keamanan data dan kerahasiaan proyek klien?",
    answer: "Setiap proyek klien dilindungi perjanjian kerahasiaan resmi (NDA Klien). Akses terhadap data dan aset bisnis Anda dibatasi secara ketat hanya untuk tim inti yang bertugas. Kami juga 100% menggunakan perangkat lunak resmi dan modern tech stack legal tanpa perangkat bajakan demi menjaga keberkahan dan integritas hasil karya."
  }
];
