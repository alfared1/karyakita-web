import React from "react";
import { Layers, Cpu, Scale, TrendingUp } from "lucide-react";

export function ValueStrip() {
  const values = [
    {
      icon: Layers,
      title: "Satu Pintu, 5 Spesialisasi",
      description:
        "Desain, web kustom, analisis data, video promosi, dan pelatihan AI terhubung dalam satu ritme kerja terpadu tanpa repot koordinasi banyak vendor.",
    },
    {
      icon: Cpu,
      title: "Berbasis AI & Modern Stack",
      description:
        "Dibangun dengan teknologi terkini (Next.js, Tailwind, PostgreSQL) dan alur kerja AI yang cepat, efisien, serta 100% perangkat lunak legal.",
    },
    {
      icon: Scale,
      title: "Etika Bisnis Islam (Itqan)",
      description:
        "Ruang lingkup kerja, tenggat, hak revisi, dan skema DP 50% tertulis jelas sejak awal tanpa biaya siluman atau taktik manipulatif (Zero Gharar).",
    },
    {
      icon: TrendingUp,
      title: "Terukur UMKM s.d. Institusi",
      description:
        "Pendekatan lean menjaga kualitas output setara standar industri papan atas namun tetap rasional secara anggaran untuk organisasi berkembang.",
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-[#CFE0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B45309] block mb-1">
            MENGAPA MEMILIH KARYAKITA?
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold text-[#1F2937]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Fondasi Integritas &amp; Kecepatan Eksekusi Studio
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#CFE0D8] hover:border-[#0F4C3A]/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EEF5F2] border border-[#CFE0D8] flex items-center justify-center text-[#0F4C3A]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937] leading-snug">
                  {v.title}
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
