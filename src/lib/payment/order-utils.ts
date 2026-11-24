import crypto from "crypto";

// In-Memory sliding window rate limiter untuk endpoint publik (maks 10 order per 10 menit per IP)
const ipRateMap = new Map<string, { count: number; firstSeen: number }>();

export function checkRateLimit(ip: string, maxLimit = 10, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const record = ipRateMap.get(ip);

  if (!record || now - record.firstSeen > windowMs) {
    ipRateMap.set(ip, { count: 1, firstSeen: now });
    return true;
  }

  if (record.count >= maxLimit) {
    return false;
  }

  record.count += 1;
  return true;
}

export function generateOrderCode(unitCode: string): string {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const prefix = unitCode === "academy" ? "KK-ACA" : "KK-B2B";
  return `${prefix}-${yearMonth}-${randomSuffix}`;
}

export function generatePortalToken(): string {
  return crypto.randomBytes(32).toString("hex"); // 256-bit cryptographically secure token
}

export function maskWhatsapp(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.length < 8) return clean;
  return `${clean.slice(0, 4)}••••${clean.slice(-4)}`;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain || local.length <= 2) return email;
  return `${local.slice(0, 2)}••••@${domain}`;
}
