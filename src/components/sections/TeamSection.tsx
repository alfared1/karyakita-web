"use client";

import React, { useState } from "react";
import Image from "next/image";
import { foundersData, FounderProfile } from "@/data/founders";
import { FounderModal } from "@/components/ui/FounderModal";
import { ArrowUpRight } from "lucide-react";

export function TeamSection() {
  const [selectedFounder, setSelectedFounder] = useState<FounderProfile | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="tim" className="py-20 bg-[#F8FAF9] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8]">
            TIM PENDIRI KARYAKITA
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Dibangun oleh 7 Talenta Muda Sistem Informasi yang Memadukan Teknologi, Kreativitas, dan Etika Bisnis Islam
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Berawal dari kolaborasi 7 mahasiswa Sistem Informasi STMIK Tazkia dalam wadah Syirkah &apos;Abdan, kami menghadirkan solusi digital end-to-end dengan integritas penuh.
          </p>
        </div>

        {/* Symmetrical Grid: 4 cards top row + 3 cards centered bottom row */}
        <div className="flex flex-wrap justify-center gap-6">
          {foundersData.map((f) => {
            const hasError = imgErrors[f.id];
            const initials = f.nickname
              ? f.nickname.slice(0, 2).toUpperCase()
              : f.name.slice(0, 2).toUpperCase();

            return (
              <div
                key={f.id}
                onClick={() => setSelectedFounder(f)}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] rounded-2xl bg-white border border-[#CFE0D8] p-5 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Photo Container 1:1 */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-[#CFE0D8] bg-[#EEF5F2]">
                    {!hasError ? (
                      <Image
                        src={f.avatarPath}
                        alt={f.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => handleImgError(f.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0F4C3A] text-white text-2xl font-bold">
                        {initials}
                      </div>
                    )}
                    <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-white/90 backdrop-blur-xs text-[#0F4C3A] opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Founder Info */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] block">
                      {f.unitFocus}
                    </span>
                    <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#0F4C3A] transition-colors leading-tight">
                      {f.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#0F4C3A] leading-snug">
                      {f.role}
                    </p>
                    <p className="text-xs text-[#4B5563] line-clamp-3 pt-1 leading-relaxed">
                      {f.shortBio}
                    </p>
                  </div>
                </div>

                {/* Skill Pills preview */}
                <div className="pt-4 mt-3 border-t border-[#CFE0D8] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F4C3A] group-hover:underline">
                    Lihat Bio Lengkap →
                  </span>
                  <span className="text-[10px] font-mono text-[#4B5563]">
                    {f.skills.length} Keahlian
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Founder Complete Bio Modal with key to reset state */}
      {selectedFounder && (
        <FounderModal
          key={selectedFounder.id}
          founder={selectedFounder}
          isOpen={true}
          onClose={() => setSelectedFounder(null)}
        />
      )}
    </section>
  );
}
