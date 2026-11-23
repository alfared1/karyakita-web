export interface ContactConfig {
  whatsappB2BNumber: string;
  academyRegistrationUrl: string;
  officialEmail: string;
  socials: {
    instagram: string;
    tiktok: string;
    linkedin: string;
  };
}

// Konfigurasi terpusat jalur kontak & pendaftaran KaryaKita
// Status: Slot menyusul (Graceful Fallback aktif secara otomatis jika string kosong)
export const contacts: ContactConfig = {
  whatsappB2BNumber: "", // Slot menyusul
  academyRegistrationUrl: "", // Slot menyusul
  officialEmail: "", // Slot menyusul
  socials: {
    instagram: "",
    tiktok: "",
    linkedin: "",
  },
};

export function buildWhatsAppUrl(unitName?: string): string | null {
  if (!contacts.whatsappB2BNumber || contacts.whatsappB2BNumber.trim() === "") {
    return null;
  }
  const cleanNumber = contacts.whatsappB2BNumber.replace(/\D/g, "");
  const greeting = unitName
    ? `Halo tim KaryaKita, saya tertarik konsultasi layanan ${unitName}. Bisakah kita jadwalkan sesi diskusi?`
    : `Halo tim KaryaKita, saya ingin berkonsultasi mengenai kebutuhan digital dan transformasi bisnis saya bersama KaryaKita.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;
}

export function getAcademyRegistrationUrl(): string | null {
  if (!contacts.academyRegistrationUrl || contacts.academyRegistrationUrl.trim() === "") {
    return null;
  }
  return contacts.academyRegistrationUrl;
}
