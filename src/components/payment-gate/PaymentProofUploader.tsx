"use client";

import React, { useState, useRef } from "react";
import { Upload, Link as LinkIcon, FileCheck, AlertCircle, Loader2 } from "lucide-react";

interface PaymentProofUploaderProps {
  orderCode: string;
  expectedAmountIdr: number;
  onSuccess: (data: { proofUrl: string; proofAmountIdr: number }) => void;
  className?: string;
}

export function PaymentProofUploader({
  orderCode,
  expectedAmountIdr,
  onSuccess,
  className = "",
}: PaymentProofUploaderProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "drive">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [driveUrl, setDriveUrl] = useState("");
  const [amountInput, setAmountInput] = useState(expectedAmountIdr.toString());
  const [senderNotes, setSenderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi Ukuran <= 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran file bukti maksimal 5 MB.");
      return;
    }

    // Validasi Tipe File (JPEG, PNG, WEBP, PDF)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Format file harus berupa JPG, PNG, WEBP, atau PDF.");
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null); // PDF icon
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numericAmount = parseInt(amountInput.replace(/\D/g, ""), 10);
    if (!numericAmount || numericAmount <= 0) {
      setErrorMessage("Mohon masukkan nominal yang ditransfer.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalProofUrl = "";

      if (activeTab === "drive") {
        if (!driveUrl.trim() || !driveUrl.includes("http")) {
          setErrorMessage("Mohon masukkan tautan Google Drive / link bukti yang valid.");
          setIsSubmitting(false);
          return;
        }
        finalProofUrl = driveUrl.trim();
      } else {
        if (!selectedFile) {
          setErrorMessage("Silakan pilih file bukti transfer terlebih dahulu.");
          setIsSubmitting(false);
          return;
        }

        const file = selectedFile;

        if (file.type === "application/pdf" && file.size > 3 * 1024 * 1024) {
          setErrorMessage(
            "File PDF terlalu besar (> 3 MB) untuk unggahan langsung. Silakan gunakan tab Tautan Google Drive."
          );
          setIsSubmitting(false);
          return;
        }

        if (file.type.startsWith("image/") && file.size > 900 * 1024) {
          // Kompres gambar di sisi klien agar ukuran Base64 tetap aman di bawah batas payload 4,5 MB Vercel
          finalProofUrl = await new Promise<string>((resolve, reject) => {
            const img = new Image();
            const objUrl = URL.createObjectURL(file);
            img.onload = () => {
              URL.revokeObjectURL(objUrl);
              const maxDim = 1600;
              let { width, height } = img;
              if (width > maxDim || height > maxDim) {
                const scale = Math.min(maxDim / width, maxDim / height);
                width = Math.round(width * scale);
                height = Math.round(height * scale);
              }
              const canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              if (!ctx) {
                reject(new Error("Gagal memproses gambar bukti transfer."));
                return;
              }
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.82));
            };
            img.onerror = () => {
              URL.revokeObjectURL(objUrl);
              reject(new Error("Gagal membaca file gambar."));
            };
            img.src = objUrl;
          });
        } else {
          // Konversi file ke Base64 Data URL (Zero-Cost, hemat storage & aman di Vercel serverless)
          const reader = new FileReader();
          finalProofUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }
      }

      // Kirim ke API endpoint
      const res = await fetch(`/api/public/orders/${orderCode}/proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proofUrl: finalProofUrl,
          proofAmountIdr: numericAmount,
          senderNotes: senderNotes.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal mengunggah bukti transfer.");
      }

      onSuccess({
        proofUrl: finalProofUrl,
        proofAmountIdr: numericAmount,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengunggah bukti.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`rounded-2xl bg-white border border-[#CFE0D8] shadow-xs p-5 sm:p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1F2937]">
          Unggah Bukti Transfer Bank
        </h3>
        <p className="text-xs text-[#4B5563]">
          Setelah transfer berhasil, lampirkan bukti pembayaran agar Novita (CFO) dapat segera memverifikasi pesanan Anda.
        </p>
      </div>

      {/* Tabs Pilihan: Upload File vs Google Drive */}
      <div className="flex border-b border-[#CFE0D8] mb-5">
        <button
          type="button"
          onClick={() => {
            setActiveTab("upload");
            setErrorMessage(null);
          }}
          className={`py-2 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "upload"
              ? "border-[#0F4C3A] text-[#0F4C3A]"
              : "border-transparent text-[#6B7280] hover:text-[#1F2937]"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Unggah Gambar / PDF (Maks 5 MB)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("drive");
            setErrorMessage(null);
          }}
          className={`py-2 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "drive"
              ? "border-[#0F4C3A] text-[#0F4C3A]"
              : "border-transparent text-[#6B7280] hover:text-[#1F2937]"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Tautan Google Drive</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === "upload" ? (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#CFE0D8] hover:border-[#0F4C3A] bg-[#F8FAF9] rounded-xl p-6 text-center cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#EEF5F2] text-[#0F4C3A] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#1F2937]">
                  Ketuk untuk memilih foto bukti transfer atau PDF
                </p>
                <p className="text-[11px] text-[#6B7280]">
                  JPG, PNG, WEBP, atau PDF (Ukuran maksimal 5 MB)
                </p>
              </div>
            ) : (
              <div className="border border-[#CFE0D8] rounded-xl p-3 bg-[#F8FAF9] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Bukti Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <FileCheck className="w-6 h-6" />
                    </div>
                  )}
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#1F2937] truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-[#6B7280]">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-1"
                >
                  Ganti
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Tautan Google Drive / Cloud Bukti Transfer
            </label>
            <input
              type="url"
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFE0D8] text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
            />
            <p className="text-[11px] text-[#6B7280] mt-1">
              Pastikan akses tautan diatur ke <b>&quot;Siapa saja yang memiliki tautan dapat melihat&quot;</b>.
            </p>
          </div>
        )}

        {/* Input Nominal Ditransfer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Nominal yang Ditransfer (Rp)
            </label>
            <input
              type="text"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="Contoh: 75000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFE0D8] text-xs font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Catatan Pengirim (Nama Pemilik Rekening)
            </label>
            <input
              type="text"
              value={senderNotes}
              onChange={(e) => setSenderNotes(e.target.value)}
              placeholder="Contoh: Transfer via m-BSI a.n. Fulan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFE0D8] text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#0F4C3A] hover:bg-[#1A6B52] disabled:opacity-50 text-white shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sedang Mengirim Bukti...</span>
            </>
          ) : (
            <span>Kirim Bukti untuk Verifikasi CFO &rarr;</span>
          )}
        </button>
      </form>
    </div>
  );
}
