"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ValueStrip } from "@/components/sections/ValueStrip";
import { ServicesBento } from "@/components/sections/ServicesBento";
import { AcademySpotlight } from "@/components/sections/AcademySpotlight";
import { PricingSection } from "@/components/sections/PricingSection";
import { PortfolioShowcase } from "@/components/sections/PortfolioShowcase";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { TeamSection } from "@/components/sections/TeamSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { ContactModal } from "@/components/ui/ContactModal";

export default function Home() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    serviceTitle: string;
    actionType: "b2b" | "academy" | "general";
  }>({
    isOpen: false,
    serviceTitle: "Konsultasi Layanan KaryaKita",
    actionType: "b2b",
  });

  const handleOpenContact = (
    title = "Konsultasi Layanan KaryaKita",
    actionType: "b2b" | "academy" = "b2b"
  ) => {
    setModalState({
      isOpen: true,
      serviceTitle: title,
      actionType,
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAF9] text-[#1F2937]">
      {/* 1. Sticky Navbar */}
      <Navbar onOpenContact={handleOpenContact} />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection onOpenContact={handleOpenContact} />

        {/* 3. Pita Nilai & Diferensiasi (4 Pilar) */}
        <ValueStrip />

        {/* 4. Katalog 5 Unit Bisnis (Bento Grid 3+2) */}
        <ServicesBento onOpenContact={handleOpenContact} />

        {/* 5. Spotlight AI Academy (2 Kartu Kontras) */}
        <AcademySpotlight onOpenContact={handleOpenContact} />

        {/* 6. Daftar Harga & Paket Lengkap 5 Lini Bisnis */}
        <PricingSection onOpenContact={handleOpenContact} />

        {/* 7. Portofolio Karya Nyata (2 Live Apps Preview) */}
        <PortfolioShowcase />

        {/* 7. Alur Kolaborasi & Akad Syariah (4 Langkah) */}
        <ProcessSteps />

        {/* 8. Tim 7 Pendiri KaryaKita (Grid 4+3 + Modal Bio) */}
        <TeamSection />

        {/* 9. FAQ Accordion (6 Item) */}
        <FaqSection />

        {/* 10. Final CTA Banner */}
        <FinalCta onOpenContact={handleOpenContact} />
      </main>

      {/* Footer */}
      <Footer onOpenContact={handleOpenContact} />

      {/* Pre-Release Fallback Contact Modal */}
      <ContactModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        serviceTitle={modalState.serviceTitle}
        actionType={modalState.actionType}
      />
    </div>
  );
}
