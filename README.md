# DokuIn Project

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)
![Status](https://1img.shields.io/badge/Status-Development-orange)

---

![Logo](/logo.png)

---

DokuIn Project adalah aplikasi berbasis **frontend** dan **backend** yang dibuat untuk pengembangan sistem web modular dan mudah dikembangkan.

## 📁 Struktur Project

```bash
DokuIn_Project/
├── frontend/              # Aplikasi client (UI)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/               # API / server
│   ├── src/
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ✨ Fitur Utama

- Struktur project terpisah antara frontend dan backend
- Konfigurasi environment yang aman (`.env` tidak di-commit)
- Siap untuk pengembangan lanjutan dan deployment

---

## 🧰 Tech Stack

- **JavaScript**
- **CSS**
- **HTML**
- **Node.js + npm**
- **GitHub**

---

## ✅ Prasyarat

Pastikan perangkatmu sudah terpasang:

- Node.js (disarankan v18+)
- npm
- Git

Cek versi:

```bash
node -v
npm -v
git --version
```

---

## ⚙️ Instalasi

Clone project:

```bash
git clone https://github.com/UUbayS/DokuIn_Project.git
cd DokuIn_Project
```

Install dependency frontend & backend:

```bash
cd frontend
npm install
cd ../backend
npm install
cd ..
```

---

## 🔐 Konfigurasi Environment

Masuk folder backend lalu copy `.env.example` jadi `.env`:

```bash
cd backend
cp .env.example .env
```

Untuk Windows CMD:

```bat
copy .env.example .env
```

Isi variabel sesuai kebutuhan lokal kamu.

Contoh:

```env
NODE_ENV=development
APP_PORT=3000
APP_URL=http://localhost:3000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

JWT_SECRET=replace_with_strong_secret
```

---

## ▶️ Menjalankan Project

### 1. Jalankan Backend
```bash
cd backend
npm run dev
```

### 2. Jalankan Frontend (terminal baru)
```bash
cd frontend
npm run dev
```

---

## 📜 Scripts

### Frontend
```bash
npm run dev
npm run build
npm run preview
```

### Backend
```bash
npm run dev
npm run start
```

---

## 🌐 API Endpoint (Contoh)

> Sesuaikan dengan backend kamu

- `GET /api/health` → cek status server
- `POST /api/auth/login` → login
- `GET /api/users` → ambil data user

---

## 🛡️ Security Notes

Pastikan `.gitignore` punya ini:

```gitignore
# dependencies
node_modules/
**/node_modules/

# env files
.env
.env.*
!.env.example
```

Checklist:
- Jangan commit file `.env`
- Jangan taruh secret di frontend
- Jika secret pernah kepush, segera rotate

---

## 🧪 Troubleshooting

### `npm install` gagal
```bash
rm -rf node_modules package-lock.json
npm install
```

Windows CMD:
```bat
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Port bentrok (`EADDRINUSE`)
- Ganti port di `.env`
- Atau matikan proses yang pakai port

### Frontend tidak konek backend
- Cek `API_BASE_URL`
- Cek CORS backend
- Pastikan backend aktif

---

## 🤝 Kontribusi

1. Fork repo
2. Buat branch fitur:
   ```bash
   git checkout -b feat/nama-fitur
   ```
3. Commit:
   ```bash
   git commit -m "feat: tambah fitur"
   ```
4. Push:
   ```bash
   git push origin feat/nama-fitur
   ```
5. Buat Pull Request

---

## 👤 Author

**UUbayS**  
GitHub: [@UUbayS](https://github.com/UUbayS)

