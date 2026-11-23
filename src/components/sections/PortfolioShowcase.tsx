"use client";

import React, { useState } from "react";
import Image from "next/image";
import { portfolioData } from "@/data/portfolio";
import { ExternalLink, CheckCircle, Layers } from "lucide-react";

export function PortfolioShowcase() {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="portofolio" className="py-20 bg-[#F8FAF9] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8]">
            PORTOFOLIO &amp; KARYA NYATA
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Bukan Sekadar Konsep—Lihat Sistem Digital yang Sudah Kami Bangun dan Jalankan
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Setiap sistem dirancang dengan arsitektur modern, berorientasi mobile-first, dan memecahkan permasalahan nyata organisasi secara akuntabel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {portfolioData.map((item) => {
            const hasError = imgErrors[item.id];

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-white border border-[#CFE0D8] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative aspect-[16/10] bg-[#EEF5F2] border-b border-[#CFE0D8] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-white/90 backdrop-blur-xs border-b border-[#CFE0D8] px-3 flex items-center justify-between z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[10px] font-mono text-[#4B5563] truncate max-w-[200px]">
                      {item.liveUrl.replace("https://", "")}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      LIVE
                    </span>
                  </div>

                  {!hasError ? (
                    <div className="relative w-full h-full pt-8">
                      <Image
                        src={item.imagePath}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                        onError={() => handleImgError(item.id)}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full pt-8 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-[#0F4C3A] to-[#1A6B52] text-white">
                      <Layers className="w-12 h-12 text-[#FCD34D] mb-3" />
                      <h4 className="text-lg font-bold text-center">{item.title}</h4>
                      <p className="text-xs text-emerald-100 text-center max-w-sm mt-1">
                        {item.tagline}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8]">
                        {item.categoryBadge}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#1F2937]">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-medium text-[#0F4C3A]">
                      {item.tagline}
                    </p>

                    <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1F2937] block">
                        Solusi &amp; Fitur Unggulan:
                      </span>
                      <ul className="space-y-1.5">
                        {item.highlights.map((h, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-[#4B5563]"
                          >
                            <CheckCircle className="w-4 h-4 text-[#0F4C3A] flex-shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#4B5563] block mb-2">
                        Teknologi Utama:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#F8FAF9] text-[#1F2937] border border-[#CFE0D8]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#CFE0D8]">
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-5 rounded-xl font-bold text-sm bg-[#0F4C3A] hover:bg-[#1A6B52] text-white transition-all flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow"
                    >
                      <span>Kunjungi Aplikasi Live</span>
                      <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
