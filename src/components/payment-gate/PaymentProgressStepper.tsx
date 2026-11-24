"use client";

import React from "react";
import { Check, Download, Sparkles } from "lucide-react";
import { PaymentGateStatus, PaymentScheme, formatRupiah } from "@/types/payment-gate";

interface PaymentProgressStepperProps {
  scheme: PaymentScheme;
  status: PaymentGateStatus;
  contractValueIdr?: number;
  requiredAmountIdr?: number;
  className?: string;
}

export function PaymentProgressStepper({
  scheme,
  status,
  contractValueIdr = 75000,
  requiredAmountIdr = 75000,
  className = "",
}: PaymentProgressStepperProps) {
  if (scheme === "PUBLIC_FULL_100") {
    // Mode Publik 2 Langkah (AI Academy)
    const isStep1Done =
      status === "VERIFYING_PROOF" ||
      status === "PAID_100_VERIFIED" ||
      status === "DP_50_VERIFIED";
    const isStep2Done = status === "PAID_100_VERIFIED";

    return (
      <div className={`w-full rounded-2xl bg-white border border-[#CFE0D8] p-5 sm:p-6 shadow-xs ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-[#0F4C3A] uppercase tracking-wider">
            Alur Pendaftaran &amp; Pembayaran
          </span>
          <span className="text-xs font-medium text-[#6B7280]">
            Skema Lunas 100% di Muka
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Langkah 1 */}
          <div
            className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
              isStep1Done
                ? "bg-[#ECFDF5] border-[#10B981]/50 text-[#065F46]"
                : "bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                isStep1Done ? "bg-[#10B981] text-white" : "bg-[#F59E0B] text-white"
              }`}
            >
              {isStep1Done ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold">Transfer &amp; Unggah Bukti</p>
              <p className="text-xs tabular-nums font-semibold">
                {formatRupiah(requiredAmountIdr)}
              </p>
              <p className="text-[11px] opacity-80">
                {isStep1Done ? "Bukti transfer telah dikirim" : "Menunggu transfer peserta"}
              </p>
            </div>
          </div>

          {/* Langkah 2 */}
          <div
            className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
              isStep2Done
                ? "bg-[#0F4C3A] border-[#0F4C3A] text-white"
                : "bg-[#F8FAF9] border-[#CFE0D8] text-[#4B5563]"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                isStep2Done ? "bg-white text-[#0F4C3A]" : "bg-gray-200 text-gray-600"
              }`}
            >
              {isStep2Done ? <Sparkles className="w-4 h-4" /> : "2"}
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold">Verifikasi &amp; Akses Kelas</p>
              <p className="text-[11px] opacity-80">
                {isStep2Done
                  ? "Akses Grup WA & Zoom Terbuka"
                  : "Verifikasi cepat CFO < 30 detik"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mode B2B 3 Langkah (Termin 50/50)
  const isStep1Done =
    status === "DP_50_VERIFIED" ||
    status === "WAITING_FINAL_50" ||
    status === "PAID_100_VERIFIED";
  const isStep2Active = status === "DP_50_VERIFIED" || status === "WAITING_FINAL_50";
  const isStep3Done = status === "PAID_100_VERIFIED";

  const halfValue = Math.round(contractValueIdr / 2);

  return (
    <div className={`w-full rounded-2xl bg-white border border-[#CFE0D8] p-5 sm:p-6 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-[#0F4C3A] uppercase tracking-wider">
          Alur Termin Kontrak Syariah (B2B)
        </span>
        <span className="text-xs font-medium text-[#6B7280]">
          Total Kontrak: <b className="tabular-nums text-[#1F2937]">{formatRupiah(contractValueIdr)}</b>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Step 1: DP 50% */}
        <div
          className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
            isStep1Done
              ? "bg-[#ECFDF5] border-[#10B981]/60 text-[#065F46]"
              : "bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
              isStep1Done ? "bg-[#10B981] text-white" : "bg-[#F59E0B] text-white"
            }`}
          >
            {isStep1Done ? <Check className="w-4 h-4" /> : "1"}
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold">DP 50% Akad Ijarah</p>
            <p className="text-xs tabular-nums font-semibold">{formatRupiah(halfValue)}</p>
            <p className="text-[11px] opacity-80">
              {isStep1Done ? "DP 50% Sah Terverifikasi" : "Wajib sebelum produksi dimulai"}
            </p>
          </div>
        </div>

        {/* Step 2: Eksekusi & Review */}
        <div
          className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
            isStep2Active || isStep3Done
              ? "bg-[#EEF5F2] border-[#0F4C3A]/40 text-[#0F4C3A]"
              : "bg-gray-50 border-gray-200 text-gray-400"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
              isStep3Done
                ? "bg-[#10B981] text-white"
                : isStep2Active
                ? "bg-[#0F4C3A] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {isStep3Done ? <Check className="w-4 h-4" /> : "2"}
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold">Eksekusi &amp; Review</p>
            <p className="text-[11px] opacity-80">
              {isStep3Done
                ? "Produksi & Review Selesai"
                : isStep2Active
                ? "Tahap Produksi Berlangsung"
                : "Terkunci hingga DP Sah"}
            </p>
          </div>
        </div>

        {/* Step 3: Pelunasan 50% & Serah Terima */}
        <div
          className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
            isStep3Done
              ? "bg-[#0F4C3A] border-[#0F4C3A] text-white"
              : status === "WAITING_FINAL_50"
              ? "bg-[#FFF7ED] border-[#FB923C] text-[#9A3412]"
              : "bg-gray-50 border-gray-200 text-gray-400"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
              isStep3Done
                ? "bg-white text-[#0F4C3A]"
                : status === "WAITING_FINAL_50"
                ? "bg-[#FB923C] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {isStep3Done ? <Download className="w-4 h-4" /> : "3"}
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold">Pelunasan 50% &amp; Serah Terima</p>
            <p className="text-xs tabular-nums font-semibold">{formatRupiah(halfValue)}</p>
            <p className="text-[11px] opacity-80">
              {isStep3Done
                ? "Aset Master Final Terbuka"
                : "Buka kunci file master"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
