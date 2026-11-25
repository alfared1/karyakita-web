/**
 * Meta WhatsApp Cloud API Client
 * Menggunakan Graph API resmi Meta dengan native fetch bawaan Node.js / Next.js
 */

import { getSafeEnv } from "../env";

const WHATSAPP_MAX_TEXT_LENGTH = 4000; // Batas aman di bawah 4096 karakter resmi Meta

export interface WhatsAppSendResponse {
  messaging_product: string;
  contacts?: Array<{ input: string; wa_id: string }>;
  messages?: Array<{ id: string }>;
  error?: {
    message: string;
    type: string;
    code: number;
    error_data?: unknown;
    fbtrace_id?: string;
  };
}

/**
 * Memecah teks panjang menjadi beberapa bagian agar tidak melebihi batas 4096 karakter Meta WhatsApp.
 * Pemecahan dilakukan secara cerdas berbasis batas paragraf (\n\n), baris baru (\n), atau spasi kata.
 */
export function splitMessage(text: string, maxLength = WHATSAPP_MAX_TEXT_LENGTH): string[] {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining);
      break;
    }

    // Cari titik pemecahan terbaik di dekat maxLength
    let splitIndex = remaining.lastIndexOf("\n\n", maxLength);
    if (splitIndex === -1 || splitIndex < maxLength * 0.5) {
      splitIndex = remaining.lastIndexOf("\n", maxLength);
    }
    if (splitIndex === -1 || splitIndex < maxLength * 0.5) {
      splitIndex = remaining.lastIndexOf(" ", maxLength);
    }
    if (splitIndex === -1) {
      // Jika tidak ada spasi sama sekali, potong paksa pada maxLength
      splitIndex = maxLength;
    }

    const chunk = remaining.slice(0, splitIndex).trim();
    if (chunk) {
      chunks.push(chunk);
    }
    remaining = remaining.slice(splitIndex).trim();
  }

  return chunks;
}

/**
 * Mengirim pesan teks ke pengguna WhatsApp melalui Meta Cloud API.
 * Jika teks melebihi batas karakter aman, teks akan dipecah otomatis menjadi beberapa balon chat.
 */
export async function sendWhatsAppTextMessage(
  to: string,
  body: string
): Promise<WhatsAppSendResponse[]> {
  const env = getSafeEnv();
  const accessToken = env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
  const graphVersion = env.WHATSAPP_GRAPH_VERSION || "v22.0";

  if (!accessToken || !phoneNumberId) {
    console.error("[WhatsApp Client] Gagal mengirim: WHATSAPP_ACCESS_TOKEN atau WHATSAPP_PHONE_NUMBER_ID belum disetel");
    throw new Error("Kredensial WhatsApp Cloud API belum dikonfigurasi.");
  }

  // Bersihkan format nomor tujuan (hanya digit, buang +, spasi, tanda minus)
  const cleanTo = to.replace(/\D/g, "");
  const chunks = splitMessage(body);
  const results: WhatsAppSendResponse[] = [];

  const url = `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;

  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanTo,
      type: "text",
      text: {
        preview_url: false,
        body: chunkText,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });

      const data = (await response.json()) as WhatsAppSendResponse;

      if (!response.ok || data.error) {
        console.error(
          `[WhatsApp Client] Error kirim pesan (chunk ${i + 1}/${chunks.length}):`,
          data.error || response.statusText
        );
      } else {
        console.log(
          `[WhatsApp Client] Pesan terkirim ke ${cleanTo} (ID: ${data.messages?.[0]?.id || "unknown"})`
        );
      }

      results.push(data);

      // Beri jeda sangat singkat antar chunk jika ada pemecahan pesan agar urutan tiba di HP berurutan
      if (chunks.length > 1 && i < chunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (err) {
      console.error(`[WhatsApp Client] Network error saat fetch ke Graph API:`, err);
      throw err;
    }
  }

  return results;
}

/**
 * Menandai pesan masuk sebagai telah dibaca (centang biru di WhatsApp pengguna).
 * Memberikan feedback instan bahwa sistem telah menerima pesan sebelum AI selesai merumuskan balasan.
 */
export async function markMessageAsRead(messageId: string): Promise<boolean> {
  const env = getSafeEnv();
  const accessToken = env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
  const graphVersion = env.WHATSAPP_GRAPH_VERSION || "v22.0";

  if (!accessToken || !phoneNumberId || !messageId) {
    return false;
  }

  const url = `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      }),
    });

    const data = await response.json();
    return response.ok && !data.error;
  } catch (err) {
    console.warn(`[WhatsApp Client] Gagal markMessageAsRead untuk ID ${messageId}:`, err);
    return false;
  }
}
