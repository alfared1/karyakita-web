"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Video,
  FileText,
  Download,
  ExternalLink,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { KaryaKitaLogo } from "@/components/brand/KaryaKitaLogo";
import {
  PaymentGateBadge,
  PaymentProgressStepper,
  BankTransferCard,
  PaymentProofUploader,
} from "@/components/payment-gate";
import { PublicOrderDTO, BUSINESS_UNITS } from "@/types/payment-gate";
import { buildWhatsAppUrl } from "@/config/contacts";

function OrderStatusContent({
  params,
}: {
  params: Promise<{ orderCode: string }>;
}) {
  const { orderCode } = use(params);

  const [order, setOrder] = useState<PublicOrderDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrder = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setIsRefreshing(true);

      const res = await fetch(`/api/public/orders/${orderCode}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Gagal memuat status pesanan.");
      }

      setOrder(json);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Kesalahan sistem");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (orderCode) {
      fetch(`/api/public/orders/${orderCode}`)
        .then((res) => res.json())
        .then((json) => {
          if (isMounted) {
            if (json.error) setErrorMessage(json.error);
            else setOrder(json);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setErrorMessage(err instanceof Error ? err.message : "Kesalahan sistem");
            setIsLoading(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [orderCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-sm text-[#4B5563]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0F4C3A]" />
          <span>Memuat Status Pesanan...</span>
        </div>
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-6 text-center space-y-4 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-[#1F2937]">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-[#4B5563]">
            {errorMessage || "Nomor tiket pesanan tidak ditemukan di sistem KaryaKita."}
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-[#0F4C3A] text-white"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const unitInfo = BUSINESS_UNITS[order.unitCode] || BUSINESS_UNITS.academy;
  const isPaid = order.paymentGateStatus === "PAID_100_VERIFIED";
  const isDpVerified = order.paymentGateStatus === "DP_50_VERIFIED";
  const isVerifying = order.paymentGateStatus === "VERIFYING_PROOF";
  const isRejected = order.paymentGateStatus === "REJECTED_PROOF";
  const isWaiting =
    order.paymentGateStatus === "WAITING_FULL_100" ||
    order.paymentGateStatus === "LOCKED_WAITING_DP" ||
    order.paymentGateStatus === "WAITING_FINAL_50";

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1F2937] flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#CFE0D8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <KaryaKitaLogo variant="light" iconSize={32} />
          </Link>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchOrder(true)}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-xs font-semibold text-[#4B5563] hover:text-[#0F4C3A] hover:bg-gray-100 transition-all flex items-center gap-1.5"
              title="Perbarui Status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              href="/"
              className="text-xs font-semibold text-[#4B5563] hover:text-[#0F4C3A]"
            >
              Beranda &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        {/* Order Header Card */}
        <div className="rounded-2xl bg-white border border-[#CFE0D8] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                Pelacakan Pesanan Resmi
              </span>
              <span className="text-xs font-mono font-bold text-[#0F4C3A]">
                #{order.orderCode}
              </span>
            </div>
            <h1
              className="text-xl sm:text-2xl font-extrabold text-[#1F2937]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {order.customerName}
            </h1>
            <p className="text-xs text-[#4B5563]">
              Layanan: <b>{unitInfo.name}</b> · Kontak: <b>{order.customerWhatsapp}</b>
            </p>
          </div>

          <div className="self-start sm:self-center">
            <PaymentGateBadge status={order.paymentGateStatus} size="md" />
          </div>
        </div>

        {/* Stepper Progres */}
        <PaymentProgressStepper
          scheme={order.scheme}
          status={order.paymentGateStatus}
          contractValueIdr={order.contractValueIdr}
          requiredAmountIdr={order.requiredAmountIdr}
        />

        {/* KONDISI 1: PAID_100_VERIFIED -> INSTANT FULFILLMENT CARD */}
        {isPaid && (
          <div className="rounded-2xl border-2 border-[#0F4C3A] bg-[#EEF5F2] p-6 sm:p-8 space-y-6 shadow-md animate-in fade-in duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-200 text-emerald-950 uppercase tracking-wider">
                  Layanan Resmi Terbuka
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#0F4C3A] mt-0.5">
                  Pembayaran Terverifikasi Sah! Akses Siap Digunakan
                </h3>
                <p className="text-xs text-[#4B5563]">
                  Diverifikasi oleh: <b>{order.verifiedById || "Novita Rani (CFO)"}</b> pada{" "}
                  {order.verifiedAt ? new Date(order.verifiedAt).toLocaleString("id-ID") : "-"}
                </p>
              </div>
            </div>

            {/* Kotak Pengiriman Layanan (Instant Fulfillment) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {/* Tombol Grup WhatsApp Peserta */}
              <a
                href={order.fulfillmentJson?.waGroupLink || "https://chat.whatsapp.com/KaryaKitaAIAcademyB1"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-white border border-[#CFE0D8] hover:border-[#0F4C3A] hover:shadow-xs transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#1F2937] group-hover:text-[#0F4C3A]">
                    Gabung Grup WhatsApp
                  </p>
                  <p className="text-[11px] text-[#6B7280]">Komunitas &amp; Info Live Batch 1</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
              </a>

              {/* Tombol Akses Zoom / Google Meet */}
              <a
                href={order.fulfillmentJson?.zoomLink || "https://meet.google.com/karyakita-ai-academy-batch1"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-white border border-[#CFE0D8] hover:border-[#0F4C3A] hover:shadow-xs transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors">
                  <Video className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#1F2937] group-hover:text-[#0F4C3A]">
                    Tautan Google Meet
                  </p>
                  <p className="text-[11px] text-[#6B7280]">Ruang Kelas Live Interaktif</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
              </a>

              {/* Tombol Unduh Prompt Pack & Materi */}
              <a
                href={order.fulfillmentJson?.promptPackUrl || "https://karyakita-ai.vercel.app/resources/karyakita-prompt-pack-v1.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-white border border-[#CFE0D8] hover:border-[#0F4C3A] hover:shadow-xs transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-[#B45309] flex items-center justify-center shrink-0 group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#1F2937] group-hover:text-[#0F4C3A]">
                    Template Prompt Pack AI
                  </p>
                  <p className="text-[11px] text-[#6B7280]">PDF Siap Pakai KaryaKita</p>
                </div>
                <Download className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
              </a>

              {/* Hubungi Tim Dukungan */}
              {buildWhatsAppUrl(unitInfo.name) ? (
                <a
                  href={buildWhatsAppUrl(unitInfo.name) || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-white border border-[#CFE0D8] hover:border-[#0F4C3A] hover:shadow-xs transition-all flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center shrink-0 group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#1F2937] group-hover:text-[#0F4C3A]">
                      Dukungan WhatsApp 24/7
                    </p>
                    <p className="text-[11px] text-[#6B7280]">Bantuan &amp; Pertanyaan Peserta</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
                </a>
              ) : (
                <Link
                  href="/order"
                  className="p-4 rounded-xl bg-white border border-[#CFE0D8] hover:border-[#0F4C3A] hover:shadow-xs transition-all flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center shrink-0 group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#1F2937] group-hover:text-[#0F4C3A]">
                      Layanan Tambahan &amp; Konsultasi
                    </p>
                    <p className="text-[11px] text-[#6B7280]">Ajukan proyek atau diskusi baru</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* KONDISI 2: DP_50_VERIFIED (B2B EKSEKUSI) */}
        {isDpVerified && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  DP 50% Terverifikasi · Proyek Resmi Masuk Tahap Eksekusi
                </h3>
                <p className="text-xs text-emerald-800">
                  Disahkan oleh: <b>{order.verifiedById || "Novita Rani (CFO)"}</b>
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-900 leading-relaxed pl-13">
              Tim spesialis KaryaKita di bawah pengawasan Hilwa Mufida (COO &amp; Head of Project Management) telah memulai proses produksi sesuai <em>Service Level Agreement</em> (SLA).
            </p>

            <div className="pl-13 pt-1 flex flex-wrap gap-2">
              {buildWhatsAppUrl(unitInfo.name) && (
                <a
                  href={buildWhatsAppUrl(unitInfo.name) || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0F4C3A] hover:bg-[#1A6B52] text-white shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Hubungi Project Manager (Hilwa Mufida)</span>
                </a>
              )}
              <Link
                href={`/pay/${order.portalToken}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-[#0F4C3A] text-[#0F4C3A] bg-white hover:bg-[#EEF5F2]"
              >
                <span>Buka Portal Pembayaran &amp; Invoice</span>
              </Link>
            </div>
          </div>
        )}

        {/* KONDISI 3: VERIFYING_PROOF */}
        {isVerifying && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-sky-950">
              Bukti Pembayaran Sedang Diverifikasi CFO
            </h3>
            <p className="text-xs text-sky-800 max-w-lg mx-auto">
              Novita (CFO) sedang memeriksa mutasi Bank Syariah Indonesia (BSI). Estimasi verifikasi &lt; 30 detik pada jam kerja. Begitu disahkan, kotak akses materi akan otomatis terbuka di halaman ini.
            </p>
            <button
              onClick={() => fetchOrder(true)}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F4C3A] text-white hover:bg-[#1A6B52] transition-all inline-flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Muat Ulang Status</span>
            </button>
          </div>
        )}

        {/* KONDISI 4: REJECTED_PROOF -> FORM UNGGAH ULANG */}
        {isRejected && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-red-300 bg-red-50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-red-900">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <h3 className="text-sm font-bold">Bukti Transfer Belum Dapat Disahkan</h3>
              </div>
              <p className="text-xs text-red-800 pl-7 leading-relaxed">
                Alasan Penolakan: <b>&quot;{order.rejectionReason || "Bukti tidak cocok / dana belum terdeteksi di mutasi"}&quot;</b>
              </p>
              <p className="text-[11px] text-red-700 pl-7">
                Silakan pastikan dana telah berhasil ditransfer dan unggah ulang bukti yang jelas di bawah.
              </p>
            </div>

            <BankTransferCard
              orderCode={order.orderCode}
              requiredAmountIdr={order.requiredAmountIdr}
            />

            <PaymentProofUploader
              orderCode={order.orderCode}
              expectedAmountIdr={order.requiredAmountIdr}
              onSuccess={() => fetchOrder(true)}
            />
          </div>
        )}

        {/* KONDISI 5: WAITING (BELUM BAYAR) */}
        {isWaiting && (
          <div className="space-y-6">
            <BankTransferCard
              orderCode={order.orderCode}
              requiredAmountIdr={order.requiredAmountIdr}
            />

            <PaymentProofUploader
              orderCode={order.orderCode}
              expectedAmountIdr={order.requiredAmountIdr}
              onSuccess={() => fetchOrder(true)}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function OrderStatusPage({
  params,
}: {
  params: Promise<{ orderCode: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3 text-sm text-[#4B5563]">
            <Loader2 className="w-8 h-8 animate-spin text-[#0F4C3A]" />
            <span>Memuat Status Pesanan...</span>
          </div>
        </div>
      }
    >
      <OrderStatusContent params={params} />
    </Suspense>
  );
}
