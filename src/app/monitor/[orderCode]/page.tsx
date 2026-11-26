"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Send,
  AlertCircle,
  FileCheck2,
  Sparkles,
  Layers,
  HelpCircle,
  PhoneCall,
  UserCheck,
  Calendar,
  Lock,
} from "lucide-react";
import { KaryaKitaLogo } from "@/components/brand/KaryaKitaLogo";
import { formatRupiah } from "@/types/payment-gate";

interface MonitorTask {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "REVIEW";
  hoursEstimate?: number;
  dueDate?: string | null;
  dodChecklist?: Array<{ label: string; checked: boolean }>;
  workProofUrl?: string | null;
  assigneeName?: string;
}

interface MonitorData {
  orderCode: string;
  portalToken: string;
  scheme: string;
  unitCode: string;
  unitName: string;
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string;
  organization?: string;
  contractValueIdr: number;
  requiredAmountIdr: number;
  paymentGateStatus: string;
  proofUrl?: string | null;
  verifiedById?: string | null;
  verifiedAt?: string | null;
  slaDeadline?: string | null;
  fulfillmentJson?: {
    projectFilesUrl?: string;
    zoomLink?: string;
    waGroupLink?: string;
    promptPackUrl?: string;
    message?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  progressPercentage: number;
  pic: {
    id: string;
    name: string;
    roleLabel: string;
    email: string;
    avatar: string;
    capacityStatus: string;
  };
  tasks: MonitorTask[];
  revisions: {
    quota: number;
    used: number;
    remaining: number;
    items: Array<{
      id: string;
      note: string;
      submittedAt: number;
      triageStatus: string;
    }>;
  };
  auditTrail: Array<{
    id: string;
    actorName: string;
    action: string;
    note?: string;
    createdAt: string;
  }>;
}

function ProjectMonitoringContent({
  params,
}: {
  params: Promise<{ orderCode: string }>;
}) {
  const { orderCode } = use(params);

  const [data, setData] = useState<MonitorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form revisi
  const [revisionNote, setRevisionNote] = useState("");
  const [isSubmittingRev, setIsSubmittingRev] = useState(false);
  const [revSuccessMsg, setRevSuccessMsg] = useState<string | null>(null);
  const [revErrorMsg, setRevErrorMsg] = useState<string | null>(null);

  const fetchData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/public/orders/${orderCode}/monitor`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal memuat data monitoring");
      }
      setData(json);
      setLastRefreshedAt(new Date());
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Kesalahan koneksi ke server");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh data monitoring setiap 30 detik
    const timer = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(timer);
  }, [orderCode]);

  const handleSendRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNote.trim() || revisionNote.trim().length < 5) {
      setRevErrorMsg("Tuliskan masukan atau revisi Anda minimal 5 karakter.");
      return;
    }

    setIsSubmittingRev(true);
    setRevErrorMsg(null);
    setRevSuccessMsg(null);

    try {
      const res = await fetch(`/api/public/orders/${orderCode}/revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: revisionNote.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengirimkan catatan revisi");

      setRevSuccessMsg("Catatan masukan Anda berhasil dikirim ke tim studio KaryaKita Hub!");
      setRevisionNote("");
      // Segarkan data monitoring
      fetchData();
    } catch (err: unknown) {
      setRevErrorMsg(err instanceof Error ? err.message : "Gagal mengirim masukan");
    } finally {
      setIsSubmittingRev(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF5F2] border border-[#CFE0D8] text-[#0F4C3A] flex items-center justify-center animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-gray-900">
            Menghubungkan ke Studio KaryaKita Hub...
          </h3>
          <p className="text-xs text-gray-500 max-w-sm">
            Memuat progres live, tahapan pengerjaan, dan status gerbang pembayaran syariah.
          </p>
        </div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-gray-600">
            {errorMsg || "Tidak dapat memuat detail pengerjaan untuk kode pesanan ini."}
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => fetchData(true)}
              className="w-full py-2.5 rounded-xl bg-[#0F4C3A] text-white text-xs font-bold hover:bg-[#1A6B52] transition"
            >
              Coba Muat Ulang
            </button>
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-gray-800 underline block pt-1"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isDpVerified =
    data.paymentGateStatus === "DP_50_VERIFIED" ||
    data.paymentGateStatus === "PAID_100_VERIFIED" ||
    data.paymentGateStatus === "WAITING_FINAL_50";
  const isPaid100 = data.paymentGateStatus === "PAID_100_VERIFIED";

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1F2937] flex flex-col">
      {/* Top Sticky Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#CFE0D8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <KaryaKitaLogo variant="light" iconSize={30} />
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#0F4C3A] text-white">
              LIVE MONITORING PORTAL
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => fetchData(true)}
              disabled={isRefreshing}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#EEF5F2] text-[#0F4C3A] hover:bg-[#D8EAE2] transition-all flex items-center gap-1.5 border border-[#CFE0D8]"
              title="Perbarui progres pengerjaan secara langsung"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">
                {isRefreshing ? "Menyinkronkan..." : "Perbarui Progres"}
              </span>
            </button>

            <Link
              href={`/status/${data.orderCode}`}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-300 hover:bg-gray-100 transition-all flex items-center gap-1.5 text-gray-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Status Pembayaran</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Project Header Banner */}
        <section className="bg-white rounded-2xl border border-[#CFE0D8] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#0F4C3A] bg-[#EEF5F2] px-2.5 py-0.5 rounded-md border border-[#CFE0D8]">
                  {data.orderCode}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {data.unitName}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isPaid100
                      ? "bg-emerald-100 text-emerald-800"
                      : isDpVerified
                      ? "bg-sky-100 text-sky-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {isPaid100
                    ? "Lunas 100% (Handoff Ready)"
                    : isDpVerified
                    ? "DP 50% Disahkan (Pengerjaan Aktif)"
                    : "Menunggu Verifikasi DP"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Pengerjaan {data.unitName} untuk {data.customerName}
                {data.organization ? ` (${data.organization})` : ""}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Terhubung langsung ke Studio OS KaryaKita Hub. Terakhir diperbarui:{" "}
                <span className="font-medium text-gray-700">
                  {lastRefreshedAt.toLocaleTimeString("id-ID")} WIB
                </span>
              </p>
            </div>

            {/* Overall Progress Badge */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 flex-shrink-0 bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-gray-100">
              <span className="text-xs text-gray-500">Estimasi Progres</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#0F4C3A] font-mono">
                  {data.progressPercentage}%
                </span>
                <span className="text-xs font-bold text-gray-600">Selesai</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 border border-gray-200">
              <div
                className="bg-gradient-to-r from-[#0F4C3A] via-[#166534] to-[#059669] h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(8, data.progressPercentage)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span>0% Kickoff</span>
              <span>50% Produksi Utama</span>
              <span>100% Final Handoff</span>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-[#F8FAF9] rounded-xl border border-[#E5EBE8] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#0F4C3A] flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">PIC Co-Founder</span>
                <strong className="text-gray-900 block font-semibold">{data.pic.name}</strong>
                <span className="text-[10px] text-emerald-700">{data.pic.roleLabel}</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAF9] rounded-xl border border-[#E5EBE8] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">Tenggat Target SLA</span>
                <strong className="text-gray-900 block font-semibold">
                  {data.slaDeadline || "Sesuai Jadwal Sprint (14-30 Hari)"}
                </strong>
                <span className="text-[10px] text-gray-500">Standar Garansi Tepat Waktu</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAF9] rounded-xl border border-[#E5EBE8] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">Sisa Kuota Revisi</span>
                <strong className="text-gray-900 block font-semibold font-mono">
                  {data.revisions.remaining} dari {data.revisions.quota} Kali
                </strong>
                <span className="text-[10px] text-gray-500">Termasuk dalam Kontrak</span>
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables Banner (If Master Handoff Ready) */}
        {data.fulfillmentJson && (
          <section className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-300 p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <FileCheck2 className="w-5 h-5 text-emerald-700" />
              <span>Berkas Master Handoff & Akses Layanan Resmi</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {data.fulfillmentJson.message ||
                "Seluruh pengerjaan dan berkas master proyek telah diselesaikan dan disahkan."}
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {data.fulfillmentJson.projectFilesUrl && (
                <a
                  href={data.fulfillmentJson.projectFilesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#0F4C3A] text-white text-xs font-bold hover:bg-[#165B46] transition flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Master Files (Google Drive)</span>
                </a>
              )}
              {data.fulfillmentJson.promptPackUrl && (
                <a
                  href={data.fulfillmentJson.promptPackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Unduh KaryaKita Prompt Pack</span>
                </a>
              )}
              {data.fulfillmentJson.waGroupLink && (
                <a
                  href={data.fulfillmentJson.waGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20BA5A] transition flex items-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Gabung WhatsApp Group Eksklusif</span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Main Grid: Task Milestones & Revision Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Live Milestones & Task Progress */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0F4C3A]" />
                Tahapan &amp; Milestone Pengerjaan
              </h2>
              <span className="text-xs text-gray-500">
                {data.tasks.filter((t) => t.status === "DONE").length} dari {data.tasks.length} Selesai
              </span>
            </div>

            <div className="space-y-3">
              {data.tasks.map((task, idx) => {
                const isDone = task.status === "DONE";
                const isInProgress = task.status === "IN_PROGRESS";
                const isReview = task.status === "REVIEW";

                return (
                  <div
                    key={task.id || idx}
                    className={`bg-white rounded-xl border p-4 transition-all ${
                      isDone
                        ? "border-emerald-200 bg-emerald-50/20"
                        : isInProgress
                        ? "border-[#0F4C3A] ring-1 ring-[#0F4C3A]/20 shadow-xs"
                        : isReview
                        ? "border-amber-200 bg-amber-50/20"
                        : "border-gray-200 opacity-80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                            isDone
                              ? "bg-emerald-100 text-emerald-800"
                              : isInProgress
                              ? "bg-[#0F4C3A] text-white animate-pulse"
                              : isReview
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isInProgress ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                              {task.title}
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                isDone
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isInProgress
                                  ? "bg-sky-100 text-sky-800"
                                  : isReview
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {isDone
                                ? "Selesai"
                                : isInProgress
                                ? "Sedang Dikerjakan"
                                : isReview
                                ? "Review Mutu"
                                : "Antrean"}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Definition of Done Checklist */}
                          {task.dodChecklist && task.dodChecklist.length > 0 && (
                            <div className="pt-2 space-y-1">
                              {task.dodChecklist.map((chk, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="flex items-center gap-2 text-[11px] text-gray-600"
                                >
                                  <span
                                    className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                                      chk.checked || isDone
                                        ? "bg-emerald-600 text-white"
                                        : "border border-gray-300"
                                    }`}
                                  >
                                    {(chk.checked || isDone) && "✓"}
                                  </span>
                                  <span
                                    className={
                                      chk.checked || isDone ? "line-through text-gray-400" : ""
                                    }
                                  >
                                    {chk.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {task.workProofUrl && (
                        <a
                          href={task.workProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg border border-sky-300 bg-sky-50 text-sky-800 text-[11px] font-semibold hover:bg-sky-100 transition flex items-center gap-1 flex-shrink-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Draf Aset</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Revision Submission & Contacts */}
          <div className="space-y-6">
            {/* Revision Request Card */}
            <div className="bg-white rounded-2xl border border-[#CFE0D8] p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <MessageSquare className="w-4 h-4 text-[#0F4C3A]" />
                  <span>Kirim Catatan / Masukan</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {data.revisions.remaining}x Kuota Sisa
                </span>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                Ada masukan estetika atau catatan untuk tim? Masukkan catatan di sini. Tim co-founder di KaryaKita Hub akan langsung menerima masukan Anda di papan triage.
              </p>

              <form onSubmit={handleSendRevision} className="space-y-3">
                <textarea
                  rows={4}
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Tuliskan catatan revisi spesifik Anda di sini (misal: penyesuaian kontras palet warna, penambahan teks slogan, dll)..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] bg-[#F8FAF9]"
                />

                {revErrorMsg && (
                  <p className="text-xs text-red-600 font-semibold">{revErrorMsg}</p>
                )}
                {revSuccessMsg && (
                  <p className="text-xs text-emerald-700 font-semibold">{revSuccessMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingRev || !revisionNote.trim()}
                  className="w-full py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#1A6B52] disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingRev ? "Mengirim..." : "Kirim Catatan ke Tim Hub"}</span>
                </button>
              </form>

              {/* Revision History */}
              {data.revisions.items.length > 0 && (
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <span className="text-[11px] font-bold text-gray-700 block">
                    Riwayat Masukan Klien:
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {data.revisions.items.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-[11px] space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] text-gray-500">
                          <span>
                            {new Date(rev.submittedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-bold ${
                              rev.triageStatus === "ACCEPTED"
                                ? "bg-emerald-100 text-emerald-800"
                                : rev.triageStatus === "OUT_OF_SCOPE_ADDENDUM"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-sky-100 text-sky-800"
                            }`}
                          >
                            {rev.triageStatus === "ACCEPTED"
                              ? "Diterima"
                              : rev.triageStatus === "OUT_OF_SCOPE_ADDENDUM"
                              ? "Addendum"
                              : "Dalam Review"}
                          </span>
                        </div>
                        <p className="text-gray-800 leading-snug">{rev.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Support & Contact Card */}
            <div className="bg-white rounded-2xl border border-[#CFE0D8] p-5 shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#0F4C3A]" />
                <span>Konsultasi &amp; Dukungan Cepat</span>
              </h3>
              <p className="text-gray-500 leading-relaxed text-[11px]">
                Butuh koordinasi cepat terkait SLA atau pertemuan daring via Google Meet? Tim siap mendampingi Anda.
              </p>

              <div className="space-y-2 pt-1">
                <a
                  href={`https://wa.me/6285215645719?text=${encodeURIComponent(
                    `Halo tim KaryaKita Studio, saya ${data.customerName} ingin berkonsultasi mengenai progres pesanan *${data.orderCode}*.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold flex items-center justify-center gap-1.5 transition shadow-xs text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat WhatsApp Tim Resmi</span>
                </a>

                <div className="text-[11px] text-gray-400 text-center pt-1">
                  Hari Kerja: Senin – Sabtu (08.00 – 21.00 WIB)
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProjectMonitoringPage({
  params,
}: {
  params: Promise<{ orderCode: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3 text-sm text-[#4B5563]">
            <RefreshCw className="w-8 h-8 animate-spin text-[#0F4C3A]" />
            <span>Memuat Portal Monitoring...</span>
          </div>
        </div>
      }
    >
      <ProjectMonitoringContent params={params} />
    </Suspense>
  );
}
