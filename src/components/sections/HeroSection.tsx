"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Layers, Globe, Database } from "lucide-react";

interface HeroSectionProps {
  onOpenContact?: (title?: string, actionType?: "b2b" | "academy") => void;
}

export function HeroSection({ onOpenContact }: HeroSectionProps = {}) {
  void onOpenContact;
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 bg-[#F8FAF9]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#CFE0D8_1px,transparent_1px),linear-gradient(to_bottom,#CFE0D8_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF5F2] border border-[#CFE0D8] text-xs font-bold tracking-wide text-[#0F4C3A]">
              <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
              <span>KARYAKITA AI &amp; VENTURE STUDIO · STMIK TAZKIA</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#1F2937] leading-[1.15]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Bangun Sistem Digital, Merek, dan Kapabilitas AI Bisnis Anda Bersama{" "}
              <span className="text-[#0F4C3A] underline decoration-[#B45309]/50 decoration-wavy decoration-2">
                Satu Studio yang Amanah.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              KaryaKita membantu UMKM, institusi pendidikan, dan organisasi bertransformasi secara digital—mulai dari identitas visual, aplikasi web kustom, analisis data, konten pertumbuhan, hingga pelatihan AI praktis dengan akad transparan.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/order"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-[#0F4C3A] hover:bg-[#1A6B52] text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Pesan Proyek B2B</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/daftar/ai-academy"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-[#EEF5F2] text-[#B45309] border-2 border-[#B45309] shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Daftar AI Academy Batch 1</span>
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-medium text-[#4B5563]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CFE0D8] shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#0F4C3A]" />
                <span>5 Unit Layanan Terintegrasi</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CFE0D8] shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#0F4C3A]" />
                <span>Akad Jelas &amp; Transparan (Zero Gharar)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CFE0D8] shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#0F4C3A]" />
                <span>100% Tech Stack Modern &amp; Legal</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols) Showcase Mockup */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#0F4C3A] p-5 md:p-6 shadow-2xl border border-emerald-800 text-white space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-[11px] font-mono text-emerald-200 bg-emerald-950/70 px-3 py-1 rounded-md border border-emerald-800 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>karyakita-ecosystem.app</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#FCD34D] tracking-wider">
                  LIVE
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/70 hover:border-emerald-600 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#FCD34D]" />
                      KaryaKita Hub
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-800/80 text-emerald-200 font-medium">
                      Operating System
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100/80 leading-relaxed">
                    Sistem komando 5 unit bisnis, Kanban terkoordinasi, &amp; Payment Gate syariah.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/70 hover:border-emerald-600 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-[#38BDF8]" />
                      SI.26 Class Hub
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-900/80 text-sky-200 font-medium">
                      Portal Kampus
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100/80 leading-relaxed">
                    Matriks kas 41 mahasiswa, presensi resmi Kemahasiswaan, &amp; tugas kuliah.
                  </p>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-emerald-900/50 border border-emerald-800">
                  <div className="text-base font-extrabold text-[#FCD34D] tabular-nums">5 Unit</div>
                  <div className="text-[10px] text-emerald-200">Aktif Terhubung</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-900/50 border border-emerald-800">
                  <div className="text-base font-extrabold text-[#A7F3D0] tabular-nums">DP 50%</div>
                  <div className="text-[10px] text-emerald-200">Akad Syariah</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-900/50 border border-emerald-800">
                  <div className="text-base font-extrabold text-white tabular-nums">41 Mhs</div>
                  <div className="text-[10px] text-emerald-200">Pengguna SI.26</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
