/**
 * KaryaKita Payment Provider Abstraction (Hybrid Ready Architecture)
 * Mendukung MANUAL_BANK_SYARIAH (Zero-Cost Legal) dan AUTO_GATEWAY (QRIS/VA)
 */

import { DEFAULT_BANK_SYARIAH, BankConfig } from "@/types/payment-gate";

export type PaymentMode = "MANUAL_BANK_SYARIAH" | "AUTO_GATEWAY";

export interface CreatePaymentParams {
  orderCode: string;
  amountIdr: number;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  description: string;
}

export interface PaymentInstructions {
  mode: PaymentMode;
  bank?: BankConfig;
  qrisUrl?: string;
  vaNumber?: string;
  expiryMinutes: number;
  message: string;
}

export interface PaymentProvider {
  getMode(): PaymentMode;
  getInstructions(params: CreatePaymentParams): Promise<PaymentInstructions>;
  verifyPayment(orderCode: string): Promise<boolean>;
}

/**
 * Provider Mode 1: Transfer Manual Bank Syariah (Aktif Hari Pertama)
 */
export class ManualBankSyariahProvider implements PaymentProvider {
  private bankConfig: BankConfig;

  constructor(bankConfig: BankConfig = DEFAULT_BANK_SYARIAH) {
    this.bankConfig = bankConfig;
  }

  getMode(): PaymentMode {
    return "MANUAL_BANK_SYARIAH";
  }

  async getInstructions(params: CreatePaymentParams): Promise<PaymentInstructions> {
    return {
      mode: "MANUAL_BANK_SYARIAH",
      bank: this.bankConfig,
      expiryMinutes: 1440, // 24 jam
      message: `Silakan transfer ke ${this.bankConfig.bankName} No. Rekening ${this.bankConfig.accountNo} a.n. ${this.bankConfig.accountHolder} sejumlah Rp${params.amountIdr.toLocaleString("id-ID")}. Sertakan kode order ${params.orderCode} pada berita transfer.`,
    };
  }

  async verifyPayment(): Promise<boolean> {
    // Verifikasi manual dikelola melalui CFO Admin Verification Queue
    return false;
  }
}

/**
 * Provider Mode 2: Payment Gateway Otomatis (Stub Adapter untuk Midtrans / Xendit / Mayar)
 */
export class AutoGatewayProvider implements PaymentProvider {
  getMode(): PaymentMode {
    return "AUTO_GATEWAY";
  }

  async getInstructions(params: CreatePaymentParams): Promise<PaymentInstructions> {
    return {
      mode: "AUTO_GATEWAY",
      qrisUrl: `https://api.karyakita.id/mock-qris/${params.orderCode}`,
      vaNumber: `88001${params.customerWhatsapp.slice(-7)}`,
      expiryMinutes: 60,
      message: "Silakan pindai kode QRIS atau bayar via Virtual Account yang tertera.",
    };
  }

  async verifyPayment(): Promise<boolean> {
    // Akan diintegrasikan dengan webhook handler resmi saat lisensi gateway aktif
    return false;
  }
}

/**
 * Factory untuk mengambil provider aktif berdasarkan Environment Variables
 */
export function getPaymentProvider(): PaymentProvider {
  const mode = (process.env.PAYMENT_MODE || "MANUAL_BANK_SYARIAH") as PaymentMode;

  if (mode === "AUTO_GATEWAY") {
    return new AutoGatewayProvider();
  }

  return new ManualBankSyariahProvider({
    bankName: process.env.BANK_SYARIAH_NAME || DEFAULT_BANK_SYARIAH.bankName,
    accountNo: process.env.BANK_SYARIAH_ACCOUNT_NO || DEFAULT_BANK_SYARIAH.accountNo,
    accountHolder: process.env.BANK_SYARIAH_ACCOUNT_HOLDER || DEFAULT_BANK_SYARIAH.accountHolder,
  });
}
