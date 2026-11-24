"use client";

import React, { useState } from "react";
import { Copy, Check, Building2, ShieldCheck, QrCode } from "lucide-react";
import { DEFAULT_BANK_SYARIAH, BankConfig, formatRupiah } from "@/types/payment-gate";

interface BankTransferCardProps {
  requiredAmountIdr: number;
  orderCode: string;
  bankConfig?: BankConfig;
  title?: string;
  allowGatewayTab?: boolean;
}

export function BankTransferCard({
  requiredAmountIdr,
  orderCode,
  bankConfig = DEFAULT_BANK_SYARIAH,
  title = "Instruksi Pembayaran Transfer Syariah",
  allowGatewayTab = false,
}: BankTransferCardProps) {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "gateway">("manual");

  const formattedAccountNo = bankConfig.accountNo.replace(/(\d{4})(?=\d)/g, "$1 ");

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(bankConfig.accountNo.replace(/\s+/g, ""));
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } catch {}
  };

  const handleCopyAmount = async () => {
    try {
      await navigator.clipboard.writeText(requiredAmountIdr.toString());
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } catch {}
  };

  return (
    <div className="w-full rounded-2xl bg-white border border-[#CFE0D8] shadow-xs overflow-hidden">
      {/* Header Card */}
      <div className="bg-[#EEF5F2] px-5 py-4 border-b border-[#CFE0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0F4C3A] text-white flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F4C3A]">{title}</h3>
            <p className="text-[11px] text-[#4B5563]">
              Bebas biaya admin antar bank syariah / BI-FAST
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-[#065F46] border border-emerald-200 inline-flex items-center gap-1 self-start sm:self-auto">
          <ShieldCheck className="w-3 h-3 text-[#10B981]" />
          Akad Amanah &amp; Zero Gharar
        </span>
      </div>

      {/* Mode Switch (Jika allowGatewayTab aktif untuk ekspansi masa depan) */}
      {allowGatewayTab && (
        <div className="flex border-b border-[#CFE0D8] bg-[#F8FAF9] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-2.5 text-center transition-colors ${
              activeTab === "manual"
                ? "bg-white text-[#0F4C3A] border-b-2 border-[#0F4C3A]"
                : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            Transfer Manual Bank Syariah
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gateway")}
            className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1 ${
              activeTab === "gateway"
                ? "bg-white text-[#0F4C3A] border-b-2 border-[#0F4C3A]"
                : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QRIS / Virtual Account (Segera)</span>
          </button>
        </div>
      )}

      {/* Body Card */}
      <div className="p-5 sm:p-6 space-y-5">
        {activeTab === "manual" ? (
          <>
            {/* Box Nominal Wajib Transfer */}
            <div className="rounded-xl bg-[#F8FAF9] border border-[#CFE0D8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#6B7280]">
                  Nominal Tepat yang Wajib Ditransfer:
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#0F4C3A] tabular-nums tracking-tight">
                  {formatRupiah(requiredAmountIdr)}
                </p>
                <p className="text-[11px] text-[#9A3412] mt-0.5">
                  Mohon transfer sesuai nominal di atas tanpa pembulatan.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyAmount}
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border border-[#CFE0D8] bg-white hover:bg-[#EEF5F2] text-[#0F4C3A] transition-all flex items-center justify-center gap-1.5 self-start sm:self-center"
              >
                {copiedAmount ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">✓ Nominal Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#0F4C3A]" />
                    <span>Salin Nominal</span>
                  </>
                )}
              </button>
            </div>

            {/* Rincian Rekening Bank */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E5E7EB] gap-1">
                <span className="text-xs text-[#6B7280]">Bank Tujuan:</span>
                <span className="text-sm font-bold text-[#1F2937]">
                  {bankConfig.bankName}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E5E7EB] gap-2">
                <div>
                  <span className="text-xs text-[#6B7280]">Nomor Rekening:</span>
                  <p className="font-mono text-lg font-bold text-[#1F2937] tracking-wider">
                    {formattedAccountNo}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold bg-[#0F4C3A] hover:bg-[#1A6B52] text-white shadow-2xs transition-all flex items-center justify-center gap-1.5 self-start sm:self-center"
                >
                  {copiedAccount ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>✓ Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Rekening</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs text-[#6B7280]">Atas Nama Rekening:</span>
                <span className="text-sm font-semibold text-[#1F2937]">
                  {bankConfig.accountHolder}
                </span>
              </div>
            </div>

            {/* Berita Transfer Catatan */}
            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 flex items-center justify-between">
              <span>
                Sertakan berita transfer: <b className="font-mono">{orderCode}</b>
              </span>
            </div>
          </>
        ) : (
          <div className="py-8 text-center space-y-2">
            <QrCode className="w-12 h-12 text-[#9CA3AF] mx-auto" />
            <p className="text-sm font-bold text-[#374151]">
              Gateway Otomatis (QRIS / VA) Segera Hadir
            </p>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              Saat ini KaryaKita mengoperasikan transfer langsung ke Bank Syariah Indonesia (BSI) bebas biaya perantara.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
