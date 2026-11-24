# Panduan Publikasi & Konfigurasi Payment Gate KaryaKita ke Vercel

Dokumen ini memuat panduan lengkap penerapan **KaryaKita Payment Gate Design System (PGDS v1.0)** pada lingkungan produksi Vercel (**karyakita-ai.vercel.app**).

---

## 1. Arsitektur & Mode Pembayaran (Hybrid Ready)

- **Mode Aktif Hari Pertama (Zero-Cost Legal):** `MANUAL_BANK_SYARIAH`
  - Konsumen/Klien mentransfer langsung ke rekening Bank Syariah Indonesia (BSI) KaryaKita.
  - Unggah bukti transfer (maksimal 5 MB).
  - Verifikasi cepat &lt; 30 detik oleh Novita Rani (CFO) atau Alfatih (CEO) melalui `/admin/payment-queue`.
- **Mode Masa Depan (Plug-and-Play Gateway):** `AUTO_GATEWAY`
  - Abstraksi `src/lib/payment/provider.ts` dan endpoint `POST /api/webhooks/payment` telah siap menerima webhook otomatis (QRIS / Virtual Account Midtrans / Xendit / Mayar) cukup dengan mengubah `PAYMENT_MODE="AUTO_GATEWAY"` tanpa merombak antarmuka pengguna.

---

## 2. Environment Variables yang Wajib Dikonfigurasi di Vercel

Buka Dashboard Vercel Proyek Anda (**karyakita-ai**) &rarr; **Settings** &rarr; **Environment Variables**, lalu pastikan variabel berikut terisi untuk target *Production* dan *Preview*:

| Nama Variabel | Contoh Nilai | Keterangan |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://neondb_owner:***@ep-***-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` | Connection string PostgreSQL Neon (Pooled) |
| `DIRECT_URL` | `postgresql://neondb_owner:***@ep-***.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` | Direct connection string untuk migrasi Prisma |
| `PAYMENT_MODE` | `MANUAL_BANK_SYARIAH` | Mode pembayaran aktif (`MANUAL_BANK_SYARIAH` atau `AUTO_GATEWAY`) |
| `BANK_SYARIAH_NAME` | `Bank Syariah Indonesia (BSI)` | Nama bank syariah penerima |
| `BANK_SYARIAH_ACCOUNT_NO` | `7234891023` | Nomor rekening resmi KaryaKita |
| `BANK_SYARIAH_ACCOUNT_HOLDER` | `KaryaKita Studio / Novita Rani (CFO)` | Nama pemilik rekening |
| `NEXT_PUBLIC_APP_URL` | `https://karyakita-ai.vercel.app` | URL publik resmi aplikasi |
| `ADMIN_CFO_SECRET_PIN` | `192837` | PIN 6-digit otorisasi pengesahan mutasi CFO |

### Variabel Opsional (Notifikasi Otomatis):
- `WHATSAPP_ACCESS_TOKEN` &amp; `WHATSAPP_PHONE_NUMBER_ID`: Notifikasi otomatis WhatsApp saat pembayaran disahkan / ditolak.
- `TELEGRAM_BOT_TOKEN`: Opsional notifikasi bot Telegram studio.

---

## 3. Langkah Sinkronisasi Database Prisma

Pada Vercel, build command diatur otomatis menjalankan `prisma generate` sebelum `next build`.
Jika Anda melakukan perubahan skema database di masa mendatang, jalankan perintah berikut dari lokal ke Neon:

```bash
npx prisma db push
# atau
npx prisma migrate deploy
```

---

## 4. Alur Pengujian End-to-End (UAT)

1. **Pendaftaran AI Academy (`/daftar/ai-academy`):**
   - Isi formulir pendaftaran peserta (Nama, WhatsApp `08xx`, Email, Instansi).
   - Klik **"Lanjut ke Instruksi Pembayaran"**.
   - Salin nomor rekening &amp; nominal tepat, lalu unggah bukti transfer.
   - Status otomatis berubah menjadi `VERIFYING_PROOF` dan dialihkan ke `/status/[orderCode]`.

2. **Pemesanan Proyek B2B (`/order` &amp; `/pay/[token]`):**
   - Buka `/order?unit=webtech` (atau unit lainnya).
   - Pilih paket dan kirim spesifikasi proyek.
   - Tiket pesanan terbit (`KK-B2B-YYYYMM-XXXX`) dengan status awal `LOCKED_WAITING_DP`.
   - Buka tautan Portal Klien `/pay/[token]` untuk melihat rincian kontrak, status gembok eksekusi, serta mencetak invoice A4.

3. **Pengesahan Cepat oleh CFO (`/admin/payment-queue`):**
   - Buka `/admin/payment-queue` di HP / Laptop Novita atau Alfatih.
   - Masukkan PIN CFO: `192837`.
   - Klik **"Verifikasi Sekarang"** pada baris pesanan untuk membuka `<CfoVerificationModal />`.
   - Pratinjau bukti transfer, cocokkan nominal, centang konfirmasi cek mutasi m-banking BSI, lalu klik **"Sahkan Pembayaran &amp; Buka Layanan"**.
   - Sistem secara otomatis dalam transaksi:
     - Mengubah status ke `DP_50_VERIFIED` (B2B) atau `PAID_100_VERIFIED` (AI Academy).
     - Menambah progres kas `GraduationRuleMeter` menuju target Rp3.500.000.
     - Mencatat jejak permanen ke `OrderAuditLog`.
     - Mengirimkan pesan notifikasi WhatsApp jika token terpasang.

4. **Instant Fulfillment (`/status/[orderCode]`):**
   - Klien yang membuka kembali `/status/[orderCode]` otomatis melihat kotak layanan terbuka dengan akses langsung ke Grup WhatsApp, Zoom Meet, dan berkas materi/master.
