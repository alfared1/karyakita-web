"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Sparkles,
  X,
  ArrowRight,
  ExternalLink,
  Search,
  Users,
  ShieldCheck,
} from "lucide-react";
import { contacts, buildWhatsAppUrl } from "@/config/contacts";

interface ChatFloatingWidgetProps {
  onOpenTeamModal?: () => void;
}

export function ChatFloatingWidget({ onOpenTeamModal }: ChatFloatingWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [trackCode, setTrackCode] = useState("");

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackCode.trim()) {
      window.location.href = `/monitor/${encodeURIComponent(trackCode.trim().toUpperCase())}`;
    }
  };

  const defaultWaUrl = buildWhatsAppUrl(
    "Konsultasi Studio",
    "Halo AI & Tim KaryaKita, saya ingin berkonsultasi mengenai layanan digital dan pemesanan proyek."
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 font-sans">
      {/* Floating Card Popup */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2.5rem)] sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#CFE0D8] overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#0F4C3A] text-white p-4 relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                  <Sparkles className="w-5 h-5 text-[#FCD34D]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0F4C3A]" />
              </div>
              <div>
                <h4 className="font-bold text-xs tracking-wide">
                  KaryaKita AI &amp; Venture Studio
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AI Assistant &amp; Tim Standby</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Options */}
          <div className="p-4 space-y-3 bg-[#F8FAF9] max-h-[75vh] overflow-y-auto">
            {/* 1. Chat WhatsApp AI Fast */}
            <a
              href={defaultWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-2xl border border-[#CFE0D8] hover:border-[#0F4C3A] hover:shadow-md transition-all flex items-start gap-3 group block"
            >
              <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-[#1F2937] group-hover:text-[#0F4C3A]">
                    Tanya AI Chatbot (WhatsApp 24 Jam)
                  </h5>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#0F4C3A]" />
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  Cek pricelist, konsultasi awal, dan panduan syariah instan melalui bot WhatsApp resmi.
                </p>
              </div>
            </a>

            {/* 2. Pesan Proyek B2B */}
            <Link
              href="/order"
              onClick={() => setIsOpen(false)}
              className="p-3 bg-white rounded-2xl border border-[#CFE0D8] hover:border-[#0F4C3A] hover:shadow-md transition-all flex items-start gap-3 group block"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0F4C3A] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#FCD34D]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-[#1F2937] group-hover:text-[#0F4C3A]">
                    Pesan Proyek Resmi (DP 50%)
                  </h5>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#0F4C3A]" />
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  Formulir order B2B resmi berlandaskan Akad Ijarah bi al-&apos;Amal bebas bunga riba.
                </p>
              </div>
            </Link>

            {/* 3. Hubungi Perwakilan Tim */}
            {onOpenTeamModal && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenTeamModal();
                }}
                className="w-full text-left p-3 bg-white rounded-2xl border border-[#CFE0D8] hover:border-[#0F4C3A] hover:shadow-md transition-all flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#EEF5F2] text-[#0F4C3A] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#CFE0D8]">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-[#1F2937] group-hover:text-[#0F4C3A]">
                      Hubungi Perwakilan Tim (PIC)
                    </h5>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#0F4C3A]" />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    Hubungi 6 founder sesuai keahlian: Web, Desain, PM, Data, Media, &amp; Keuangan.
                  </p>
                </div>
              </button>
            )}

            {/* 4. Tracking Pesanan Cepat */}
            <div className="pt-2 border-t border-[#CFE0D8]">
              <div className="text-[11px] font-bold text-[#4B5563] mb-1.5 flex items-center gap-1">
                <Search className="w-3 h-3 text-[#0F4C3A]" />
                <span>Pantau Progres Pesanan:</span>
              </div>
              <form onSubmit={handleTrackSubmit} className="flex gap-1.5">
                <input
                  type="text"
                  value={trackCode}
                  onChange={(e) => setTrackCode(e.target.value)}
                  placeholder="Kode Tiket (KK-...)"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-[#CFE0D8] text-xs font-mono uppercase bg-white focus:outline-none focus:ring-1 focus:ring-[#0F4C3A]"
                />
                <button
                  type="submit"
                  disabled={!trackCode.trim()}
                  className="px-3 py-1.5 rounded-xl bg-[#0F4C3A] hover:bg-[#1A6B52] disabled:opacity-50 text-white font-bold text-xs transition"
                >
                  Lacak
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0F4C3A] hover:bg-[#1A6B52] text-white shadow-xl hover:shadow-2xl transition-all duration-200 border-2 border-white/80 active:scale-95"
        aria-label="Buka Chat AI dan Bantuan Tim"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0F4C3A] animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0F4C3A]" />
        </div>
        <span className="font-bold text-xs hidden sm:inline-block tracking-wide">
          Tanya AI &amp; Hubungi Tim
        </span>
      </button>
    </div>
  );
}
