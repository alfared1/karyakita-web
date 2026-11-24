"use client";

import React from "react";
import { Sparkles, Check, ArrowRight, Building2 } from "lucide-react";
import { getAcademyRegistrationUrl, buildWhatsAppUrl } from "@/config/contacts";

interface AcademySpotlightProps {
  onOpenContact: (title?: string, actionType?: "b2b" | "academy") => void;
}

export function AcademySpotlight({ onOpenContact }: AcademySpotlightProps) {
  const handlePublicClick = (e: React.MouseEvent) => {
    const regUrl = getAcademyRegistrationUrl();
    if (!regUrl) {
      e.preventDefault();
      onOpenContact("Pendaftaran Workshop AI One-to-Many Batch 1", "academy");
    }
  };

  const handleCorporateClick = (e: React.MouseEvent) => {
    const waUrl = buildWhatsAppUrl("Corporate AI Training");
    if (!waUrl) {
      e.preventDefault();
      onOpenContact("Corporate AI Training & In-House Workshop", "b2b");
    }
  };

  return (
    <section id="academy" className="py-20 bg-white border-b border-[#CFE0D8] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8]">
            PROGRAM UNGGULAN · KARYAKITA AI ACADEMY (LINI 5)
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Kuasai AI untuk Produktivitas Kerja, Bisnis, dan Studi dalam Satu Sesi Praktis
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Kurikulum berbasis studi kasus nyata yang dipandu langsung oleh praktisi AI KaryaKita. Tanpa hafalan rumus, langsung berdampak pada efisiensi kerja Anda.
          </p>
        </div>

        {/* 2 Contrasting Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Card: Workshop Publik (Emerald #0F4C3A) */}
          <div className="rounded-3xl bg-[#0F4C3A] text-white p-7 sm:p-9 shadow-xl border border-emerald-800 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/30 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#B45309] text-white tracking-wide shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FCD34D]" />
                  PENDAFTARAN BATCH 1 DIBUKA
                </span>
                <span className="text-xs text-emerald-200 font-medium">
                  30 Kursi Terbatas
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Workshop Publik AI One-to-Many
                </h3>
                <div className="mt-3 flex flex-wrap items-baseline gap-2.5">
                  <span className="text-4xl font-extrabold text-[#FCD34D] tabular-nums">
                    Rp25.000
                  </span>
                  <span className="line-through text-lg sm:text-xl text-emerald-300/75 font-semibold tabular-nums">
                    Rp75.000
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FCD34D]/20 text-[#FCD34D] border border-[#FCD34D]/40">
                    Diskon Batch 1
                  </span>
                  <span className="text-xs text-emerald-200">
                    / peserta (Pembayaran lunas 100% di muka)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-3 leading-relaxed">
                  Sesi interaktif langsung bersama praktisi R&amp;D AI KaryaKita untuk menguasai teknik prompting, riset cepat, dan pembuatan konten/dokumen profesional dengan AI.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-emerald-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Fasilitas Peserta:
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-emerald-50">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#FCD34D] flex-shrink-0 mt-0.5" />
                    <span>Sesi praktik langsung (live hands-on) &amp; tanya jawab studi kasus nyata</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#FCD34D] flex-shrink-0 mt-0.5" />
                    <span>Akses rekaman ulang kelas &amp; Template Prompt Pack siap pakai</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#FCD34D] flex-shrink-0 mt-0.5" />
                    <span>E-Sertifikat resmi terverifikasi KaryaKita AI Academy</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 relative z-10">
              <a
                href={getAcademyRegistrationUrl() || "#"}
                onClick={handlePublicClick}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-[#B45309] hover:bg-[#92400E] text-white shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <span>Daftar Batch 1 Sekarang (Rp25.000)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Card: Corporate AI Training (White) */}
          <div className="rounded-3xl bg-white border border-[#CFE0D8] p-7 sm:p-9 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0F4C3A]" />
                  UNTUK PERUSAHAAN, UMKM &amp; INSTITUSI
                </span>
                <span className="text-xs text-[#4B5563] font-medium">B2B Custom</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold tracking-tight text-[#1F2937]">
                  Corporate AI Training &amp; In-House Workshop
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0F4C3A]">
                    Penawaran Kustom
                  </span>
                  <span className="text-xs text-[#4B5563]">
                    (Sesuai jumlah peserta &amp; silabus khusus)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#4B5563] mt-3 leading-relaxed">
                  Kurikulum pelatihan AI yang disesuaikan dengan alur kerja divisi pemasaran, operasional, administrasi, maupun tenaga pengajar di instansi Anda.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-[#CFE0D8]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1F2937]">
                  Cakupan Program Corporate:
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-[#4B5563]">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#0F4C3A] flex-shrink-0 mt-0.5" />
                    <span>Audit kebutuhan alur kerja tim sebelum materi pelatihan disusun</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#0F4C3A] flex-shrink-0 mt-0.5" />
                    <span>Modul studi kasus khusus industri, operasional, atau instansi Anda</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#0F4C3A] flex-shrink-0 mt-0.5" />
                    <span>Pendampingan pasca-sesi &amp; dokumentasi SOP AI internal tim</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <a
                href={buildWhatsAppUrl("Corporate AI Training") || "#"}
                onClick={handleCorporateClick}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm border-2 border-[#0F4C3A] text-[#0F4C3A] hover:bg-[#EEF5F2] transition-colors flex items-center justify-center gap-2 group"
              >
                <span>Ajukan Penawaran Corporate →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
