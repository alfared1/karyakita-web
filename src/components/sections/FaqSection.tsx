"use client";

import React, { useState } from "react";
import { faqData } from "@/data/faq";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 bg-white border-b border-[#CFE0D8] scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8]">
            INFORMASI &amp; PERTANYAAN UMUM
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Pertanyaan yang Sering Diajukan Klien &amp; Calon Peserta
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Transparansi menyeluruh mengenai skema kerja sama, pembayaran syariah, dan komitmen profesional KaryaKita.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[#CFE0D8] bg-[#F8FAF9] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#EEF5F2]/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-[#1F2937]">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#0F4C3A] text-white rotate-180"
                        : "bg-white text-[#4B5563] border border-[#CFE0D8]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#4B5563] leading-relaxed border-t border-[#CFE0D8]/60 pt-4 animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
