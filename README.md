# DokuIn Project

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)

---

![Logo](/logo.png)

---

DokuIn Project adalah aplikasi berbasis **frontend** dan **backend** yang dibuat untuk pengembangan sistem web modular dan mudah dikembangkan.

## 📁 Struktur Project

```bash
DokuIn_Project/
├── assets/
│   ├── home.png
│   ├── login.png
│   └── dashboard.png
├── backend/
├── frontend/
├── package.json
├── .gitignore
└── README.md
```

---

## 🧰 Tech Stack

- JavaScript
- CSS
- HTML
- Node.js + npm
- Cloudinary (media storage)
- pdf-lib (PDF processing)


---

## ✅ Prasyarat

- Node.js v18+
- npm
- Git

---

## ⚙️ Instalasi

```bash
git clone https://github.com/UUbayS/DokuIn_Project.git
cd DokuIn_Project
npm run install:all
```

---

## ▶️ Menjalankan Project

### Jalankan frontend + backend bersamaan
```bash
npm start
```

### Jalankan terpisah (opsional)

Backend:
```bash
npm run backend
```

Frontend:
```bash
npm run frontend
```

---

## 🔐 Environment Setup

Di folder `backend`, buat `.env` dari `.env.example`:

```bash
cd backend
cp .env.example .env
```

Windows CMD:
```bat
copy .env.example .env
```

Isi variabel rahasia sesuai kebutuhan lokal.

---

## 🤝 Kontribusi

1. Buat branch:
   ```bash
   git checkout -b feat/nama-fitur
   ```
2. Commit:
   ```bash
   git commit -m "feat: tambah fitur"
   ```
3. Push:
   ```bash
   git push origin feat/nama-fitur
   ```
4. Buka Pull Request

---