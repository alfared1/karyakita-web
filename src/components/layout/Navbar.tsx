"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { KaryaKitaLogo } from "@/components/brand/KaryaKitaLogo";
import { buildWhatsAppUrl } from "@/config/contacts";

interface NavbarProps {
  onOpenContact: (title?: string, actionType?: "b2b" | "academy") => void;
}

export function Navbar({ onOpenContact }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Layanan", href: "#layanan" },
    { name: "AI Academy", href: "#academy" },
    { name: "Portofolio", href: "#portofolio" },
    { name: "Cara Kerja", href: "#cara-kerja" },
    { name: "Tim Kami", href: "#tim" },
    { name: "FAQ", href: "#faq" },
  ];

  const handleConsultClick = (e: React.MouseEvent) => {
    const waUrl = buildWhatsAppUrl();
    if (!waUrl) {
      e.preventDefault();
      onOpenContact("Konsultasi Proyek B2B", "b2b");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-[72px] bg-white/90 backdrop-blur-md border-b border-[#CFE0D8] transition-all">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center">
          <KaryaKitaLogo variant="light" iconSize={36} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#4B5563] hover:text-[#0F4C3A] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="#academy"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0F4C3A] border border-[#0F4C3A]/30 hover:border-[#0F4C3A] hover:bg-[#EEF5F2] transition-all"
          >
            Daftar AI Academy
          </Link>
          <a
            href={buildWhatsAppUrl() || "#"}
            onClick={handleConsultClick}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0F4C3A] hover:bg-[#1A6B52] text-white shadow-sm hover:shadow transition-all flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Konsultasi Gratis</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-[#1F2937] hover:bg-gray-100 transition-colors"
            aria-label="Buka Menu Navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#CFE0D8] shadow-xl px-5 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#1F2937] hover:text-[#0F4C3A] py-1 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#CFE0D8] flex flex-col gap-2.5">
            <Link
              href="#academy"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[44px] flex items-center justify-center rounded-xl text-sm font-semibold text-[#0F4C3A] border border-[#0F4C3A] bg-[#EEF5F2]"
            >
              Daftar AI Academy (Rp75.000)
            </Link>
            <button
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleConsultClick(e);
              }}
              className="w-full min-h-[44px] flex items-center justify-center rounded-xl text-sm font-semibold bg-[#0F4C3A] text-white shadow"
            >
              Konsultasi Proyek B2B
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
