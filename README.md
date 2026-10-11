# StudentJob Platform

MVP web application for student jobs and internships.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Data: in-memory JSON storage

## Run locally

1. Open two terminals.
2. Backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev -- --host 0.0.0.0
   ```
4. Open the frontend URL shown in the terminal, usually http://localhost:5173

## API
- GET /api/health
- GET /api/jobs
- POST /api/register
- POST /api/login

## Default demo account
- Email: student@example.com
- Password: 123456

## Notes
This project is a functional MVP for a student job platform. It is ready for extension with database, authentication, employer dashboards, and real employer data.
