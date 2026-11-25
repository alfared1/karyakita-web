/**
 * KaryaKita Payment Gate Design System (PGDS v1.0)
 * Core Type Definitions & Status Configurations
 */

export type PaymentGateStatus =
  | "LOCKED_WAITING_DP"
  | "WAITING_FULL_100"
  | "VERIFYING_PROOF"
  | "DP_50_VERIFIED"
  | "WAITING_FINAL_50"
  | "PAID_100_VERIFIED"
  | "REJECTED_PROOF";

export type PaymentScheme = "B2B_SPLIT_50_50" | "PUBLIC_FULL_100";

export interface StatusMeta {
  code: PaymentGateStatus;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  hexBg: string;
  hexText: string;
  hexBorder: string;
  iconName: "Lock" | "Clock" | "FileSearch" | "ShieldCheck" | "Hourglass" | "CheckCircle2" | "AlertTriangle";
  description: string;
}

export const STATUS_CONFIG: Record<PaymentGateStatus, StatusMeta> = {
  LOCKED_WAITING_DP: {
    code: "LOCKED_WAITING_DP",
    label: "Terkunci · Menunggu DP 50%",
    bgClass: "bg-[#FEF3C7]",
    textClass: "text-[#92400E]",
    borderClass: "border-[#F59E0B]",
    hexBg: "#FEF3C7",
    hexText: "#92400E",
    hexBorder: "#F59E0B",
    iconName: "Lock",
    description: "Proyek B2B baru. Tugas produksi terkunci hingga verifikasi DP 50% oleh CFO.",
  },
  WAITING_FULL_100: {
    code: "WAITING_FULL_100",
    label: "Menunggu Lunas 100%",
    bgClass: "bg-[#FEF3C7]",
    textClass: "text-[#92400E]",
    borderClass: "border-[#F59E0B]",
    hexBg: "#FEF3C7",
    hexText: "#92400E",
    hexBorder: "#F59E0B",
    iconName: "Clock",
    description: "Tiket publik AI Academy Rp75.000 (atau promo Batch 1) menunggu pembayaran.",
  },
  VERIFYING_PROOF: {
    code: "VERIFYING_PROOF",
    label: "Menunggu Verifikasi CFO",
    bgClass: "bg-[#E0F2FE]",
    textClass: "text-[#075985]",
    borderClass: "border-[#38BDF8]",
    hexBg: "#E0F2FE",
    hexText: "#075985",
    hexBorder: "#38BDF8",
    iconName: "FileSearch",
    description: "Bukti transfer telah diterima; sedang divalidasi oleh Novita (CFO) / Alfatih (CEO).",
  },
  DP_50_VERIFIED: {
    code: "DP_50_VERIFIED",
    label: "DP 50% Sah · Siap Eksekusi",
    bgClass: "bg-[#ECFDF5]",
    textClass: "text-[#065F46]",
    borderClass: "border-[#10B981]",
    hexBg: "#ECFDF5",
    hexText: "#065F46",
    hexBorder: "#10B981",
    iconName: "ShieldCheck",
    description: "Gerbang produksi terbuka. Tim resmi memulai proses eksekusi proyek.",
  },
  WAITING_FINAL_50: {
    code: "WAITING_FINAL_50",
    label: "Menunggu Pelunasan 50%",
    bgClass: "bg-[#FFF7ED]",
    textClass: "text-[#9A3412]",
    borderClass: "border-[#FB923C]",
    hexBg: "#FFF7ED",
    hexText: "#9A3412",
    hexBorder: "#FB923C",
    iconName: "Hourglass",
    description: "Review selesai. File master final terkunci hingga pelunasan 50% diverifikasi.",
  },
  PAID_100_VERIFIED: {
    code: "PAID_100_VERIFIED",
    label: "Lunas 100% · Terverifikasi",
    bgClass: "bg-[#0F4C3A]",
    textClass: "text-[#FFFFFF]",
    borderClass: "border-[#0F4C3A]",
    hexBg: "#0F4C3A",
    hexText: "#FFFFFF",
    hexBorder: "#0F4C3A",
    iconName: "CheckCircle2",
    description: "Seluruh kewajiban lunas. Akses link materi, zoom, atau serah terima master terbuka penuh.",
  },
  REJECTED_PROOF: {
    code: "REJECTED_PROOF",
    label: "Bukti Ditolak · Unggah Ulang",
    bgClass: "bg-[#FEF2F2]",
    textClass: "text-[#991B1B]",
    borderClass: "border-[#F87171]",
    hexBg: "#FEF2F2",
    hexText: "#991B1B",
    hexBorder: "#F87171",
    iconName: "AlertTriangle",
    description: "Bukti transfer tidak cocok atau buram. Silakan unggah bukti yang benar.",
  },
};

export interface BankConfig {
  bankName: string;
  accountNo: string;
  accountHolder: string;
}

export const DEFAULT_BANK_SYARIAH: BankConfig = {
  bankName:
    process.env.NEXT_PUBLIC_BANK_SYARIAH_NAME ||
    process.env.BANK_SYARIAH_NAME ||
    "Bank Syariah Indonesia (BSI)",
  accountNo:
    process.env.NEXT_PUBLIC_BANK_SYARIAH_ACCOUNT_NO ||
    process.env.BANK_SYARIAH_ACCOUNT_NO ||
    "7234891023",
  accountHolder:
    process.env.NEXT_PUBLIC_BANK_SYARIAH_ACCOUNT_HOLDER ||
    process.env.BANK_SYARIAH_ACCOUNT_HOLDER ||
    "KaryaKita Studio / Novita Rani (CFO)",
};

export interface BusinessUnitInfo {
  code: string;
  name: string;
  lineNum: string;
  badgeColor: string;
  description: string;
}

export const BUSINESS_UNITS: Record<string, BusinessUnitInfo> = {
  design: {
    code: "design",
    name: "KaryaKita Design",
    lineNum: "LINI 1",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    description: "Brand Identity, Logo & UI/UX Design Studio",
  },
  webtech: {
    code: "webtech",
    name: "KaryaKita WebTech",
    lineNum: "LINI 2",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    description: "Custom Landing Page, Web App & Internal Dashboard",
  },
  assist: {
    code: "assist",
    name: "KaryaKita Assist & Data",
    lineNum: "LINI 3",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    description: "Business Intelligence, Pitch Deck & Studi Kelayakan",
  },
  media: {
    code: "media",
    name: "KaryaKita Media & Affiliate",
    lineNum: "LINI 4",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    description: "Performance Video Production & Growth Network",
  },
  academy: {
    code: "academy",
    name: "KaryaKita AI Academy",
    lineNum: "LINI 5",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Corporate AI Academy & Executive Enablement",
  },
  bundle: {
    code: "bundle",
    name: "KaryaKita Ecosystem Bundling",
    lineNum: "PAKET KHUSUS",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    description: "Paket Transformasi Terpadu Lintas Unit (Hemat hingga Rp1.250.000)",
  },
};

export interface PublicOrderDTO {
  id: string;
  orderCode: string;
  portalToken: string;
  scheme: PaymentScheme;
  unitCode: string;
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string;
  organization?: string | null;
  notes?: string | null;
  contractValueIdr: number;
  requiredAmountIdr: number;
  paymentGateStatus: PaymentGateStatus;
  proofUrl?: string | null;
  proofAmountIdr?: number | null;
  proofSubmittedAt?: string | null;
  rejectionReason?: string | null;
  verifiedById?: string | null;
  verifiedAt?: string | null;
  fulfillmentJson?: {
    zoomLink?: string;
    waGroupLink?: string;
    promptPackUrl?: string;
    recordingUrl?: string;
    projectFilesUrl?: string;
    message?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export function formatRupiah(amount: number | bigint): string {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  return `Rp${num.toLocaleString("id-ID")}`;
}
