# DokuIn Project

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)

---

![Logo](/logo.png)

---

DokuIn Project is a frontend and backend based application built for the development of modular and easily scalable web systems.

## 📁 Project Structure

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

## ✅ Prerequisites

- Node.js v18+
- npm
- Git

---

## ⚙️ Installation

```bash
git clone https://github.com/UUbayS/DokuIn_Project.git
cd DokuIn_Project
npm run install:all
```

---

## ▶️ Running the Project

### Run frontend + backend together
```bash
npm start
```

### Run separately (optional)

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

In the `backend` folder, create `.env` from `.env.example`:

```bash
cd backend
cp .env.example .env
```

Windows CMD:
```bat
copy .env.example .env
```

Fill in the secret variables according to local needs.

---

## 🤝 Contribution

1. Create branch:
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
4. Open Pull Request

---