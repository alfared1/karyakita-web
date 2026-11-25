"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MessageCircle } from "lucide-react";

interface FinalCtaProps {
  onOpenContact?: (title?: string, actionType?: "b2b" | "academy") => void;
}

export function FinalCta({ onOpenContact }: FinalCtaProps = {}) {
  void onOpenContact;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#0F4C3A] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-emerald-800 overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B45309]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-700 text-xs font-bold text-[#FCD34D]">
              <Sparkles className="w-3.5 h-3.5 text-[#FCD34D]" />
              <span>MULAI TRANSFORMASI DIGITAL HARI INI</span>
            </div>

            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Siap Mengubah Ide dan Operasional Bisnis Anda Menjadi Karya Digital Nyata?
            </h2>

            <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Pesan layanan bisnis Anda secara terstruktur dengan akad syariah transparan, atau amankan kursi Anda di Batch 1 KaryaKita AI Academy (diskon khusus Rp25.000).
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/order"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-emerald-50 text-[#0F4C3A] shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-4 h-4 text-[#0F4C3A]" />
                <span>Pesan Proyek B2B →</span>
              </Link>

              <Link
                href="/daftar/ai-academy"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-transparent hover:bg-white/10 text-white border-2 border-white shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Daftar AI Academy (Rp25.000)</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
