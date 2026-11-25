"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Building2,
  MessageCircle,
  ArrowRight,
  Loader2,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { KaryaKitaLogo } from "@/components/brand/KaryaKitaLogo";
import { BUSINESS_UNITS, formatRupiah } from "@/types/payment-gate";
import { buildWhatsAppUrl } from "@/config/contacts";

interface ServicePreset {
  id: string;
  name: string;
  price: number;
}

const PRESET_PACKAGES: Record<string, ServicePreset[]> = {
  design: [
    { id: "design-starter", name: "Starter Brand Asset", price: 500000 },
    { id: "design-corporate", name: "Corporate Brand Guidelines", price: 1250000 },
    { id: "design-uiux", name: "UI/UX Prototype Studio", price: 1500000 },
  ],
  webtech: [
    { id: "web-landing", name: "High-Converting Landing Page", price: 1250000 },
    { id: "web-company", name: "Modern Corporate Website", price: 2500000 },
    { id: "web-app", name: "Custom Web App & Dashboard", price: 3500000 },
  ],
  assist: [
    { id: "data-analysis", name: "Data Cleaning & Statistical Analysis", price: 250000 },
    { id: "data-pitchdeck", name: "Executive Pitch Deck & SOP", price: 500000 },
    { id: "data-feasibility", name: "Feasibility Study & Market Research", price: 1000000 },
  ],
  media: [
    { id: "media-single", name: "Single Performance Video", price: 150000 },
    { id: "media-retainer", name: "Monthly Growth (10 Video Komersial)", price: 1250000 },
    { id: "media-affiliate", name: "Dedicated Affiliate Co-Selling (Komitmen)", price: 500000 },
  ],
  academy: [
    { id: "academy-corporate", name: "In-House Corporate AI Training", price: 1500000 },
    { id: "academy-advisory", name: "Executive AI Advisory (1-on-1)", price: 750000 },
  ],
  bundle: [
    { id: "bundle-launchpad", name: "Paket 'Digital Launchpad'", price: 2500000 },
    { id: "bundle-fullstack", name: "Paket 'Full Venture Transformation'", price: 4500000 },
  ],
};

function normalizeUnitCode(rawUnit: string | null): string {
  if (!rawUnit) return "webtech";
  if (rawUnit === "data") return "assist";
  if (rawUnit === "bundles") return "bundle";
  return BUSINESS_UNITS[rawUnit] ? rawUnit : "webtech";
}

function findInitialPackage(unitKey: string, pkgParam: string | null): ServicePreset {
  const unitPackages = PRESET_PACKAGES[unitKey] || [];
  if (pkgParam) {
    const matched = unitPackages.find(
      (p) => p.id === pkgParam || pkgParam.endsWith(`-${p.id}`)
    );
    if (matched) return matched;
  }
  return unitPackages[0] || { id: "custom", name: "Kustom", price: 1250000 };
}

function OrderFormContent() {
  const searchParams = useSearchParams();
  const initialUnit = normalizeUnitCode(searchParams.get("unit"));
  const initialPkgParam = searchParams.get("package");

  const [selectedUnit, setSelectedUnit] = useState(initialUnit);
  const [selectedPackage, setSelectedPackage] = useState<ServicePreset>(() =>
    findInitialPackage(initialUnit, initialPkgParam)
  );

  const [clientName, setClientName] = useState("");
  const [company, setCompany] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [deadline, setDeadline] = useState("Standar (7-14 Hari)");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    orderCode: string;
    portalToken: string;
    contractValueIdr: number;
    requiredAmountIdr: number;
  } | null>(null);

  const handleUnitChange = (unitKey: string) => {
    setSelectedUnit(unitKey);
    setSelectedPackage(PRESET_PACKAGES[unitKey]?.[0]);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanWa = whatsapp.trim().replace(/[-\s]/g, "");
    if (!cleanWa.startsWith("08") && !cleanWa.startsWith("628") && !cleanWa.startsWith("+628")) {
      setErrorMessage("Nomor WhatsApp wajib menggunakan format Indonesia (contoh: 081234567890).");
      return;
    }

    setIsSubmitting(true);

    const contractValue = selectedPackage.price;
    const dpAmount = Math.round(contractValue / 2);

    try {
      const res = await fetch("/api/public/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: clientName.trim(),
          customerWhatsapp: cleanWa,
          customerEmail: email.trim().toLowerCase(),
          organization: company.trim() || undefined,
          unitCode: selectedUnit,
          scheme: "B2B_SPLIT_50_50",
          contractValueIdr: contractValue,
          requiredAmountIdr: dpAmount,
          notes: `Paket: ${selectedPackage.name} | Target Waktu: ${deadline}${
            notes.trim() ? " | Catatan: " + notes.trim() : ""
          }`,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal membuat pesanan proyek.");
      }

      setSuccessData({
        orderCode: json.orderCode,
        portalToken: json.portalToken,
        contractValueIdr: contractValue,
        requiredAmountIdr: dpAmount,
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeUnitInfo = BUSINESS_UNITS[selectedUnit];

  return (
    <div className="space-y-8">
      {!successData ? (
        <>
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8] inline-flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#0F4C3A]" />
              KARYAKITA B2B &amp; VENTURE ORDER
            </span>
            <h1
              className="text-2xl sm:text-4xl font-extrabold text-[#1F2937]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Mulai Kolaborasi Proyek Bisnis Anda
            </h1>
            <p className="text-sm text-[#4B5563]">
              Pilih unit layanan, tentukan spesifikasi proyek, dan dapatkan portal pembayaran transparan dengan jaminan akad syariah <em>Ijarah</em>.
            </p>
          </div>

          {/* Unit Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Object.entries(BUSINESS_UNITS).map(([key, info]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleUnitChange(key)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  selectedUnit === key
                    ? "bg-[#0F4C3A] text-white shadow-md"
                    : "bg-white text-[#4B5563] border border-[#CFE0D8] hover:bg-[#EEF5F2]"
                }`}
              >
                <span>{info.lineNum}: {info.name.replace("KaryaKita ", "")}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Kolom Kiri: Rincian Unit & Paket (5 Kolom) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl bg-white border border-[#CFE0D8] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="border-b border-[#CFE0D8] pb-3">
                  <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Unit Terpilih:
                  </span>
                  <h3 className="text-lg font-bold text-[#0F4C3A] mt-0.5">
                    {activeUnitInfo.name}
                  </h3>
                  <p className="text-xs text-[#4B5563] mt-1">{activeUnitInfo.description}</p>
                </div>

                {/* Pilih Paket Layanan */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#374151]">
                    Pilih Paket Estimasi Kontrak:
                  </label>
                  <div className="space-y-2">
                    {PRESET_PACKAGES[selectedUnit]?.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedPackage.id === pkg.id
                            ? "border-[#0F4C3A] bg-[#EEF5F2] ring-1 ring-[#0F4C3A]"
                            : "border-[#CFE0D8] bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-[#1F2937]">{pkg.name}</p>
                          <p className="text-[11px] text-[#6B7280]">
                            DP 50%: {formatRupiah(Math.round(pkg.price / 2))}
                          </p>
                        </div>
                        <p className="text-xs font-bold text-[#0F4C3A] tabular-nums">
                          {formatRupiah(pkg.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#CFE0D8] space-y-1 text-xs text-[#4B5563]">
                  <p className="font-semibold text-[#1F2937]">Skema Pembayaran Syariah:</p>
                  <p>• DP 50% di muka sebagai pengikat komitmen produksi.</p>
                  <p>• Pelunasan 50% setelah hasil pengerjaan disetujui bersama.</p>
                  <p>• Bebas denda bunga / usury jika terjadi keterlambatan (<em>zero riba</em>).</p>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Form Data Klien (7 Kolom) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-white border border-[#CFE0D8] p-6 sm:p-8 shadow-xs space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-[#1F2937]">Informasi Klien &amp; Proyek</h3>
                  <p className="text-xs text-[#6B7280]">
                    Isi kontak Anda untuk pembuatan tiket pesanan dan portal pembayaran resmi.
                  </p>
                </div>

                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">
                        Nama PIC / Klien *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Contoh: Bpk. Hendra"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFE0D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">
                        Perusahaan / Brand (Opsional)
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Contoh: PT Berkah Mandiri"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFE0D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="081234567890"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFE0D8] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">
                        Email Klien *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hendra@perusahaan.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFE0D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">
                      Ekspektasi Waktu Selesai (Target Deadline)
                    </label>
                    <select
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFE0D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
                    >
                      <option value="Kilat (3-5 Hari)">Kilat (3–5 Hari Kerja)</option>
                      <option value="Standar (7-14 Hari)">Standar (7–14 Hari Kerja)</option>
                      <option value="Komprehensif (30 Hari)">Komprehensif (30 Hari Kerja)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">
                      Ringkasan Kebutuhan &amp; Spesifikasi Proyek
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ceritakan gambaran singkat proyek yang ingin Anda bangun bersama KaryaKita..."
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFE0D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[44px] py-3 px-5 rounded-xl text-sm font-bold bg-[#0F4C3A] hover:bg-[#1A6B52] disabled:opacity-50 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Menyiapkan Tiket Pesanan B2B...</span>
                        </>
                      ) : (
                        <>
                          <span>Pesan Proyek &amp; Buka Portal Pembayaran</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* SUCCESS CONFIRMATION SCREEN */
        <div className="max-w-2xl mx-auto space-y-6 text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0F4C3A] flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Tiket B2B Dibuat · Menunggu Pembayaran DP 50%
            </span>
            <h2 className="text-2xl font-extrabold text-[#1F2937]">
              Pesanan Proyek Anda Berhasil Diterima!
            </h2>
            <p className="text-sm text-[#4B5563]">
              Nomor Tiket Order Anda:{" "}
              <b className="font-mono text-base text-[#0F4C3A]">{successData.orderCode}</b>
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#CFE0D8] p-6 text-left space-y-4 shadow-xs">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-xs text-gray-500">Nilai Kontrak Proyek:</span>
              <span className="text-base font-extrabold text-[#1F2937] tabular-nums">
                {formatRupiah(successData.contractValueIdr)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-xs text-gray-500">DP 50% Pembuka Eksekusi:</span>
              <span className="text-base font-extrabold text-[#0F4C3A] tabular-nums">
                {formatRupiah(successData.requiredAmountIdr)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Tautan Portal Pembayaran Klien:</span>
              <Link
                href={`/pay/${successData.portalToken}`}
                className="text-xs font-bold text-[#0F4C3A] hover:underline flex items-center gap-1"
              >
                <span>Buka Portal Pembayaran</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/pay/${successData.portalToken}`}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl text-sm font-bold bg-[#0F4C3A] hover:bg-[#1A6B52] text-white shadow-md flex items-center justify-center gap-2"
            >
              <span>Masuk ke Portal Pembayaran Klien &rarr;</span>
            </Link>

            {buildWhatsAppUrl(`${activeUnitInfo.name} (${successData.orderCode})`) ? (
              <a
                href={buildWhatsAppUrl(`${activeUnitInfo.name} (${successData.orderCode})`) || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-bold border border-[#0F4C3A] text-[#0F4C3A] hover:bg-[#EEF5F2] flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Lanjut Diskusi via WhatsApp</span>
              </a>
            ) : (
              <Link
                href={`/status/${successData.orderCode}`}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-bold border border-[#0F4C3A] text-[#0F4C3A] hover:bg-[#EEF5F2] flex items-center justify-center gap-2"
              >
                <span>Pantau Status Tiket Order</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderB2BPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1F2937] flex flex-col">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#CFE0D8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <KaryaKitaLogo variant="light" iconSize={32} />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#065F46] border border-emerald-200 items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Akad Syariah Ijarah bi al-&apos;Amal
            </span>
            <Link
              href="/#layanan"
              className="text-xs font-semibold text-[#4B5563] hover:text-[#0F4C3A]"
            >
              Kembali ke Web &rarr;
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Suspense
          fallback={
            <div className="py-20 text-center text-xs text-gray-500">
              Memuat formulir pemesanan...
            </div>
          }
        >
          <OrderFormContent />
        </Suspense>
      </main>
    </div>
  );
}
