"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Sparkles,
  MessageSquare,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  Bot,
} from "lucide-react";
import { contacts, buildWhatsAppUrl, buildRepWhatsAppUrl } from "@/config/contacts";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
  actionType?: "b2b" | "academy" | "general";
}

export function ContactModal({
  isOpen,
  onClose,
  serviceTitle = "Konsultasi Layanan KaryaKita",
  actionType = "b2b",
}: ContactModalProps) {
  const [activeTab, setActiveTab] = useState<"ai_fast" | "team_pic">("ai_fast");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAcademy = actionType === "academy";
  const defaultWhatsAppUrl = buildWhatsAppUrl(
    serviceTitle,
    `Halo tim KaryaKita Studio, saya ingin berkonsultasi mengenai ${serviceTitle}. Bisakah kita jadwalkan sesi diskusi?`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#CFE0D8] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#0F4C3A] text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FCD34D] text-[#0F4C3A]">
              {isAcademy ? "KARYAKITA AI ACADEMY" : "LAYANAN RESMI TERINTEGRASI"}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Chatbot &amp; Tim Siaga
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white pr-8">
            {serviceTitle}
          </h3>
          <p className="text-xs text-white/85 mt-1">
            Terhubung langsung dengan AI Assistant 24/7, Perwakilan Tim (PIC), atau Formulir Pesan Proyek.
          </p>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-white/15">
            <button
              onClick={() => setActiveTab("ai_fast")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "ai_fast"
                  ? "bg-white text-[#0F4C3A] shadow-sm"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Chat AI WhatsApp (Cepat)</span>
            </button>
            <button
              onClick={() => setActiveTab("team_pic")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "team_pic"
                  ? "bg-white text-[#0F4C3A] shadow-sm"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Hubungi Perwakilan Tim ({contacts.representatives.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-[#1F2937] flex-1">
          {activeTab === "ai_fast" ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Highlight WhatsApp AI Box */}
              <div className="p-4 rounded-2xl bg-[#EEF5F2] border border-[#CFE0D8] space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0F4C3A] text-white flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-[#FCD34D]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F4C3A]">
                      AI Chatbot Studio (WhatsApp Resmi 24 Jam)
                    </h4>
                    <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed">
                      Dapatkan jawaban instan seputar daftar harga resmi, portofolio, skema akad syariah DP 50%, dan konsultasi awal proyek dalam hitungan detik.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <a
                    href={defaultWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Mulai Chat AI WhatsApp Resmi (+62 852-1564-5719)</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>
              </div>

              {/* Langkah Penjajakan */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Keunggulan Layanan KaryaKita:
                </h4>
                <div className="space-y-2 text-xs text-[#4B5563]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F4C3A] flex-shrink-0" />
                    <span>
                      {isAcademy
                        ? "Materi praktis prompt engineering & e-sertifikat resmi."
                        : "Akad Syariah Ijarah bi al-'Amal: DP 50% di muka & pelunasan 50% saat serah terima."}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F4C3A] flex-shrink-0" />
                    <span>Zero Gharar &amp; Zero Riba (bebas denda keterlambatan).</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F4C3A] flex-shrink-0" />
                    <span>Portal Monitoring Real-Time tersinkronisasi ke KaryaKita Hub OS.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="text-xs text-[#4B5563]">
                Pilih perwakilan tim pendiri KaryaKita yang relevan dengan kebutuhan proyek Anda untuk konsultasi langsung:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {contacts.representatives.map((rep) => {
                  const repUrl = buildRepWhatsAppUrl(rep);
                  return (
                    <a
                      key={rep.id}
                      href={repUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-2xl border border-[#CFE0D8] bg-[#F8FAF9] hover:bg-white hover:border-[#0F4C3A] hover:shadow-md transition-all group block"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-[#1F2937] group-hover:text-[#0F4C3A]">
                          {rep.name}
                        </div>
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600 opacity-70 group-hover:opacity-100" />
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                        {rep.role}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                        {rep.expertise}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Banner Pesan Proyek Langsung */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-amber-900">
                Sudah memiliki spesifikasi proyek yang jelas?
              </div>
              <div className="text-[11px] text-amber-800">
                Langsung isi formulir pemesanan resmi untuk mendapatkan kode tiket pesanan.
              </div>
            </div>
            <Link
              href={isAcademy ? "/daftar/ai-academy" : "/order"}
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl font-bold text-xs bg-[#0F4C3A] hover:bg-[#1A6B52] text-white flex-shrink-0 flex items-center gap-1 shadow-xs"
            >
              <span>{isAcademy ? "Daftar Batch 1" : "Pesan Proyek"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#F8FAF9] border-t border-[#CFE0D8] flex flex-col sm:flex-row justify-between items-center gap-2.5 flex-shrink-0">
          <div className="text-[11px] text-gray-500 text-center sm:text-left">
            Hotline Resmi Studio: <strong className="text-[#0F4C3A] font-mono">+62 852-1564-5719</strong>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold border border-[#CFE0D8] text-[#4B5563] hover:bg-gray-100 transition"
            >
              Tutup
            </button>
            <Link
              href="/order"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold bg-[#0F4C3A] hover:bg-[#1A6B52] text-white transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Buka Portal Pesan Proyek</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
