"use client";

import React, { useState } from "react";
import { Check, Sparkles, ShieldCheck, ArrowRight, Layers, HelpCircle } from "lucide-react";

interface PricingSectionProps {
  onOpenContact: (title?: string, actionType?: "b2b" | "academy") => void;
}

interface PriceItem {
  id: string;
  name: string;
  badge?: string;
  originalPrice?: string;
  price: string;
  period?: string;
  description: string;
  deliverables: string[];
  sla: string;
  akad: string;
  isPopular?: boolean;
  ctaText?: string;
  actionType: "b2b" | "academy";
}

interface CategoryLine {
  id: string;
  lineNum: string;
  title: string;
  subtitle: string;
  items: PriceItem[];
}

export function PricingSection({ onOpenContact }: PricingSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const categories: CategoryLine[] = [
    {
      id: "design",
      lineNum: "LINI 1",
      title: "KaryaKita Design",
      subtitle: "Brand Identity & UI/UX Design Studio",
      items: [
        {
          id: "design-starter",
          name: "Starter Brand Asset",
          price: "Rp500.000",
          period: "/ proyek",
          description: "Fondasi visual esensial untuk bisnis baru atau UMKM yang ingin tampil rapi dan kredibel.",
          deliverables: [
            "Desain Logo Vektor (3 konsep awal)",
            "Palet Warna Resmi & Panduan Tipografi",
            "Aset Visual Profil Sosial Media (IG/WA)",
            "Master File Lengkap (.AI, .PNG, .SVG)"
          ],
          sla: "SLA 4–6 Hari Kerja · 2x Revisi Minor",
          akad: "Akad Ijarah bi al-'Amal",
          actionType: "b2b"
        },
        {
          id: "design-corporate",
          name: "Corporate Brand Guidelines",
          badge: "Paling Diminati",
          price: "Rp1.250.000",
          period: "/ proyek",
          description: "Sistem identitas merek komprehensif berstandar korporat untuk meningkatkan *brand equity*.",
          deliverables: [
            "Full Brand Identity Guideline Book (PDF)",
            "Filosofi Logo, Do & Don't Penggunaan",
            "Desain Kartu Nama, Kop Surat, & Map Bisnis",
            "Mockup Kemasan / Packaging & Adab Visual Islami"
          ],
          sla: "SLA 7–12 Hari Kerja · 3x Revisi",
          akad: "Akad Ijarah bi al-'Amal",
          isPopular: true,
          actionType: "b2b"
        },
        {
          id: "design-uiux",
          name: "UI/UX Prototype Studio",
          price: "Rp1.500.000",
          period: "/ proyek",
          description: "Desain antarmuka aplikasi web atau mobile modern di Figma yang siap diimplementasikan developer.",
          deliverables: [
            "Desain Antarmuka Figma Responsif (Mobile & Desktop)",
            "Interactive Clickable Prototype & User Flow",
            "Design Token & Component Library (Atoms-Molecules)",
            "Developer Handover File & Asset Export"
          ],
          sla: "SLA 10–14 Hari Kerja · 3x Revisi",
          akad: "Akad Ijarah bi al-'Amal",
          actionType: "b2b"
        }
      ]
    },
    {
      id: "webtech",
      lineNum: "LINI 2",
      title: "KaryaKita WebTech",
      subtitle: "Custom Web Engineering & Scalable Platforms",
      items: [
        {
          id: "web-landing",
          name: "High-Converting Landing Page",
          badge: "Rekomendasi Scale-Up",
          price: "Rp1.250.000",
          period: "/ proyek",
          description: "Landing page modern berbasis Next.js & Tailwind CSS, super cepat di HP dan teroptimasi konversi.",
          deliverables: [
            "1 Halaman Panjang Teroptimasi Konversi (CRO)",
            "Integrasi Tombol WhatsApp & Formulir Prospek",
            "Mobile-First, SEO On-Page, & Skor Kecepatan Tinggi",
            "Gratis Hosting Vercel & Sertifikat SSL Resmi"
          ],
          sla: "SLA 7–10 Hari Kerja · Garansi Bug 30 Hari",
          akad: "Akad Ijarah bi al-'Amal (DP 50%)",
          isPopular: true,
          actionType: "b2b"
        },
        {
          id: "web-company",
          name: "Modern Corporate Website",
          price: "Rp2.500.000",
          period: "/ proyek",
          description: "Website multi-halaman lengkap untuk membangun otoritas bisnis di mata klien B2B dan investor.",
          deliverables: [
            "5–7 Halaman Resmi (Home, About, Layanan, Portofolio, Kontak)",
            "Panel CMS Pengelolaan Konten Mandiri",
            "Setup Email Domain Bisnis Resmi (misal: halo@namabisnis.id)",
            "Gratis Domain Resmi 1 Tahun (.id / .com)"
          ],
          sla: "SLA 14–21 Hari Kerja · Pendampingan CMS",
          akad: "Akad Ijarah bi al-'Amal (DP 50%)",
          actionType: "b2b"
        },
        {
          id: "web-app",
          name: "Custom Web App & Dashboard",
          price: "Rp3.500.000",
          period: "/ sistem (mulai dari)",
          description: "Sistem informasi berbasis web kustom: dashboard operasional, otomasi data, dan portal internal.",
          deliverables: [
            "Arsitektur Web App Kustom (Next.js App Router)",
            "Dashboard Internal & Role-Based Authentication",
            "Integrasi Database Cloud (Neon PostgreSQL / Supabase)",
            "Full Source Code & Dokumentasi Teknis Sistem"
          ],
          sla: "SLA 21–30 Hari Kerja · Sesuai Scope Fitur",
          akad: "Akad Ijarah bi al-'Amal (DP 50%)",
          actionType: "b2b"
        }
      ]
    },
    {
      id: "data",
      lineNum: "LINI 3",
      title: "KaryaKita Assist & Data",
      subtitle: "Technical Assistance & Business Documentation",
      items: [
        {
          id: "data-analysis",
          name: "Data Cleaning & Statistical Analysis",
          price: "Rp250.000",
          period: "/ modul (mulai dari)",
          description: "Pengolahan dan pembersihan data mentah bisnis menjadi visualisasi insight yang mudah dipahami.",
          deliverables: [
            "Pembersihan Data Mentah (Data Cleaning & Wrangling)",
            "Uji Statistik Deskriptif & Inferensial (Excel/SPSS/Python)",
            "Visualisasi Grafik Tren Bisnis Siap Presentasi",
            "Ringkasan Temuan Eksekutif (.pdf)"
          ],
          sla: "SLA 2–4 Hari Kerja · 2x Revisi",
          akad: "Akad Ijarah bi al-'Amal",
          actionType: "b2b"
        },
        {
          id: "data-pitchdeck",
          name: "Executive Pitch Deck & SOP",
          price: "Rp500.000",
          period: "/ dokumen",
          description: "Penyusunan slide presentasi bisnis investor berstandar Venture Studio atau dokumen SOP operasional.",
          deliverables: [
            "10–15 Slide Pitch Deck Investor Berstruktur Logis",
            "Penyusunan Dokumen SOP Alur Bisnis / Modul Sistem",
            "Desain Visual Presentasi Profesional (.pptx & .pdf)",
            "Format Siap Cetak dan Siap Presentasi"
          ],
          sla: "SLA 4–7 Hari Kerja · 2x Revisi",
          akad: "Akad Ijarah bi al-'Amal",
          actionType: "b2b"
        },
        {
          id: "data-feasibility",
          name: "Feasibility Study & Market Research",
          price: "Rp1.000.000",
          period: "/ laporan",
          description: "Riset pasar mendalam dan analisis kelayakan komersial untuk validasi produk baru sebelum rilis.",
          deliverables: [
            "Laporan Riset Pasar & Pemetaan Kompetitor Indonesia",
            "Analisis SWOT-TOWS & 5 Kekuatan Porter",
            "Model Proyeksi Keuangan & Perhitungan BEP",
            "Dokumen Lengkap 20–30 Halaman Standar Akademik/Industri"
          ],
          sla: "SLA 7–12 Hari Kerja · Diskusi Pendampingan",
          akad: "Akad Ijarah bi al-'Amal",
          actionType: "b2b"
        }
      ]
    },
    {
      id: "media",
      lineNum: "LINI 4",
      title: "KaryaKita Media & Affiliate",
      subtitle: "Performance Video Production & Growth Network",
      items: [
        {
          id: "media-single",
          name: "Single Performance Video",
          price: "Rp150.000",
          period: "/ video",
          description: "1 video pendek berorientasi konversi penjualan untuk TikTok, Instagram Reels, atau Shopee Video.",
          deliverables: [
            "Naskah Video Berbasis Hook-Story-Offer",
            "Penyuntingan Dinamis (CapCut / DaVinci Resolve)",
            "Sound Effect & Subtitle Teks Dinamis",
            "Format Siap Unggah (Full HD 9:16)"
          ],
          sla: "SLA 2–3 Hari Kerja · 2x Revisi Minor",
          akad: "Akad Ijarah bi al-'Amal",
          actionType: "b2b"
        },
        {
          id: "media-retainer",
          name: "Monthly Growth (10 Video)",
          badge: "Paling Efisien",
          price: "Rp1.250.000",
          period: "/ bulan",
          description: "Paket retainer bulanan 10 video komersial terstruktur untuk menjaga konsistensi trafik akun bisnis.",
          deliverables: [
            "10 Video Pendek Terjadwal Siap Posting per Bulan",
            "Riset Topik & Naskah Copywriting Caption Lengkap",
            "Penyuntingan Visual Berkualitas Tinggi",
            "Optimasi Tautan Penjualan & Tagar Strategis"
          ],
          sla: "Distribusi Mingguan · Retainer Bulanan",
          akad: "Akad Ijarah bi al-'Amal",
          isPopular: true,
          actionType: "b2b"
        },
        {
          id: "media-affiliate",
          name: "Dedicated Affiliate Co-Selling",
          price: "Bagi Hasil 10%–25%",
          period: "/ penjualan berhasil",
          description: "Kemitraan pemasaran produk fisik/digital mitra terkurasi tanpa biaya tetap produksi video di muka.",
          deliverables: [
            "Distribusi Promosi Video Tanpa Modal Stok Klien",
            "Optimasi Jalur Trafik Langsung ke Toko / Landing Page",
            "Pencatatan Penjualan Terbuka Bebas Manipulasi",
            "Fokus Khusus Produk Kuliner/F&B & Ritel Halal"
          ],
          sla: "Kemitraan Berkelanjutan",
          akad: "Akad Ju'alah / Wakalah bil Ujrah",
          actionType: "b2b"
        }
      ]
    },
    {
      id: "academy",
      lineNum: "LINI 5",
      title: "KaryaKita AI Academy",
      subtitle: "Corporate AI Academy & Executive Enablement",
      items: [
        {
          id: "academy-batch1",
          name: "Workshop Publik AI One-to-Many",
          badge: "Diskon Batch 1",
          originalPrice: "Rp75.000",
          price: "Rp25.000",
          period: "/ peserta (lunas di muka)",
          description: "Sesi live hands-on interaktif menguasai prompt engineering praktis untuk efisiensi kerja harian.",
          deliverables: [
            "1 Sesi Live Praktik Hands-On (2,5 Jam via Google Meet)",
            "Akses Rekaman Video Kelas Sepuasnya",
            "Template Prompt Pack Siap Pakai KaryaKita",
            "E-Sertifikat Resmi Terverifikasi KaryaKita AI Academy"
          ],
          sla: "Batch 1 · Terbatas 30 Kursi",
          akad: "Akad Ijarah (Upah Edukasi)",
          isPopular: true,
          ctaText: "Daftar Batch 1 Sekarang (Rp25.000)",
          actionType: "academy"
        },
        {
          id: "academy-corporate",
          name: "In-House Corporate AI Training",
          price: "Rp1.500.000",
          period: "/ sesi (hingga 15 peserta)",
          description: "Pelatihan kustom untuk tim internal perusahaan guna mengotomatisasi alur kerja dan memangkas jam kerja.",
          deliverables: [
            "Pelatihan Kustom 1 Hari Disesuaikan Kasus Bisnis Klien",
            "Audit Kesiapan Alur Kerja AI Organisasi",
            "Panduan SOP Integrasi AI ke Tim Internal",
            "Pendampingan Pascapelatihan Selama 14 Hari"
          ],
          sla: "Jadwal Fleksibel (Online / On-Site Bogor-Jabodetabek)",
          akad: "Akad Ijarah bi al-'Amal",
          actionType: "b2b"
        },
        {
          id: "academy-advisory",
          name: "Executive AI Advisory (1-on-1)",
          price: "Rp750.000",
          period: "/ orang (sesi privat)",
          description: "Mentoring privat intensif bersama pimpinan AI KaryaKita untuk merancang arsitektur otomasi bisnis.",
          deliverables: [
            "2 Sesi Konsultasi Eksklusif 1-on-1 (Total 3 Jam)",
            "Audit Alur Kerja Pribadi/Bisnis & Peta Jalan Adopsi AI",
            "Custom Workflow & Tool Selection Berbiaya Efisien",
            "Konsultasi Tanya Jawab via WhatsApp Selama 1 Bulan"
          ],
          sla: "Sesi Eksklusif Terbatas",
          akad: "Akad Ijarah bi al-'Amal",
          actionType: "b2b"
        }
      ]
    },
    {
      id: "bundle",
      lineNum: "PAKET KHUSUS",
      title: "KaryaKita Ecosystem Bundling",
      subtitle: "Solusi Terpadu Venture Transformation (Hemat Hingga Rp1.250.000)",
      items: [
        {
          id: "bundle-launchpad",
          name: "Paket 'Digital Launchpad'",
          badge: "Hemat Rp500.000",
          price: "Rp2.500.000",
          period: "/ paket terpadu",
          description: "Kombinasi identitas merek profesional dan landing page berkonversi tinggi untuk peluncuran bisnis baru.",
          deliverables: [
            "Lini 1: Full Brand Identity Guidelines + Aset Lengkap",
            "Lini 2: High-Converting Landing Page di Next.js",
            "Gratis Domain Resmi 1 Tahun & Hosting Vercel",
            "Integrasi WhatsApp Chatbot & Analitik Penjualan"
          ],
          sla: "SLA 14 Hari Kerja · DP 50%",
          akad: "Akad Ijarah bi al-'Amal",
          isPopular: true,
          actionType: "b2b"
        },
        {
          id: "bundle-fullstack",
          name: "Paket 'Full Venture Transformation'",
          badge: "Paling Komplit",
          price: "Rp4.500.000",
          period: "/ paket lengkap",
          description: "Transformasi digital ujung-ke-ujung: branding, web sistem, 10 konten video iklan, dan pelatihan AI tim.",
          deliverables: [
            "Lini 1: Corporate Brand Identity Book Lengkap",
            "Lini 2: Custom Multi-Page Website + Sistem Database",
            "Lini 4: 10 Video Iklan Komersial Siap Posting",
            "Lini 5: 1 Sesi Pelatihan In-House AI untuk Tim Klien"
          ],
          sla: "SLA 30 Hari Kerja · DP 50%",
          akad: "Akad Ijarah bi al-'Amal",
          actionType: "b2b"
        }
      ]
    }
  ];

  const displayedCategories =
    activeTab === "all"
      ? categories
      : categories.filter((c) => c.id === activeTab);

  return (
    <section id="harga" className="py-20 bg-[#F8FAF9] border-b border-[#CFE0D8] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8] inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C3A]" />
            TARIF TRANSPARAN &amp; AKAD SYARIAH
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Daftar Harga &amp; Paket Layanan Resmi KaryaKita
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Sesuai cetak biru *proposal bisnis revisi*, seluruh paket dirancang tanpa denda ribawi, ruang lingkup tegas (*bebas gharar*), dan harga jujur berlandaskan akad *Ijarah* dan *Ju&apos;alah*.
          </p>
        </div>

        {/* Tab Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "all"
                ? "bg-[#0F4C3A] text-white shadow-md"
                : "bg-white text-[#4B5563] border border-[#CFE0D8] hover:bg-[#EEF5F2] hover:text-[#0F4C3A]"
            }`}
          >
            Semua Lini ({categories.reduce((acc, curr) => acc + curr.items.length, 0)})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === cat.id
                  ? "bg-[#0F4C3A] text-white shadow-md"
                  : "bg-white text-[#4B5563] border border-[#CFE0D8] hover:bg-[#EEF5F2] hover:text-[#0F4C3A]"
              }`}
            >
              <span>{cat.lineNum}: {cat.title.replace("KaryaKita ", "")}</span>
            </button>
          ))}
        </div>

        {/* Categories & Cards Grid */}
        <div className="space-y-16">
          {displayedCategories.map((category) => (
            <div key={category.id} className="space-y-6">
              {/* Category Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#CFE0D8] pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#0F4C3A] bg-[#EEF5F2] px-2.5 py-0.5 rounded-md border border-[#CFE0D8]">
                      {category.lineNum}
                    </span>
                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#1F2937]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4B5563] mt-1">
                    {category.subtitle}
                  </p>
                </div>
                <span className="text-xs text-[#0F4C3A] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Transaksi Amanah Berakad Sah
                </span>
              </div>

              {/* Items Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                      item.isPopular
                        ? "bg-white border-2 border-[#0F4C3A] shadow-xl hover:-translate-y-1"
                        : "bg-white border border-[#CFE0D8] shadow-xs hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    {/* Badge if Popular or Discount */}
                    {item.badge && (
                      <div className="absolute -top-3.5 right-6">
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#B45309] text-white shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#FCD34D]" />
                          {item.badge}
                        </span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Name & Akad */}
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-lg font-bold text-[#1F2937] leading-snug">
                            {item.name}
                          </h4>
                        </div>
                        <span className="inline-block mt-1 text-[11px] font-semibold text-[#0F4C3A] bg-[#EEF5F2] px-2 py-0.5 rounded border border-[#CFE0D8]">
                          {item.akad}
                        </span>
                      </div>

                      {/* Pricing Display */}
                      <div className="py-2 border-y border-[#EEF5F2]">
                        <div className="flex flex-wrap items-baseline gap-2">
                          {item.originalPrice && (
                            <span className="line-through text-base text-[#9CA3AF] font-bold">
                              {item.originalPrice}
                            </span>
                          )}
                          <span className="text-3xl font-extrabold text-[#0F4C3A] tabular-nums tracking-tight">
                            {item.price}
                          </span>
                          {item.period && (
                            <span className="text-xs text-[#4B5563] font-medium">
                              {item.period}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Deliverables List */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#4B5563]">
                          Ruang Lingkup &amp; Deliverable:
                        </span>
                        <ul className="space-y-2">
                          {item.deliverables.map((deliv, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-[#374151]">
                              <Check className="w-4 h-4 text-[#0F4C3A] flex-shrink-0 mt-0.5" />
                              <span>{deliv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="pt-6 mt-6 border-t border-[#EEF5F2] space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                        <span className="font-medium text-[#4B5563]">{item.sla}</span>
                      </div>
                      <button
                        onClick={() =>
                          onOpenContact(
                            `Pemesanan Layanan: ${category.title} - ${item.name} (${item.price})`,
                            item.actionType
                          )
                        }
                        className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                          item.isPopular
                            ? "bg-[#0F4C3A] text-white hover:bg-[#0B382B] shadow-sm hover:shadow-md"
                            : "bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8] hover:bg-[#0F4C3A] hover:text-white"
                        }`}
                      >
                        <span>{item.ctaText || "Pilih & Konsultasi Paket"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sharia Principles & Trust Banner */}
        <div className="mt-16 rounded-2xl bg-white border border-[#CFE0D8] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EEF5F2] border border-[#CFE0D8] flex items-center justify-center flex-shrink-0 text-[#0F4C3A]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1F2937]">
                Komitmen Transparansi Finansial &amp; Zakat Usaha 2,5%
              </h4>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-1 max-w-2xl leading-relaxed">
                Setiap pembayaran proyek B2B menggunakan DP 50% di muka murni untuk biaya kerja tim tanpa utang ribawi. Sebanyak 2,5% laba bersih perusahaan secara rutin disalurkan untuk zakat usaha dan program <b>Wakaf Digital KaryaKita</b> guna membantu UMKM dhuafa dan masjid.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenContact("Konsultasi Kustom / Negosiasi Scope Proyek", "b2b")}
            className="w-full md:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#B45309] hover:bg-[#92400E] text-white shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Butuh Penawaran Kustom?</span>
          </button>
        </div>
      </div>
    </section>
  );
}
