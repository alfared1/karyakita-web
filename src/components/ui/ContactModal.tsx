"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
  actionType?: "b2b" | "academy" | "general";
}

export function ContactModal({
  isOpen,
  onClose,
  serviceTitle = "Konsultasi Layanan KaryaKita",
  actionType = "b2b",
}: ContactModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAcademy = actionType === "academy";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#CFE0D8] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#0F4C3A] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FCD34D] text-[#0F4C3A]">
              {isAcademy ? "KARYAKITA AI ACADEMY" : "PRA-RILIS RESMI"}
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white pr-8">
            {serviceTitle}
          </h3>
          <p className="text-xs text-white/80 mt-1">
            {isAcademy
              ? "Pendaftaran Workshop Publik AI One-to-Many Batch 1 (Rp75.000)"
              : "Konsultasi Proyek & Transformasi Digital B2B"}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-[#1F2937]">
          {/* Status Alert Box */}
          <div className="p-4 rounded-2xl bg-[#EEF5F2] border border-[#CFE0D8] flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#0F4C3A] mt-0.5 flex-shrink-0" />
            <div className="text-xs leading-relaxed text-[#1F2937]">
              <strong className="block font-semibold text-[#0F4C3A] mb-0.5">
                Kanal WhatsApp Bisnis &amp; Formulir Resmi Segera Aktif
              </strong>
              Saat ini kami sedang menuntaskan integrasi Payment Gate dan verifikasi akun WhatsApp Bisnis resmi studio untuk persiapan peluncuran kuartal pertama 2026.
            </div>
          </div>

          {/* Steps Preview */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">
              Langkah Penjajakan Bersama Tim:
            </h4>
            <div className="space-y-2 text-xs text-[#4B5563]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F4C3A]" />
                <span>
                  {isAcademy
                    ? "Alokasi kursi Batch 1 diprioritaskan bagi 30 pendaftar pertama."
                    : "Diskusi kebutuhan ruang lingkup (scope) & estimasi biaya transparan."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F4C3A]" />
                <span>
                  {isAcademy
                    ? "Pembayaran lunas 100% di muka via rekening resmi Syirkah."
                    : "Skema akad syariah DP 50% di awal dan pelunasan 50% saat serah terima."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0F4C3A]" />
                <span>Seluruh pengerjaan dilindungi NDA &amp; 100% tech stack legal.</span>
              </div>
            </div>
          </div>

          {/* Contact Representative Message */}
          <div className="pt-2 border-t border-[#CFE0D8] text-xs text-[#4B5563] leading-relaxed">
            Untuk keperluan demo presentasi hari ini atau konsultasi langsung, silakan hubungi perwakilan tim pendiri KaryaKita di ruang sidang / temu.
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2.5">
            <Link
              href={isAcademy ? "/daftar/ai-academy" : "/order"}
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm bg-[#0F4C3A] hover:bg-[#1A6B52] text-white transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span>{isAcademy ? "Daftar Batch 1 Online" : "Buka Form Order Proyek"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm border border-[#CFE0D8] text-[#4B5563] hover:bg-gray-50 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
