# DokuIn Project

DokuIn Project is a full-stack web application organized into separate **backend** and **frontend** apps.

## Project Structure

```text
DokuIn_Project/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── migrateData.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── README.md
└── package.json
```

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express (based on backend structure and server layout)
- **Other:** ESLint configuration in frontend, environment-based backend config

## Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node.js)

## Installation

From the repository root:

```bash
# Install root dependencies (if used)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Environment Variables

A `.env` file exists in `backend/`.  
Create or update `backend/.env` with your local values (example):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Adjust variable names to match what your backend actually expects.

## Run the Project

Use two terminals:

### 1) Start Backend

```bash
cd backend
npm start
```

(If your backend uses a dev script, you can use `npm run dev` instead.)

### 2) Start Frontend

```bash
cd frontend
npm run dev
```

Frontend typically runs on Vite default (`http://localhost:5173`) unless changed.

## Data Migration

A migration script is present:

```bash
cd backend
node migrateData.js
```

Use this only when you need to seed/migrate data.

## Linting (Frontend)

```bash
cd frontend
npm run lint
```

## Notes

- The repository currently includes `node_modules` directories, which are usually excluded from version control.
- Consider adding a root `.gitignore` to prevent committing dependencies and environment files.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

## License

Add your license information here (e.g., MIT).