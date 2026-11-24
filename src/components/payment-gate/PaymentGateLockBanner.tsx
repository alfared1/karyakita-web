"use client";

import React from "react";
import { Lock, ArrowRight } from "lucide-react";
import { PaymentGateStatus, formatRupiah } from "@/types/payment-gate";

interface PaymentGateLockBannerProps {
  status: PaymentGateStatus;
  requiredAmountIdr: number;
  onActionClick?: () => void;
  actionLabel?: string;
  userRole?: "CFO" | "CEO" | "CLIENT" | "TEAM";
}

export function PaymentGateLockBanner({
  status,
  requiredAmountIdr,
  onActionClick,
  actionLabel,
  userRole = "CLIENT",
}: PaymentGateLockBannerProps) {
  // Hanya tampil untuk status yang mengunci eksekusi
  if (status !== "LOCKED_WAITING_DP" && status !== "WAITING_FINAL_50") {
    return null;
  }

  const isDpLock = status === "LOCKED_WAITING_DP";
  const title = isDpLock
    ? "Eksekusi Terkunci · Menunggu Verifikasi DP 50%"
    : "Penyerahan Master Terkunci · Menunggu Pelunasan 50%";

  const description = isDpLock
    ? `Sesuai tata kelola bootstrapping KaryaKita (Zero Gharar), tahap produksi baru akan dimulai setelah Novita (CFO) atau Alfatih (CEO) memverifikasi transfer DP 50% sebesar ${formatRupiah(
        requiredAmountIdr
      )}.`
    : `Tahap pengerjaan dan review selesai. Berkas master final serta hak cipta akan diserahkan penuh begitu pelunasan 50% sebesar ${formatRupiah(
        requiredAmountIdr
      )} disahkan.`;

  const isCfo = userRole === "CFO" || userRole === "CEO";

  return (
    <div className="rounded-xl border border-[#F59E0B] border-l-4 border-l-[#B45309] bg-[#FEF3C7] p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#FDE68A] text-[#92400E] shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-[#92400E] flex items-center gap-1.5">
              <span>{title}</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#78350F] max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {onActionClick && (
          <div className="shrink-0 self-end sm:self-center">
            <button
              onClick={onActionClick}
              className="min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0F4C3A] hover:bg-[#1A6B52] text-white shadow-xs hover:shadow transition-all flex items-center gap-1.5"
            >
              <span>{actionLabel || (isCfo ? "Verifikasi Sekarang" : "Unggah Bukti")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
