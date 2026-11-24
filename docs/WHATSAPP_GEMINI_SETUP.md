# Panduan Integrasi WhatsApp Auto-Reply Berbasis Gemini API
**KaryaKita AI & Venture Studio**  
*Runtime: Next.js App Router (TypeScript) | Official Meta WhatsApp Cloud API | Google GenAI SDK (`@google/genai`)*

---

## 1. Arsitektur & Gambaran Sistem

Fitur ini mengintegrasikan **Meta WhatsApp Cloud API resmi** dengan **Google Gemini API** (`gemini-2.5-flash`) secara aman, cepat, dan legal untuk menangani percakapan otomatis dengan pelanggan KaryaKita:

```
[ Pengguna WhatsApp ]
        │
        ▼ (Pesan Masuk)
[ Meta WhatsApp Cloud API ]
        │
        ▼ (HTTPS Webhook POST + X-Hub-Signature-256)
[ Next.js: /api/webhook/whatsapp ]
        ├─► 1. Verifikasi Signature HMAC-SHA256 (timingSafeEqual)
        ├─► 2. Filter Event Status (Anti-Loop)
        ├─► 3. Filter Idempotensi (Anti Balas Ganda, 10 min TTL)
        ├─► 4. Centang Biru Instan (markMessageAsRead)
        ├─► 5. Cek Pesan Non-Teks (Edukasi Sopan)
        ├─► 6. Guardrail Human Handover ("hubungi admin", dll.)
        │
        ▼ (Konteks Chat + System Persona)
[ Google Gemini API (@google/genai) ]
        │
        ▼ (Jawaban Natural Bahasa Indonesia)
[ Meta Graph API /messages ]
        │
        ▼ (Pesan Terkirim)
[ Pengguna WhatsApp ]
```

---

## 2. Persiapan Kredensial & Variabel Lingkungan

Salin template variabel lingkungan:
```bash
cp .env.example .env.local
```

### A. Mendapatkan `GEMINI_API_KEY` dari Google AI Studio
1. Buka [Google AI Studio](https://aistudio.google.com/).
2. Masuk menggunakan akun Google Anda.
3. Klik tombol **Get API key** di menu sebelah kiri.
4. Klik **Create API key** (pilih project Google Cloud baru atau yang sudah ada).
5. Salin API Key yang dihasilkan dan masukkan ke file `.env.local`:
   ```env
   GEMINI_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX"
   GEMINI_MODEL="gemini-2.5-flash"
   ```

### B. Menyiapkan Meta Developers & WhatsApp Cloud API
1. Buka [Meta for Developers](https://developers.facebook.com/) dan login.
2. Buat aplikasi baru:
   - Pilih jenis aplikasi: **Other** > **Business**.
   - Beri nama aplikasi (misal: `KaryaKita WhatsApp Assistant`).
3. Tambahkan produk **WhatsApp** ke aplikasi Anda.
4. **Phone Number ID & Test Number:**
   - Masuk ke menu **WhatsApp** > **API Setup**.
   - Salin **Phone number ID** ke `.env.local`:
     ```env
     WHATSAPP_PHONE_NUMBER_ID="109876543210987"
     ```
5. **App Secret (Wajib untuk Verifikasi Signature HMAC):**
   - Masuk ke **App Settings** > **Basic**.
   - Di bagian **App Secret**, klik tombol **Show** (masukkan password akun Meta).
   - Salin nilai App Secret ke `.env.local`:
     ```env
     WHATSAPP_APP_SECRET="abcdef0123456789abcdef0123456789"
     ```
6. **Permanent System User Token (Token Produksi):**
   - Jangan gunakan temporary token (24 jam) untuk produksi!
   - Buka **Meta Business Suite** > **Business Settings** > **Users** > **System Users**.
   - Tambahkan System User baru dengan role **Admin**.
   - Berikan aset aplikasi WhatsApp Anda ke System User tersebut.
   - Klik **Generate New Token**, pilih aplikasi Anda, dan centang permission:
     - `whatsapp_business_messaging`
     - `whatsapp_business_management`
   - Salin token permanen tersebut ke `.env.local`:
     ```env
     WHATSAPP_ACCESS_TOKEN="EAAG..."
     ```
7. **Webhook Verify Token (Buatan Sendiri):**
   - Buat string rahasia unik buatan Anda sendiri:
     ```env
     WHATSAPP_VERIFY_TOKEN="karyakita_secret_webhook_verify_2026"
     WHATSAPP_GRAPH_VERSION="v22.0"
     AUTO_REPLY_ENABLED="true"
     ```

---

## 3. Menghubungkan Webhook di Meta Developers Dashboard

1. **Deploy ke Vercel:**
   - Pastikan variabel lingkungan di atas sudah dimasukkan di **Vercel Project Settings > Environment Variables**.
   - URL produksi Anda misalnya: `https://karyakita-web.vercel.app`
2. **Konfigurasi Webhook di Meta:**
   - Di Dashboard Meta Developers, buka **WhatsApp** > **Configuration**.
   - Klik **Edit** di bagian **Webhook**:
     - **Callback URL:** `https://karyakita-web.vercel.app/api/webhook/whatsapp`
     - **Verify token:** Masukkan nilai yang sama persis dengan `WHATSAPP_VERIFY_TOKEN` (misal: `karyakita_secret_webhook_verify_2026`).
   - Klik **Verify and save**. Meta akan mengirimkan permintaan `GET` ke endpoint Anda untuk validasi. Jika lolos, status akan berubah menjadi centang hijau.
3. **Berlangganan Field `messages`:**
   - Di tabel **Webhook fields**, temukan baris `messages`.
   - Klik tombol **Subscribe**. Ini wajib agar setiap ada pesan baru dari pengguna, Meta mengirimkan webhook `POST` ke aplikasi Anda.

---

## 4. Uji Coba Lokal & Otomatisasi

### A. Uji Coba Otomatis (Unit & Integration Test Suite)
Jalankan skrip pengujian bawaan tanpa perlu server hidup:
```bash
npm run test:webhook
```
Skrip ini akan menguji 9 skenario kritis:
- Handshake `GET` verifikasi token sah vs tidak sah.
- Validasi keamanan tanda tangan header `x-hub-signature-256`.
- Anti-loop pengabaian event status (`sent`, `delivered`, `read`).
- Penanganan pesan non-teks (gambar/stiker).
- Idempotensi (pencegahan balas ganda pada retry webhook).
- Deteksi kata kunci guardrail *Human Handover*.
- Pemecahan teks panjang cerdas (*message chunking* < 4096 karakter).
- Alur routing pesan teks masuk.

### B. Uji Coba Manual dengan `curl`

#### 1. Simulasi Verifikasi Webhook Meta (GET)
```bash
curl -X GET "http://localhost:3000/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=karyakita_secret_webhook_verify_2026&hub.challenge=11223344"
```
*Hasil yang diharapkan: HTTP 200 dengan body `11223344`.*

#### 2. Simulasi Pesan Masuk (POST dengan Signature HMAC-SHA256)
Buat payload JSON pesan masuk (misal `payload.json`):
```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WABA_ID",
      "changes": [
        {
          "field": "messages",
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "628000000000",
              "phone_number_id": "109876543210987"
            },
            "contacts": [
              {
                "profile": { "name": "Budi Santoso" },
                "wa_id": "6281234567890"
              }
            ],
            "messages": [
              {
                "from": "6281234567890",
                "id": "wamid.TEST_LOCAL_001",
                "timestamp": "1710000000",
                "type": "text",
                "text": { "body": "Halo KaryaKita, apa saja layanan yang tersedia?" }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

Hitung tanda tangan HMAC-SHA256 di Node.js:
```bash
node -e "const crypto=require('crypto'); const fs=require('fs'); const body=fs.readFileSync('payload.json','utf8'); const hmac=crypto.createHmac('sha256', process.env.WHATSAPP_APP_SECRET).update(body).digest('hex'); console.log('sha256=' + hmac);"
```

Kirim via `curl`:
```bash
curl -X POST "http://localhost:3000/api/webhook/whatsapp" \
  -H "Content-Type: application/json" \
  -H "x-hub-signature-256: sha256=<HASH_DIATAS>" \
  --data-binary "@payload.json"
```

---

## 5. Fitur Unggulan Keamanan & Keandalan

1. **HMAC-SHA256 Timing-Safe Equal:**  
   Mencegah *timing-attack* saat memverifikasi integritas payload yang dikirim oleh server Meta.
2. **Anti-Loop:**  
   Mengabaikan event status seperti `sent`, `delivered`, dan `read` sehingga bot tidak pernah membalas event pengirimannya sendiri.
3. **Idempotensi (Anti Balas Ganda):**  
   Menyimpan `message.id` ke in-memory cache dengan TTL 10 menit untuk mencegah double-reply saat Meta melakukan retry pengiriman webhook.
4. **Centang Biru Responsif (`markMessageAsRead`):**  
   Segera menandai pesan sebagai terbaca di HP pengirim saat pesan masuk diterima.
5. **Human Handover:**  
   Ketika pengguna mengetik kata kunci seperti `"hubungi admin"` atau `"bicara dengan manusia"`, bot secara otomatis memberikan respons sopan dan menandai percakapan untuk diteruskan ke tim manajemen/Alfatih.
6. **Smart Message Chunking:**  
   Jika respons AI melebihi 4000 karakter, pesan akan dipecah otomatis di batas paragraf dan dikirim berurutan secara mulus.
7. **Saklar Cepat (`AUTO_REPLY_ENABLED`):**  
   Pemilik dapat mematikan respon otomatis kapan saja melalui dashboard Vercel tanpa perlu redeploy kode.
