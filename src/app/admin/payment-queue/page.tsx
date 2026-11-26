"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  RefreshCw,
  Loader2,
  KeyRound,
  FileSearch,
} from "lucide-react";
import { KaryaKitaLogo } from "@/components/brand/KaryaKitaLogo";
import {
  PaymentGateBadge,
  CfoVerificationModal,
  GraduationRuleMeter,
} from "@/components/payment-gate";
import { PublicOrderDTO, formatRupiah } from "@/types/payment-gate";

export default function AdminPaymentQueuePage() {
  const [pin, setPin] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("karyakita_cfo_pin") || "";
    }
    return "";
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [isCheckingPin, setIsCheckingPin] = useState<boolean>(false);

  const [orders, setOrders] = useState<PublicOrderDTO[]>([]);
  const [currentCash, setCurrentCash] = useState(0);
  const [targetCash, setTargetCash] = useState(3500000);
  const [counts, setCounts] = useState({
    all: 0,
    verifying: 0,
    waiting: 0,
    verified: 0,
    rejected: 0,
  });

  const [activeFilter, setActiveFilter] = useState<
    "all" | "VERIFYING_PROOF" | "waiting" | "verified" | "REJECTED_PROOF"
  >("VERIFYING_PROOF");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PublicOrderDTO | null>(null);
  const [isSyncingHub, setIsSyncingHub] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleSyncAllHub = async () => {
    setIsSyncingHub(true);
    setSyncFeedback(null);
    try {
      const res = await fetch("/api/admin/hub-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal sinkronisasi");
      setSyncFeedback(json.message || "Semua data berhasil disinkronkan ke KaryaKita Hub OS!");
      setTimeout(() => setSyncFeedback(null), 5000);
    } catch (err: unknown) {
      setSyncFeedback(err instanceof Error ? err.message : "Gagal sinkronisasi ke Hub");
      setTimeout(() => setSyncFeedback(null), 5000);
    } finally {
      setIsSyncingHub(false);
    }
  };

  const loadOrdersWithPin = async (secretPin: string) => {
    const res = await fetch("/api/admin/orders", {
      headers: { "x-cfo-pin": secretPin },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "PIN Otorisasi CFO tidak valid.");
    }
    setOrders(json.orders || []);
    setCurrentCash(json.currentCashIdr || 0);
    setTargetCash(json.targetCashIdr || 3500000);
    if (json.counts) setCounts(json.counts);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    setIsCheckingPin(true);
    try {
      await loadOrdersWithPin(pin.trim());
      sessionStorage.setItem("karyakita_cfo_pin", pin.trim());
      setIsAuthenticated(true);
    } catch (err: unknown) {
      setIsAuthenticated(false);
      setPinError(err instanceof Error ? err.message : "PIN Otorisasi CFO tidak valid.");
    } finally {
      setIsCheckingPin(false);
    }
  };

  const fetchQueue = async () => {
    if (!pin) return;
    setIsLoading(true);
    try {
      await loadOrdersWithPin(pin);
    } catch (err) {
      console.error("Gagal mengambil antrean:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const savedPin = typeof window !== "undefined" ? sessionStorage.getItem("karyakita_cfo_pin") : null;
    if (savedPin) {
      fetch("/api/admin/orders", {
        headers: { "x-cfo-pin": savedPin },
      })
        .then(async (res) => {
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Unauthorized");
          return json;
        })
        .then((json) => {
          if (isMounted) {
            setPin(savedPin);
            setIsAuthenticated(true);
            setOrders(json.orders || []);
            setCurrentCash(json.currentCashIdr || 0);
            setTargetCash(json.targetCashIdr || 3500000);
            if (json.counts) setCounts(json.counts);
          }
        })
        .catch(() => {
          if (isMounted) {
            sessionStorage.removeItem("karyakita_cfo_pin");
            setIsAuthenticated(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#CFE0D8] p-6 sm:p-8 shadow-xl space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF5F2] text-[#0F4C3A] flex items-center justify-center mx-auto border border-[#CFE0D8]">
            <KeyRound className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1F2937]">
              Otorisasi Keuangan CFO
            </h2>
            <p className="text-xs text-[#6B7280] mt-1">
              Panel verifikasi cepat mutasi Bank Syariah KaryaKita (Novita Rani &amp; Alfatih).
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Masukkan 6 Digit PIN CFO"
                className="w-full text-center px-4 py-3 rounded-xl border border-[#CFE0D8] text-base font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
              />
            </div>

            {pinError && <p className="text-xs text-red-600 font-semibold">{pinError}</p>}

            <button
              type="submit"
              disabled={isCheckingPin}
              className="w-full min-h-[44px] py-2.5 rounded-xl text-xs font-bold bg-[#0F4C3A] hover:bg-[#1A6B52] disabled:opacity-50 text-white shadow-md transition-all"
            >
              {isCheckingPin ? "Memverifikasi PIN..." : "Masuk ke Antrean Verifikasi →"}
            </button>
          </form>

          <Link href="/" className="text-xs text-[#4B5563] hover:underline block">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "VERIFYING_PROOF") return o.paymentGateStatus === "VERIFYING_PROOF";
    if (activeFilter === "REJECTED_PROOF") return o.paymentGateStatus === "REJECTED_PROOF";
    if (activeFilter === "waiting")
      return (
        o.paymentGateStatus === "WAITING_FULL_100" ||
        o.paymentGateStatus === "LOCKED_WAITING_DP" ||
        o.paymentGateStatus === "WAITING_FINAL_50"
      );
    if (activeFilter === "verified")
      return (
        o.paymentGateStatus === "DP_50_VERIFIED" || o.paymentGateStatus === "PAID_100_VERIFIED"
      );
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1F2937] flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#CFE0D8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <KaryaKitaLogo variant="light" iconSize={32} />
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#0F4C3A] text-white">
              CFO DESK
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleSyncAllHub}
              disabled={isSyncingHub}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#EEF5F2] text-[#0F4C3A] hover:bg-[#D8EAE2] transition-all flex items-center gap-1.5 border border-[#CFE0D8]"
              title="Sinkronkan seluruh data proyek dan kas ke KaryaKita Hub OS"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingHub ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">
                {isSyncingHub ? "Menyinkronkan..." : "Sinkron ke Hub OS"}
              </span>
            </button>

            <button
              onClick={fetchQueue}
              disabled={isLoading}
              className="p-2 rounded-xl text-xs font-semibold text-[#4B5563] hover:text-[#0F4C3A] hover:bg-gray-100 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Segarkan Data</span>
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem("karyakita_cfo_pin");
                setIsAuthenticated(false);
              }}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {syncFeedback && (
          <div className="p-3.5 rounded-xl bg-[#EEF5F2] border border-[#A3C7B8] text-xs text-[#0F4C3A] font-semibold flex items-center justify-between shadow-xs transition-all">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0F4C3A]" />
              <span>{syncFeedback}</span>
            </div>
            <button
              onClick={() => setSyncFeedback(null)}
              className="text-[#0F4C3A] hover:underline text-[11px]"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Graduation Rule Meter Banner */}
        <GraduationRuleMeter currentCashIdr={currentCash} targetCashIdr={targetCash} />

        {/* Section Header & Status Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1
              className="text-xl sm:text-2xl font-extrabold text-[#1F2937]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Antrean Verifikasi Pembayaran (CFO Queue)
            </h1>
            <p className="text-xs text-[#4B5563]">
              Verifikasi transfer masuk &lt; 30 detik untuk langsung membuka akses kelas atau gerbang eksekusi B2B.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveFilter("VERIFYING_PROOF")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === "VERIFYING_PROOF"
                  ? "bg-[#075985] text-white shadow-xs"
                  : "bg-white text-[#075985] border border-sky-300 hover:bg-sky-50"
              }`}
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Perlu Verifikasi ({counts.verifying})</span>
            </button>

            <button
              onClick={() => setActiveFilter("waiting")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === "waiting"
                  ? "bg-[#B45309] text-white"
                  : "bg-white text-[#6B7280] border border-[#CFE0D8] hover:bg-gray-50"
              }`}
            >
              Menunggu Bayar ({counts.waiting})
            </button>

            <button
              onClick={() => setActiveFilter("verified")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === "verified"
                  ? "bg-[#0F4C3A] text-white"
                  : "bg-white text-[#6B7280] border border-[#CFE0D8] hover:bg-gray-50"
              }`}
            >
              Sah / Selesai ({counts.verified})
            </button>

            <button
              onClick={() => setActiveFilter("REJECTED_PROOF")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === "REJECTED_PROOF"
                  ? "bg-red-700 text-white"
                  : "bg-white text-[#6B7280] border border-[#CFE0D8] hover:bg-gray-50"
              }`}
            >
              Ditolak ({counts.rejected})
            </button>

            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-[#6B7280] border border-[#CFE0D8] hover:bg-gray-50"
              }`}
            >
              Semua ({counts.all})
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-[#CFE0D8] shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#0F4C3A] mx-auto" />
              <p className="text-xs text-[#6B7280]">Memuat antrean...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-[#1F2937]">Tidak Ada Pesanan pada Kategori Ini</h3>
              <p className="text-xs text-[#6B7280]">
                Semua verifikasi telah dituntaskan atau belum ada data masuk.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#EEF5F2] text-[#0F4C3A] font-bold border-b border-[#CFE0D8]">
                  <tr>
                    <th className="py-3 px-4">Order Code</th>
                    <th className="py-3 px-4">Klien / Peserta</th>
                    <th className="py-3 px-4">Layanan</th>
                    <th className="py-3 px-4 text-right">Nominal Tagihan</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Waktu Masuk</th>
                    <th className="py-3 px-4 text-center">Aksi CFO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => {
                    const isNeedVerify = order.paymentGateStatus === "VERIFYING_PROOF";
                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-[#F8FAF9] transition-colors ${
                          isNeedVerify ? "bg-sky-50/40" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          {order.orderCode}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-gray-900">{order.customerName}</p>
                          <p className="text-[11px] text-gray-500 font-mono">
                            {order.customerWhatsapp}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold uppercase tracking-tight text-[#0F4C3A]">
                            {order.unitCode}
                          </span>
                          <p className="text-[11px] text-gray-400">
                            {order.scheme === "PUBLIC_FULL_100" ? "Tiket 100%" : "B2B 50/50"}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums text-gray-900">
                          {formatRupiah(order.requiredAmountIdr)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <PaymentGateBadge status={order.paymentGateStatus} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-center text-[11px] text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                              isNeedVerify
                                ? "bg-[#0F4C3A] hover:bg-[#1A6B52] text-white"
                                : "bg-white border border-[#CFE0D8] text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {isNeedVerify ? "Verifikasi Sekarang" : "Lihat Detail"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Verifikasi CFO */}
        {selectedOrder && (
          <CfoVerificationModal
            order={selectedOrder}
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            cfoSecretPin={pin}
            onVerified={(updatedOrder) => {
              setOrders((prev) =>
                prev.map((o) => (o.orderCode === updatedOrder.orderCode ? { ...o, ...updatedOrder } : o))
              );
              fetchQueue();
            }}
          />
        )}
      </main>
    </div>
  );
}
