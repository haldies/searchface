# Frontend Environment Configuration

File ini berisi konfigurasi environment untuk frontend React + Vite.

## Setup

1. **Copy file example:**
   ```bash
   cp .env.example .env
   ```

2. **Update URL Backend:**
   Edit file `.env` dan ganti dengan URL Cloudflare Tunnel backend Anda:
   ```env
   VITE_API_BASE_URL=https://your-backend-tunnel.trycloudflare.com/api
   ```

## Environment Variables

### `VITE_API_BASE_URL`
URL base untuk backend API. 

**Format:** `https://domain.com/api` (tanpa trailing slash)

**Contoh:**
- Development: `http://localhost:5000/api`
- Production (Tunnel): `https://your-tunnel.trycloudflare.com/api`

## Catatan Penting

- **Prefix `VITE_`**: Semua environment variable di Vite harus diawali dengan `VITE_` agar bisa diakses di browser.
- **Restart Dev Server**: Setelah mengubah `.env`, restart dev server (`pnpm run dev`) agar perubahan diterapkan.
- **Security**: File `.env` sudah ditambahkan ke `.gitignore` untuk mencegah commit credentials.

## Troubleshooting

### Variable tidak terbaca?
1. Pastikan nama variable diawali dengan `VITE_`
2. Restart dev server
3. Cek console browser: `console.log(import.meta.env.VITE_API_BASE_URL)`

### CORS Error?
Pastikan URL di `.env` sama persis dengan URL backend yang sedang berjalan (termasuk protocol `https://` atau `http://`).
