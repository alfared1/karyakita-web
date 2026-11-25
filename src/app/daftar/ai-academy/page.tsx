"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  Video,
  ArrowRight,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { KaryaKitaLogo } from "@/components/brand/KaryaKitaLogo";
import {
  PaymentProgressStepper,
  BankTransferCard,
  PaymentProofUploader,
} from "@/components/payment-gate";
import { formatRupiah } from "@/types/payment-gate";

export default function DaftarAIAcademyPage() {
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("Mahasiswa");
  const [ticketOption, setTicketOption] = useState<"batch1_promo" | "regular">("batch1_promo");

  // Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<{
    orderCode: string;
    requiredAmountIdr: number;
  } | null>(null);

  const ticketPrice = ticketOption === "batch1_promo" ? 25000 : 75000;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validasi nomor WhatsApp
    const cleanWa = whatsapp.trim().replace(/[-\s]/g, "");
    if (!cleanWa.startsWith("08") && !cleanWa.startsWith("628") && !cleanWa.startsWith("+628")) {
      setErrorMessage("Nomor WhatsApp wajib menggunakan format Indonesia (contoh: 081234567890).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/public/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerWhatsapp: cleanWa,
          customerEmail: email.trim().toLowerCase(),
          organization: institution,
          unitCode: "academy",
          scheme: "PUBLIC_FULL_100",
          contractValueIdr: ticketPrice,
          requiredAmountIdr: ticketPrice,
          notes: `Tiket AI Academy: ${
            ticketOption === "batch1_promo" ? "Batch 1 Early Bird Diskon" : "Reguler"
          } (Status: ${institution})`,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal membuat tiket pendaftaran.");
      }

      setCreatedOrder({
        orderCode: json.orderCode,
        requiredAmountIdr: json.requiredAmountIdr,
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1F2937] flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#CFE0D8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <KaryaKitaLogo variant="light" iconSize={32} />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#065F46] border border-emerald-200 items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Jalur Pendaftaran Cepat (&lt; 2 Menit)
            </span>
            <Link
              href="/#academy"
              className="text-xs font-semibold text-[#4B5563] hover:text-[#0F4C3A]"
            >
              Kembali ke Web &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!createdOrder ? (
          /* LANGKAH 1: FORMULIR RINGKAS & DETAIL WORKSHOP */
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8] inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0F4C3A]" />
                KARYAKITA AI ACADEMY · BATCH 1
              </span>
              <h1
                className="text-2xl sm:text-4xl font-extrabold text-[#1F2937]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Pendaftaran &amp; Checkout Cepat Workshop AI
              </h1>
              <p className="text-sm text-[#4B5563]">
                Kuasai AI praktis untuk automasi tugas kuliah, riset skripsi, dan efisiensi kerja harian dalam 1 sesi live hands-on interaktif.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Kolom Kiri: Rincian Manfaat & Jadwal (5 Kolom) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl bg-white border border-[#CFE0D8] p-5 sm:p-6 shadow-xs space-y-5">
                  <div className="border-b border-[#CFE0D8] pb-4">
                    <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                      Jadwal Workshop Live
                    </span>
                    <h3 className="text-base font-bold text-[#1F2937] mt-1">
                      Prompt Engineering Praktis &amp; AI Workflow Mastery
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs text-[#374151]">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#0F4C3A] shrink-0" />
                      <span><b>Hari &amp; Tanggal:</b> Sabtu, 6 Desember 2026</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#0F4C3A] shrink-0" />
                      <span><b>Waktu:</b> 09.30 – 12.00 WIB (2,5 Jam Praktik)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Video className="w-4 h-4 text-[#0F4C3A] shrink-0" />
                      <span><b>Platform:</b> Google Meet Interaktif</span>
                    </div>
                  </div>

                  <div className="border-t border-[#CFE0D8] pt-4 space-y-2.5">
                    <span className="text-xs font-bold text-[#0F4C3A] block">
                      Paket yang Anda Dapatkan:
                    </span>
                    <ul className="space-y-2 text-xs text-[#4B5563]">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Akses Rekaman Kelas Sepuasnya (Lifetime)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Template Prompt Pack Siap Pakai KaryaKita</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>E-Sertifikat Resmi Terverifikasi KaryaKita AI Academy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Grup Diskusi &amp; Networking Eksklusif</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Sharia Trust Box */}
                <div className="p-4 rounded-xl bg-[#EEF5F2] border border-[#CFE0D8] text-xs text-[#0F4C3A] space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Akad Ijarah (Upah Edukasi Sah &amp; Halal)</span>
                  </p>
                  <p className="text-[11px] text-[#4B5563] leading-relaxed">
                    Biaya yang dibayarkan murni untuk jasa pendampingan edukasi tanpa biaya tersembunyi (<em>zero gharar</em>).
                  </p>
                </div>
              </div>

              {/* Kolom Kanan: Form Pendaftaran (7 Kolom) */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-white border border-[#CFE0D8] p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937]">
                      Lengkapi Data Peserta
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      Tautan akses Google Meet dan materi akan dikirimkan ke nomor WhatsApp dan email ini.
                    </p>
                  </div>

                  {/* Pilihan Tiket */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#374151]">
                      Pilih Kategori Tiket:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setTicketOption("batch1_promo")}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          ticketOption === "batch1_promo"
                            ? "border-[#0F4C3A] bg-[#EEF5F2] ring-2 ring-[#0F4C3A]/20"
                            : "border-[#CFE0D8] bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B45309] text-white">
                            Diskon Batch 1
                          </span>
                          <span className="text-xs text-gray-400 line-through">Rp75.000</span>
                        </div>
                        <p className="text-base font-extrabold text-[#0F4C3A] tabular-nums">
                          Rp25.000
                        </p>
                        <p className="text-[11px] text-[#4B5563]">Early bird 30 kursi pertama</p>
                      </div>

                      <div
                        onClick={() => setTicketOption("regular")}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          ticketOption === "regular"
                            ? "border-[#0F4C3A] bg-[#EEF5F2] ring-2 ring-[#0F4C3A]/20"
                            : "border-[#CFE0D8] bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">
                            Reguler
                          </span>
                        </div>
                        <p className="text-base font-extrabold text-[#1F2937] tabular-nums">
                          Rp75.000
                        </p>
                        <p className="text-[11px] text-[#4B5563]">Harga normal workshop</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">
                        Nama Lengkap (Sesuai E-Sertifikat) *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Muhammad Fulan"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFE0D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#374151] mb-1">
                          Nomor WhatsApp Aktif *
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
                          Alamat Email Aktif *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="fulan@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFE0D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">
                        Status / Instansi *
                      </label>
                      <select
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFE0D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
                      >
                        <option value="Mahasiswa">Mahasiswa / Pelajar</option>
                        <option value="UMKM">Pelaku Usaha / UMKM</option>
                        <option value="Profesional">Karyawan / Profesional</option>
                        <option value="Umum">Umum / Pencari Kerja</option>
                      </select>
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
                            <span>Menyiapkan Tiket Pesanan...</span>
                          </>
                        ) : (
                          <>
                            <span>Lanjut ke Instruksi Pembayaran ({formatRupiah(ticketPrice)})</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* LANGKAH 2: INSTRUKSI PEMBAYARAN & UNGGAH BUKTI */
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Tiket Berhasil Dipesan: {createdOrder.orderCode}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
                Selesaikan Pembayaran Tiket Anda
              </h2>
              <p className="text-xs text-[#4B5563]">
                Transfer nominal di bawah ke rekening resmi Bank Syariah Indonesia (BSI) KaryaKita lalu lampirkan buktinya.
              </p>
            </div>

            {/* Stepper Progres */}
            <PaymentProgressStepper
              scheme="PUBLIC_FULL_100"
              status="WAITING_FULL_100"
              requiredAmountIdr={createdOrder.requiredAmountIdr}
            />

            {/* Kartu Bank Syariah */}
            <BankTransferCard
              orderCode={createdOrder.orderCode}
              requiredAmountIdr={createdOrder.requiredAmountIdr}
              title="Instruksi Transfer Tiket AI Academy"
            />

            {/* Form Unggah Bukti */}
            <PaymentProofUploader
              orderCode={createdOrder.orderCode}
              expectedAmountIdr={createdOrder.requiredAmountIdr}
              onSuccess={() => {
                router.push(`/status/${createdOrder.orderCode}`);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
