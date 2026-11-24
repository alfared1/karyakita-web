"use client";

import React from "react";
import Link from "next/link";
import { servicesData } from "@/data/services";
import { Check } from "lucide-react";

interface ServicesBentoProps {
  onOpenContact?: (title?: string, actionType?: "b2b" | "academy") => void;
}

export function ServicesBento({ onOpenContact }: ServicesBentoProps = {}) {
  void onOpenContact;
  return (
    <section id="layanan" className="py-20 bg-[#F8FAF9] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8]">
            EKOSISTEM LAYANAN KAMI
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Lima Unit Bisnis Spesialis untuk Menjawab Kebutuhan Digital dari Hulu ke Hilir
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Pilih satu layanan spesifik atau kolaborasikan beberapa unit sekaligus sesuai target akselerasi bisnis Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {servicesData.map((unit, idx) => {
            const isTopRow = idx < 3;
            const colSpanClass = isTopRow ? "md:col-span-2" : "md:col-span-3";

            return (
              <div
                key={unit.id}
                className={`${colSpanClass} rounded-2xl bg-white border ${
                  unit.isSpecial
                    ? "bg-[#EEF5F2] border-[#0F4C3A] shadow-md ring-1 ring-[#0F4C3A]/20"
                    : "border-[#CFE0D8] shadow-sm hover:shadow-md"
                } p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 relative overflow-hidden`}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: unit.accentColor }}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{
                        backgroundColor: `${unit.accentColor}15`,
                        color: unit.accentColor,
                      }}
                    >
                      {unit.badgeText}
                    </span>
                    <span className="text-[10px] font-semibold text-[#4B5563] uppercase">
                      Lini {unit.line}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937] leading-tight">
                      {unit.name}
                    </h3>
                    <p className="text-xs text-[#4B5563] mt-2 leading-relaxed">
                      {unit.description}
                    </p>
                  </div>

                  <div className="pt-2 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F2937] block">
                      Ruang Lingkup Unggulan:
                    </span>
                    <ul className="space-y-1.5">
                      {unit.services.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-[#4B5563]"
                        >
                          <Check
                            className="w-4 h-4 flex-shrink-0 mt-0.5"
                            style={{ color: unit.accentColor }}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-[#CFE0D8]">
                  {unit.id === "academy" ? (
                    <Link
                      href="/daftar/ai-academy"
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-[#0F4C3A] text-white hover:bg-[#1A6B52] transition-colors"
                    >
                      <span>{unit.ctaText}</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/order?unit=${unit.id}`}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-gray-300 hover:border-[#0F4C3A] text-[#1F2937] hover:text-[#0F4C3A] hover:bg-[#EEF5F2] transition-all"
                    >
                      <span>Pesan / Konsultasi Layanan &rarr;</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
