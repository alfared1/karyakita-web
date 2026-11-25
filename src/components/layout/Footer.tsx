"use client";

import React from "react";
import Link from "next/link";
import { KaryaKitaLogo } from "@/components/brand/KaryaKitaLogo";
import { contacts, buildWhatsAppUrl } from "@/config/contacts";
import { servicesData } from "@/data/services";
import { MapPin, Mail, MessageSquare } from "lucide-react";

interface FooterProps {
  onOpenContact: (title?: string, actionType?: "b2b" | "academy") => void;
}

export function Footer({ onOpenContact }: FooterProps) {
  const handleConsultClick = (e: React.MouseEvent, title: string) => {
    const waUrl = buildWhatsAppUrl(title);
    if (!waUrl) {
      e.preventDefault();
      onOpenContact(title, "b2b");
    }
  };

  return (
    <footer className="bg-[#1F2937] text-gray-300 pt-16 pb-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-700">
          {/* Col 1: Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <KaryaKitaLogo variant="dark" iconSize={38} />
            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              KaryaKita AI &amp; Venture Studio adalah startup digital yang didirikan oleh 7 mahasiswa Sistem Informasi STMIK Tazkia. Membangun solusi desain, rekayasa web, analisis data, media, dan literasi AI yang profesional serta berlandaskan etika syariah.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>Bogor, Jawa Barat · STMIK Tazkia</span>
            </div>
          </div>

          {/* Col 2: 5 Units (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              5 Unit Bisnis Kami
            </h4>
            <ul className="space-y-2 text-xs">
              {servicesData.map((unit) => (
                <li key={unit.id}>
                  <a
                    href="#layanan"
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{unit.name}</span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: unit.accentColor }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#layanan" className="hover:text-white transition-colors">
                  Katalog Layanan
                </Link>
              </li>
              <li>
                <Link href="/daftar/ai-academy" className="hover:text-white transition-colors">
                  AI Academy (Batch 1)
                </Link>
              </li>
              <li>
                <Link href="#portofolio" className="hover:text-white transition-colors">
                  Portofolio Nyata
                </Link>
              </li>
              <li>
                <Link href="#cara-kerja" className="hover:text-white transition-colors">
                  Alur Akad Syariah
                </Link>
              </li>
              <li>
                <Link href="#tim" className="hover:text-white transition-colors">
                  Tim 7 Pendiri
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-white transition-colors">
                  FAQ &amp; Informasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Socials (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kontak &amp; Komunikasi Resmi
            </h4>
            <p className="text-xs text-gray-400">
              Saluran komunikasi resmi KaryaKita untuk penjajakan B2B dan pendaftaran kelas AI.
            </p>
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800 border border-gray-700">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp Bisnis
                </span>
                {contacts.whatsappB2BNumber ? (
                  <span className="font-semibold text-white">{contacts.whatsappB2BNumber}</span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Segera Hadir
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800 border border-gray-700">
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  Email Studio
                </span>
                {contacts.officialEmail ? (
                  <span className="font-semibold text-white">{contacts.officialEmail}</span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Segera Hadir
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={(e) => handleConsultClick(e, "Konsultasi B2B KaryaKita")}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#0F4C3A] hover:bg-[#1A6B52] text-white transition-colors flex items-center justify-center gap-1.5"
              >
                Hubungi Perwakilan Tim →
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 KaryaKita AI &amp; Venture Studio. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Prinsip Syirkah &apos;Abdan</span>
            <span>·</span>
            <span className="text-gray-400">Akad Zero Gharar</span>
            <span>·</span>
            <span className="text-gray-400">100% Legal Stack</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
