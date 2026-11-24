"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import {
  Printer,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { KaryaKitaLogo } from "@/components/brand/KaryaKitaLogo";
import {
  PaymentGateBadge,
  PaymentGateLockBanner,
  PaymentProgressStepper,
  BankTransferCard,
  PaymentProofUploader,
} from "@/components/payment-gate";
import { PublicOrderDTO, BUSINESS_UNITS, formatRupiah } from "@/types/payment-gate";

function ClientPaymentPortalContent({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  const [order, setOrder] = useState<PublicOrderDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/public/orders/token?token=${token}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Gagal memuat portal pembayaran.");
      }

      setOrder(json);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (token) {
      fetch(`/api/public/orders/token?token=${token}`)
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
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-sm text-[#4B5563]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0F4C3A]" />
          <span>Memuat Portal Pembayaran Klien...</span>
        </div>
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-6 text-center space-y-4 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-[#1F2937]">Portal Tidak Ditemukan</h2>
          <p className="text-xs text-[#4B5563]">
            {errorMessage || "Tautan portal pembayaran ini tidak valid atau telah kedaluwarsa."}
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

  const unitInfo = BUSINESS_UNITS[order.unitCode] || BUSINESS_UNITS.webtech;
  const isWaitingProof =
    order.paymentGateStatus === "LOCKED_WAITING_DP" ||
    order.paymentGateStatus === "WAITING_FINAL_50" ||
    order.paymentGateStatus === "REJECTED_PROOF";

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1F2937] flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#CFE0D8] print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <KaryaKitaLogo variant="light" iconSize={32} />
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#CFE0D8] bg-white hover:bg-[#EEF5F2] text-[#0F4C3A] flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Invoice</span>
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
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        {/* Top Info Banner */}
        <div className="rounded-2xl bg-white border border-[#CFE0D8] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                Portal Pembayaran Klien
              </span>
              <span className="text-xs font-mono font-bold text-[#0F4C3A]">
                #{order.orderCode}
              </span>
            </div>
            <h1
              className="text-xl sm:text-2xl font-extrabold text-[#1F2937]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {unitInfo.name} · {order.customerName}
            </h1>
            <p className="text-xs text-[#4B5563]">
              Instansi: <b>{order.organization || "Pribadi / Klien Langsung"}</b> · Akad: <b>Ijarah bi al-&apos;Amal</b>
            </p>
          </div>

          <div className="self-start sm:self-center">
            <PaymentGateBadge status={order.paymentGateStatus} size="md" />
          </div>
        </div>

        {/* Lock Banner Jika Masih Terkunci */}
        <PaymentGateLockBanner
          status={order.paymentGateStatus}
          requiredAmountIdr={order.requiredAmountIdr}
        />

        {/* Alasan Penolakan Jika Bukti Ditolak */}
        {order.paymentGateStatus === "REJECTED_PROOF" && order.rejectionReason && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-xs text-red-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Bukti Transfer Ditolak oleh CFO:</span>
            </p>
            <p className="pl-5.5 leading-relaxed">&quot;{order.rejectionReason}&quot;</p>
            <p className="pl-5.5 text-[11px] text-red-700">
              Silakan unggah ulang bukti transfer yang benar pada form di bawah.
            </p>
          </div>
        )}

        {/* Stepper Progres Termin B2B */}
        <PaymentProgressStepper
          scheme="B2B_SPLIT_50_50"
          status={order.paymentGateStatus}
          contractValueIdr={order.contractValueIdr}
          requiredAmountIdr={order.requiredAmountIdr}
        />

        {/* Kondisi 1: Menunggu Bukti Transfer / Ditolak */}
        {isWaitingProof && (
          <div className="space-y-6">
            <BankTransferCard
              orderCode={order.orderCode}
              requiredAmountIdr={order.requiredAmountIdr}
              title={`Instruksi Transfer ${
                order.paymentGateStatus === "WAITING_FINAL_50"
                  ? "Pelunasan 50%"
                  : "DP 50% Pembuka Eksekusi"
              }`}
            />

            <PaymentProofUploader
              orderCode={order.orderCode}
              expectedAmountIdr={order.requiredAmountIdr}
              onSuccess={fetchOrder}
            />
          </div>
        )}

        {/* Kondisi 2: Bukti Sedang Diverifikasi */}
        {order.paymentGateStatus === "VERIFYING_PROOF" && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-sky-950">
              Bukti Transfer Sedang Diverifikasi CFO
            </h3>
            <p className="text-xs text-sky-800 max-w-lg mx-auto">
              Novita (CFO) atau Alfatih (CEO) sedang mencocokkan mutasi rekening Bank Syariah Indonesia (BSI). Proses verifikasi rata-rata berlangsung &lt; 30 detik pada jam kerja.
            </p>
            <button
              onClick={fetchOrder}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F4C3A] text-white hover:bg-[#1A6B52] transition-all inline-flex items-center gap-1.5"
            >
              Muat Ulang Status
            </button>
          </div>
        )}

        {/* Kondisi 3: DP 50% Terverifikasi (Siap Eksekusi) */}
        {order.paymentGateStatus === "DP_50_VERIFIED" && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  DP 50% Sah Terverifikasi · Proyek Masuk Tahap Eksekusi
                </h3>
                <p className="text-xs text-emerald-800">
                  Disahkan oleh: <b>{order.verifiedById || "Novita Rani (CFO)"}</b> pada{" "}
                  {order.verifiedAt ? new Date(order.verifiedAt).toLocaleString("id-ID") : "-"}
                </p>
              </div>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed pl-13">
              Gerbang pengerjaan di sistem internal KaryaKita Hub telah resmi dibuka. Tim operasional di bawah kendali Hilwa Mufida (COO) saat ini sedang mengeksekusi proyek sesuai jadwal kesepakatan.
            </p>
          </div>
        )}

        {/* Kondisi 4: Lunas 100% Terverifikasi (Instant Fulfillment) */}
        {order.paymentGateStatus === "PAID_100_VERIFIED" && (
          <div className="rounded-2xl border border-[#0F4C3A] bg-[#EEF5F2] p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F4C3A]">
                  Pelunasan 100% Sah · Serah Terima Master Selesai
                </h3>
                <p className="text-xs text-[#4B5563]">
                  Hak cipta dan seluruh aset deliverables proyek telah diserahkan penuh.
                </p>
              </div>
            </div>

            {order.fulfillmentJson?.projectFilesUrl && (
              <div className="p-4 rounded-xl bg-white border border-[#CFE0D8] flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-[#1F2937]">
                  Aset Master &amp; Dokumentasi Proyek:
                </span>
                <a
                  href={order.fulfillmentJson.projectFilesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F4C3A] hover:bg-[#1A6B52] text-white flex items-center gap-1.5"
                >
                  <span>Unduh File Master</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* PRINT-FRIENDLY INVOICE SECTION (Tampil Saat Di-Print) */}
        <div className="hidden print:block bg-white p-8 rounded-xl border border-gray-300 space-y-6">
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0F4C3A]">INVOICE KARYAKITA</h2>
              <p className="text-xs text-gray-500">PT KaryaKita Solusi Digital</p>
              <p className="text-xs text-gray-500">STMIK Tazkia, Sentul City, Bogor</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-mono font-bold text-gray-900">#{order.orderCode}</p>
              <p className="text-gray-500">Tanggal: {new Date(order.createdAt).toLocaleDateString("id-ID")}</p>
              <p className="text-gray-500">Status: {order.paymentGateStatus}</p>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <p className="font-bold">Ditujukan Kepada:</p>
            <p className="text-sm font-semibold">{order.customerName}</p>
            <p>{order.organization || "-"}</p>
            <p>{order.customerWhatsapp} | {order.customerEmail}</p>
          </div>

          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="py-2 px-3">Layanan / Unit</th>
                <th className="py-2 px-3">Deskripsi</th>
                <th className="py-2 px-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-3 font-semibold">{unitInfo.name}</td>
                <td className="py-3 px-3">{order.notes || "Layanan Proyek B2B"}</td>
                <td className="py-3 px-3 text-right font-mono font-bold">
                  {formatRupiah(order.contractValueIdr)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="py-3 px-3 text-right font-bold">Total Kontrak:</td>
                <td className="py-3 px-3 text-right font-mono font-bold">
                  {formatRupiah(order.contractValueIdr)}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="text-[11px] text-gray-500 border-t pt-4">
            <p>Terima kasih atas kepercayaan Anda bermitra dengan KaryaKita AI &amp; Venture Studio.</p>
            <p>Pembayaran berlandaskan Akad Ijarah bi al-&apos;Amal (Bebas Riba &amp; Zero Gharar).</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ClientPaymentPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3 text-sm text-[#4B5563]">
            <Loader2 className="w-8 h-8 animate-spin text-[#0F4C3A]" />
            <span>Memuat Portal Pembayaran Klien...</span>
          </div>
        </div>
      }
    >
      <ClientPaymentPortalContent params={params} />
    </Suspense>
  );
}
