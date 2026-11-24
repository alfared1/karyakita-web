import { z } from "zod";

const envSchema = z.object({
  // Google Gemini API Configuration
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY wajib diisi di environment variables"),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),

  // Meta WhatsApp Cloud API Configuration
  WHATSAPP_ACCESS_TOKEN: z
    .string()
    .min(1, "WHATSAPP_ACCESS_TOKEN wajib diisi (gunakan Permanent System User Token)"),
  WHATSAPP_PHONE_NUMBER_ID: z
    .string()
    .min(1, "WHATSAPP_PHONE_NUMBER_ID wajib diisi dari Meta App Dashboard"),
  WHATSAPP_VERIFY_TOKEN: z
    .string()
    .min(1, "WHATSAPP_VERIFY_TOKEN wajib diisi untuk verifikasi handshake GET"),
  WHATSAPP_APP_SECRET: z
    .string()
    .min(1, "WHATSAPP_APP_SECRET wajib diisi untuk validasi tanda tangan HMAC-SHA256"),
  WHATSAPP_GRAPH_VERSION: z.string().default("v22.0"),

  // Bot Switch
  AUTO_REPLY_ENABLED: z
    .enum(["true", "false"])
    .default("true"),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validasi dan muat konfigurasi environment variables.
 * Dilempar saat runtime jika ada variabel wajib yang hilang saat aplikasi berjalan di produksi.
 */
export function getEnv(): EnvConfig {
  const result = envSchema.safeParse({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
    WHATSAPP_APP_SECRET: process.env.WHATSAPP_APP_SECRET,
    WHATSAPP_GRAPH_VERSION: process.env.WHATSAPP_GRAPH_VERSION || "v22.0",
    AUTO_REPLY_ENABLED: process.env.AUTO_REPLY_ENABLED || "true",
  });

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `• ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`[Env Error] Konfigurasi environment belum lengkap:\n${errorDetails}`);
  }

  return result.data;
}

/**
 * Helper aman untuk membaca nilai env tanpa melempar error (berguna untuk health-check atau graceful fallback)
 */
export function getSafeEnv(): Partial<EnvConfig> {
  return {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
    WHATSAPP_APP_SECRET: process.env.WHATSAPP_APP_SECRET,
    WHATSAPP_GRAPH_VERSION: process.env.WHATSAPP_GRAPH_VERSION || "v22.0",
    AUTO_REPLY_ENABLED: (process.env.AUTO_REPLY_ENABLED as "true" | "false") || "true",
  };
}
