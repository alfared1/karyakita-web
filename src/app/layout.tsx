import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KaryaKita AI & Venture Studio | Solusi Desain, Web, Data, Media & AI Academy",
  description:
    "Studio digital & pelatihan AI terintegrasi di Bogor. Didirikan oleh 7 mahasiswa Sistem Informasi STMIK Tazkia. Menyediakan layanan Brand & UI/UX Design, Custom Web Engineering, Assist & Data, Media & Affiliate, serta AI Academy dengan tata kelola amanah.",
  keywords: [
    "KaryaKita",
    "AI Venture Studio Indonesia",
    "Jasa Pembuatan Website UMKM",
    "Workshop AI Indonesia",
    "UI UX Design Studio Bogor",
    "Digitalisasi UMKM",
    "STMIK Tazkia",
    "Syirkah Abdan",
  ],
  authors: [{ name: "KaryaKita AI & Venture Studio" }],
  creator: "KaryaKita Studio",
  publisher: "KaryaKita AI & Venture Studio",
  metadataBase: new URL("https://karyakita.id"),
  openGraph: {
    title: "KaryaKita AI & Venture Studio — Solusi Digital & Pelatihan AI Amanah",
    description:
      "5 unit layanan digital terintegrasi untuk UMKM, institusi, dan talenta muda Indonesia berlandaskan etika bisnis Islam.",
    url: "https://karyakita.id",
    siteName: "KaryaKita AI & Venture Studio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/og-karyakita.png",
        width: 1200,
        height: 630,
        alt: "KaryaKita AI & Venture Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KaryaKita AI & Venture Studio",
    description:
      "Studio digital & pelatihan AI terintegrasi di Bogor. Didirikan oleh 7 mahasiswa Sistem Informasi STMIK Tazkia.",
    images: ["/images/og-karyakita.png"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KaryaKita AI & Venture Studio",
    url: "https://karyakita.id",
    logo: "https://karyakita.id/images/og-karyakita.png",
    description:
      "Studio digital & pelatihan AI terintegrasi di Bogor oleh 7 mahasiswa Sistem Informasi STMIK Tazkia.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bogor",
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    },
    founder: [
      { "@type": "Person", name: "Syauqi Muhammad Al Fatih" },
      { "@type": "Person", name: "Ilham Akbar" },
      { "@type": "Person", name: "Hilwa Mufida" },
      { "@type": "Person", name: "Syarah Fauziah" },
      { "@type": "Person", name: "Novita Rani" },
      { "@type": "Person", name: "Nazwa Azahra" },
      { "@type": "Person", name: "Ahmad Maulana" },
    ],
  };

  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${inter.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8FAF9] text-[#1F2937] antialiased">
        {children}
      </body>
    </html>
  );
}
