import React from "react";

interface KaryaKitaLogoProps {
  variant?: "light" | "dark" | "icon";
  className?: string;
  iconSize?: number;
}

export function KaryaKitaLogo({
  variant = "light",
  className = "",
  iconSize = 38,
}: KaryaKitaLogoProps) {
  const isDark = variant === "dark";
  const isIconOnly = variant === "icon";

  // Light variant: Used on light background (Emerald container, white text, amber sub-text)
  // Dark variant: Used on dark/emerald background (White container, emerald monogram, gold sub-text)
  const bgFill = isDark ? "#FFFFFF" : "#0F4C3A";
  const kStemFill = isDark ? "#0F4C3A" : "#FFFFFF";
  const chevronFill = isDark ? "#1A6B52" : "#A7F3D0";
  const sparkFill = isDark ? "#B45309" : "#F59E0B";

  const brandTextFill = isDark ? "text-white" : "text-[#0F4C3A]";
  const subTextFill = isDark ? "text-[#FCD34D]" : "text-[#B45309]";

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Geometric SVG Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
        aria-label="KaryaKita Logo Icon"
      >
        {/* Rounded Square 1:1 rx=22 */}
        <rect width="100" height="100" rx="22" fill={bgFill} />

        {/* Monogram K: Left Vertical Bar */}
        <rect x="22" y="24" width="13" height="52" rx="4" fill={kStemFill} />

        {/* Monogram K: Upper Diagonal Arm */}
        <path
          d="M37 53L56 27C57.5 25 60.5 25 62 27L63 28C64.5 30 64.5 33 63 35L48 56L37 53Z"
          fill={kStemFill}
        />

        {/* Monogram K: Lower Diagonal Arm / Forward Chevron (Syirkah 'Abdan) */}
        <path
          d="M44 49L67 71C68.5 72.5 68.5 75.5 67 77L66 78C64.5 79.5 61.5 79.5 60 78L37 55L44 49Z"
          fill={chevronFill}
        />

        {/* 4-pointed AI Spark Star (Top Right Quadrant) */}
        <path
          d="M74 18 C74 24 70 28 64 28 C70 28 74 32 74 38 C74 32 78 28 84 28 C78 28 74 24 74 18 Z"
          fill={sparkFill}
        />
      </svg>

      {/* Wordmark (hidden if variant === 'icon') */}
      {!isIconOnly && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-extrabold text-[20px] tracking-tight ${brandTextFill}`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            KaryaKita
          </span>
          <span
            className={`text-[9.5px] font-bold tracking-[0.18em] uppercase mt-0.5 ${subTextFill}`}
          >
            AI &amp; VENTURE STUDIO
          </span>
        </div>
      )}
    </div>
  );
}
