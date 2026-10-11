# StudentJob Platform

Production-style MVP platform for students, employers, and admins.

## Features
- Landing page with advanced startup-style UI
- Job search and category filtering
- Student login and registration
- Employer login and job publishing
- Admin dashboard role
- Simple API for jobs, auth, dashboard stats, and applications
- Local JSON storage for demo use

## Demo accounts
- Student: student@example.com / 123456
- Employer: employer@example.com / 123456
- Admin: admin@example.com / 123456

## Run locally

1. Backend:
```bash
cd backend
npm install
npm run dev
```

2. Frontend:
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

3. Open the frontend URL shown in terminal, usually:
```text
http://localhost:5173
```

## API Endpoints
- GET /api/health
- GET /api/jobs
- GET /api/stats
- POST /api/register
- POST /api/login
- POST /api/jobs
- POST /api/jobs/:id/apply

## Notes
This app is production-oriented in structure and feature coverage, but still intentionally uses local JSON storage for easy demo deployment and onboarding. It is ready to be upgraded with PostgreSQL, Stripe, deploy automation, and role-based employer/admin modules.
