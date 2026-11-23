import React from "react";
import { MessageSquare, FileCheck2, Cpu, Award } from "lucide-react";

export function ProcessSteps() {
  const steps = [
    {
      num: "01",
      title: "Konsultasi & Pemetaan",
      subtitle: "Discovery & Scope",
      description:
        "Sampaikan target dan kendala bisnis Anda. Kami menyusun rincian ruang lingkup kerja (scope), estimasi waktu, dan proposal penawaran transparan tanpa biaya siluman.",
      icon: MessageSquare,
      highlight: false,
    },
    {
      num: "02",
      title: "Persetujuan Akad & DP 50%",
      subtitle: "Komitmen Kemitraan Adil",
      description:
        "Setelah ruang lingkup disepakati bersama secara tertulis, pengerjaan proyek resmi dibuka dengan pembayaran komitmen DP 50% yang amanah bagi kedua belah pihak.",
      icon: FileCheck2,
      highlight: true, // Sorotan Amber sesuai arahan akad syariah
    },
    {
      num: "03",
      title: "Eksekusi Terpantau & Review",
      subtitle: "Standar Profesional Itqan",
      description:
        "Tim spesialis lintas unit mengerjakan proyek sesuai milestone terjadwal. Anda menerima pembaruan berkala setiap pekan dan kesempatan revisi terukur.",
      icon: Cpu,
      highlight: false,
    },
    {
      num: "04",
      title: "Pelunasan & Serah Terima",
      subtitle: "100% Kepemilikan Klien",
      description:
        "Setelah hasil akhir Anda setujui dan sisa pelunasan 50% terverifikasi, seluruh aset master, berkas desain, source code, dan dokumentasi diserahkan sepenuhnya.",
      icon: Award,
      highlight: false,
    },
  ];

  return (
    <section id="cara-kerja" className="py-20 bg-white border-y border-[#CFE0D8] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8]">
            CARA KERJA KAMI
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Empat Langkah Jelas dari Diskusi Awal hingga Karya Siap Digunakan
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Menerapkan prinsip syariah Zero Gharar: kepastian ruang lingkup, kejelasan tenggat waktu, dan transparansi pembayaran di setiap tahapan.
          </p>
        </div>

        {/* 4 Steps Horizontal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 relative ${
                  step.highlight
                    ? "bg-[#FEF3C7]/40 border-2 border-[#B45309] shadow-md"
                    : "bg-[#F8FAF9] border border-[#CFE0D8] shadow-xs"
                }`}
              >
                {/* Step Number & Icon */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-2xl font-extrabold tabular-nums ${
                        step.highlight ? "text-[#B45309]" : "text-[#0F4C3A]"
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {step.num}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        step.highlight
                          ? "bg-[#B45309] text-white"
                          : "bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    {step.highlight && (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#B45309] text-white mb-2">
                        Akad Syariah
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-[#1F2937] leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#4B5563] mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
