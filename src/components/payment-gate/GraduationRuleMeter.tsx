"use client";

import React from "react";
import { Award, CheckCircle2, TrendingUp } from "lucide-react";
import { formatRupiah } from "@/types/payment-gate";

interface GraduationRuleMeterProps {
  currentCashIdr: number;
  targetCashIdr?: number;
  className?: string;
  showSubtitle?: boolean;
}

export function GraduationRuleMeter({
  currentCashIdr,
  targetCashIdr = 3500000,
  className = "",
  showSubtitle = true,
}: GraduationRuleMeterProps) {
  const percentage = Math.min(
    100,
    Math.round((currentCashIdr / targetCashIdr) * 100 * 10) / 10
  );
  const isGraduated = currentCashIdr >= targetCashIdr;

  return (
    <div
      className={`rounded-2xl bg-white border border-[#CFE0D8] p-4 sm:p-5 shadow-xs ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isGraduated
                ? "bg-[#0F4C3A] text-white"
                : "bg-amber-100 text-[#B45309]"
            }`}
          >
            {isGraduated ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1F2937]">
              Target Kas Mandiri (Graduation Rule)
            </h4>
            {showSubtitle && (
              <p className="text-[11px] text-[#6B7280]">
                Syarat kelulusan bootstrapping operasional mandiri 7 Co-Founder
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs sm:text-sm font-bold tabular-nums text-[#1F2937]">
            {formatRupiah(currentCashIdr)} / {formatRupiah(targetCashIdr)}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold tabular-nums ${
              isGraduated
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isGraduated
              ? "bg-[#0F4C3A]"
              : "bg-gradient-to-r from-amber-500 to-[#B45309]"
          }`}
          style={{ width: `${Math.max(4, percentage)}%` }}
        />
      </div>

      {isGraduated && (
        <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#065F46] flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#0F4C3A] shrink-0" />
          <span>Alhamdulillah! Studio Lulus Target Kas Mandiri (Mode Normal Aktif).</span>
        </div>
      )}
    </div>
  );
}
