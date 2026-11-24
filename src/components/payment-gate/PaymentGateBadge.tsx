"use client";

import React from "react";
import {
  Lock,
  Clock,
  FileSearch,
  ShieldCheck,
  Hourglass,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { PaymentGateStatus, STATUS_CONFIG } from "@/types/payment-gate";

interface PaymentGateBadgeProps {
  status: PaymentGateStatus;
  size?: "sm" | "md";
  className?: string;
  showIcon?: boolean;
}

export function PaymentGateBadge({
  status,
  size = "md",
  className = "",
  showIcon = true,
}: PaymentGateBadgeProps) {
  const meta = STATUS_CONFIG[status] || STATUS_CONFIG.LOCKED_WAITING_DP;

  const renderIcon = () => {
    const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";
    switch (meta.iconName) {
      case "Lock":
        return <Lock className={iconSize} />;
      case "Clock":
        return <Clock className={iconSize} />;
      case "FileSearch":
        return <FileSearch className={iconSize} />;
      case "ShieldCheck":
        return <ShieldCheck className={iconSize} />;
      case "Hourglass":
        return <Hourglass className={iconSize} />;
      case "CheckCircle2":
        return <CheckCircle2 className={iconSize} />;
      case "AlertTriangle":
        return <AlertTriangle className={iconSize} />;
      default:
        return <Clock className={iconSize} />;
    }
  };

  const sizeClasses =
    size === "sm"
      ? "px-2.5 py-0.5 text-[11px] gap-1 font-semibold"
      : "px-3 py-1 text-xs gap-1.5 font-semibold";

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs transition-colors ${meta.bgClass} ${meta.textClass} ${meta.borderClass} ${sizeClasses} ${className}`}
      title={meta.description}
    >
      {showIcon && renderIcon()}
      <span className="tracking-tight">{meta.label}</span>
    </span>
  );
}
