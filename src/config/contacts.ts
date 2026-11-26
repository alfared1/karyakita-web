export interface TeamRepresentative {
  id: string;
  name: string;
  role: string;
  unit: string;
  phone: string;
  expertise: string;
}

export interface ContactConfig {
  whatsappB2BNumber: string;
  academyRegistrationUrl: string;
  officialEmail: string;
  socials: {
    instagram: string;
    tiktok: string;
    linkedin: string;
  };
  representatives: TeamRepresentative[];
}

// Konfigurasi terpusat jalur kontak & pendaftaran KaryaKita
export const contacts: ContactConfig = {
  whatsappB2BNumber: "6281283626244", // Hotline Resmi Studio & AI Chatbot
  academyRegistrationUrl: "https://karyakita-ai.vercel.app/daftar/ai-academy",
  officialEmail: "official@karyakita.id",
  socials: {
    instagram: "https://instagram.com/karyakita.id",
    tiktok: "https://tiktok.com/@karyakita.id",
    linkedin: "https://linkedin.com/company/karyakita",
  },
  representatives: [
    {
      id: "alfatih",
      name: "Syauqi Muhammad Al Fatih",
      role: "CEO / CTO & Kepala AI R&D",
      unit: "KaryaKita WebTech & AI Academy",
      phone: "6281283626244",
      expertise: "Konsultasi Web Next.js, Custom Web App, & Workshop AI",
    },
    {
      id: "hilwa",
      name: "Hilwa Mufida",
      role: "COO & Head of Project Management",
      unit: "Operasional Studio & SLA Pengerjaan",
      phone: "6281283626244",
      expertise: "Timeline Proyek, Manajemen Tugas, & Standar Kualitas (Itqan)",
    },
    {
      id: "ilham",
      name: "Ilham Akbar",
      role: "CBDO & Chief Data Officer",
      unit: "KaryaKita Assist & Data",
      phone: "6281283626244",
      expertise: "Kemitraan B2B, Olah Data Statistik SPSS, SOP & Pitch Deck",
    },
    {
      id: "ahmad",
      name: "Ahmad Maulana (Joe)",
      role: "Creative Director",
      unit: "KaryaKita Design (Lini 1)",
      phone: "6281283626244",
      expertise: "Brand Identity, Desain Logo, Guideline & Prototype UI/UX",
    },
    {
      id: "syarah",
      name: "Syarah Fauziah",
      role: "Chief Marketing Officer (CMO)",
      unit: "KaryaKita Media & Affiliate (Lini 4)",
      phone: "6281283626244",
      expertise: "Strategi Konten Video TikTok/Reels & Affiliate Co-Selling",
    },
    {
      id: "novita",
      name: "Novita Rani",
      role: "Chief Financial Officer (CFO)",
      unit: "Keuangan Syariah & Payment Gate",
      phone: "6281283626244",
      expertise: "Verifikasi Mutasi BSI, Akad Syariah DP 50%, & Faktur Resmi",
    },
  ],
};

export function buildWhatsAppUrl(unitName?: string, customGreeting?: string): string {
  const cleanNumber = (contacts.whatsappB2BNumber || "6281283626244").replace(/\D/g, "");
  if (customGreeting) {
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(customGreeting)}`;
  }
  const greeting = unitName
    ? `Halo tim KaryaKita, saya tertarik konsultasi layanan ${unitName}. Bisakah kita jadwalkan sesi diskusi?`
    : `Halo tim KaryaKita, saya ingin berkonsultasi mengenai kebutuhan digital dan pemesanan proyek bersama KaryaKita.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;
}

export function buildRepWhatsAppUrl(rep: TeamRepresentative): string {
  const cleanNumber = (rep.phone || contacts.whatsappB2BNumber || "6281283626244").replace(/\D/g, "");
  const greeting = `Halo Kak ${rep.name} (${rep.role} KaryaKita), saya ingin berkonsultasi mengenai ${rep.unit}.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;
}

export function getAcademyRegistrationUrl(): string {
  return contacts.academyRegistrationUrl || "https://karyakita-ai.vercel.app/daftar/ai-academy";
}
