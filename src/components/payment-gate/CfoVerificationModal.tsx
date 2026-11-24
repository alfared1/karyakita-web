"use client";

import React, { useState } from "react";
import {
  X,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { PublicOrderDTO, formatRupiah } from "@/types/payment-gate";

interface CfoVerificationModalProps {
  order: PublicOrderDTO;
  isOpen: boolean;
  onClose: () => void;
  onVerified: (updatedOrder: PublicOrderDTO) => void;
  cfoSecretPin?: string;
}

export function CfoVerificationModal({
  order,
  isOpen,
  onClose,
  onVerified,
  cfoSecretPin,
}: CfoVerificationModalProps) {
  const [isCheckedMutasi, setIsCheckedMutasi] = useState(false);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAmountMismatch =
    order.proofAmountIdr && order.proofAmountIdr !== order.requiredAmountIdr;

  const handleApprove = async () => {
    if (!isCheckedMutasi) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.orderCode}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE",
          pin: cfoSecretPin,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal mengesahkan pembayaran.");
      }

      onVerified(json.order);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Kesalahan sistem");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setErrorMessage("Wajib mengisi alasan penolakan secara jelas.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.orderCode}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT",
          rejectionReason: rejectionReason.trim(),
          pin: cfoSecretPin,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal menolak bukti transfer.");
      }

      onVerified(json.order);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Kesalahan sistem");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-[#CFE0D8] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-[#EEF5F2] border-b border-[#CFE0D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0F4C3A]" />
            <div>
              <h3 className="text-base font-bold text-[#0F4C3A]">
                Modal Verifikasi Sah CFO (Novita / Alfatih)
              </h3>
              <p className="text-xs text-[#4B5563]">
                Tiket Order: <b className="font-mono text-[#1F2937]">{order.orderCode}</b>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#CFE0D8] overflow-y-auto p-6 gap-6">
          {/* Kolom Kiri: Pratinjau Bukti */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                Pratinjau Bukti Transfer
              </span>

              {order.proofUrl ? (
                order.proofUrl.startsWith("http") && !order.proofUrl.startsWith("data:") ? (
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 space-y-2 text-center">
                    <p className="text-xs font-semibold text-blue-900">
                      Tautan Eksternal / Google Drive:
                    </p>
                    <a
                      href={order.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all"
                    >
                      <span>Buka Bukti di Tab Baru</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 max-h-72 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={order.proofUrl}
                      alt="Bukti Transfer"
                      className="max-h-64 object-contain rounded"
                    />
                  </div>
                )
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-500">
                  Belum ada bukti transfer yang diunggah klien.
                </div>
              )}
            </div>

            {order.proofUrl && (
              <a
                href={order.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#0F4C3A] hover:underline flex items-center gap-1 self-start"
              >
                <span>Perbesar / Buka di tab baru</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Kolom Kanan: Rincian Finansial & Checklist */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">
              Pencocokan Nominal Finansial
            </span>

            <div className="space-y-2 bg-[#F8FAF9] p-3.5 rounded-xl border border-[#CFE0D8] text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Klien / Peserta:</span>
                <span className="font-bold text-gray-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">WhatsApp:</span>
                <span className="font-mono text-gray-900">{order.customerWhatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Unit Bisnis:</span>
                <span className="font-bold text-[#0F4C3A] uppercase">{order.unitCode}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-gray-200">
                <span className="text-gray-500">Nominal Seharusnya:</span>
                <span className="font-bold text-base text-[#0F4C3A] tabular-nums">
                  {formatRupiah(order.requiredAmountIdr)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nominal Dilaporkan:</span>
                <span
                  className={`font-bold text-base tabular-nums ${
                    isAmountMismatch ? "text-red-600" : "text-emerald-700"
                  }`}
                >
                  {order.proofAmountIdr ? formatRupiah(order.proofAmountIdr) : "-"}
                </span>
              </div>

              {isAmountMismatch && (
                <div className="p-2 rounded-lg bg-red-100 text-red-800 text-[11px] font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Peringatan: Nominal di bukti berbeda dari tagihan resmi!</span>
                </div>
              )}
            </div>

            {/* Checklist Konfirmasi Mutasi Rekening */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-300 bg-emerald-50/70 cursor-pointer">
              <input
                type="checkbox"
                checked={isCheckedMutasi}
                onChange={(e) => setIsCheckedMutasi(e.target.checked)}
                className="mt-0.5 rounded text-[#0F4C3A] focus:ring-[#0F4C3A] w-4 h-4"
              />
              <span className="text-xs font-semibold text-emerald-950 leading-relaxed">
                Saya telah mengecek mutasi Bank Syariah Indonesia (BSI) KaryaKita dan memastikan dana telah masuk secara sah ke rekening.
              </span>
            </label>

            {/* Kotak Alasan Penolakan */}
            {showRejectBox && (
              <div className="space-y-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <label className="block text-xs font-bold text-red-900">
                  Alasan Penolakan Bukti (Wajib Diisi):
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Contoh: Bukti transfer terpotong / nominal tidak sesuai / dana belum masuk di mutasi m-banking."
                  className="w-full px-3 py-2 rounded-lg border border-red-300 text-xs focus:outline-none focus:ring-1 focus:ring-red-600 bg-white"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white w-full transition-all"
                >
                  Kirim Penolakan ke Klien &rarr;
                </button>
              </div>
            )}

            {errorMessage && (
              <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* Footer Aksi Modal */}
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#CFE0D8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#B45309]" />
            <span>Aksi ini bersifat permanen &amp; terekam di Audit Log.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowRejectBox(!showRejectBox)}
              className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold border border-red-300 text-red-700 hover:bg-red-50 transition-all flex-1 sm:flex-none"
            >
              Tolak Bukti
            </button>

            <button
              type="button"
              onClick={handleApprove}
              disabled={!isCheckedMutasi || isProcessing}
              className="min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0F4C3A] hover:bg-[#1A6B52] disabled:opacity-40 text-white shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengesahkan...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Sahkan Pembayaran &amp; Buka Layanan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
