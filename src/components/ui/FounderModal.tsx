"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Briefcase, Award, Shield, CheckCircle } from "lucide-react";
import { FounderProfile } from "@/data/founders";

interface FounderModalProps {
  founder: FounderProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FounderModal({ founder, isOpen, onClose }: FounderModalProps) {
  const [imgError, setImgError] = useState(false);

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

  if (!isOpen || !founder) return null;

  const initials = founder.nickname
    ? founder.nickname.slice(0, 2).toUpperCase()
    : founder.name.slice(0, 2).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#CFE0D8] overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="bg-[#0F4C3A] text-white p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Tutup Profil"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FCD34D] text-[#0F4C3A]">
              CO-FOUNDER KARYAKITA
            </span>
            <span className="text-xs text-white/80">STMIK Tazkia</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {founder.name}
          </h3>
          <p className="text-sm font-medium text-emerald-100 mt-1">
            {founder.role}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-[#1F2937]">
          {/* Top section: Avatar + Unit Focus */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#CFE0D8]">
            <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-[#CFE0D8] bg-[#EEF5F2] shadow-md">
              {!imgError ? (
                <Image
                  src={founder.avatarPath}
                  alt={founder.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0F4C3A] text-white text-2xl font-bold">
                  {initials}
                </div>
              )}
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4B5563] block mb-1">
                  Fokus Unit &amp; Tanggung Jawab:
                </span>
                <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-[#EEF5F2] text-[#0F4C3A] border border-[#CFE0D8]">
                  {founder.unitFocus}
                </span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed italic">
                &ldquo;{founder.shortBio}&rdquo;
              </p>
            </div>
          </div>

          {/* Full Bio Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A] flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              Biografi Lengkap &amp; Peran Strategis
            </h4>
            <p className="text-sm text-[#4B5563] leading-relaxed text-justify">
              {founder.fullBio}
            </p>
          </div>

          {/* Skill Pills */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A] flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Keahlian Inti &amp; Spesialisasi
            </h4>
            <div className="flex flex-wrap gap-2">
              {founder.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#F8FAF9] text-[#1F2937] border border-[#CFE0D8] flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#0F4C3A]" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Tazkia Value Footer */}
          <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#CFE0D8] flex items-center gap-3 text-xs text-[#4B5563]">
            <Shield className="w-4 h-4 text-[#B45309] flex-shrink-0" />
            <span>
              Berkomitmen menerapkan etika bisnis Islam (Shiddiq, Amanah, Tabligh, Fathanah &amp; Itqan) dalam setiap proyek klien.
            </span>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-[#F8FAF9] border-t border-[#CFE0D8] flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-semibold bg-[#0F4C3A] hover:bg-[#1A6B52] text-white transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
