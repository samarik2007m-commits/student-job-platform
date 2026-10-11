# StudentJob Platform

Commercial MVP for hiring students and internships with monetization, employer accounts, and role management.

## Features
- landing page for startup-like marketplace
- student login and account system
- employer account with job publishing
- admin role and dashboard
- multi-tier pricing model
- job search and category filtering
- application flow for students
- local JSON storage for demo deployment

## Demo accounts
- Student: student@example.com / 123456
- Employer: employer@example.com / 123456
- Admin: admin@example.com / 123456

## Run locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Open: http://localhost:5173

## Main routes
- GET /api/health
- GET /api/jobs
- GET /api/plans
- GET /api/stats
- POST /api/register
- POST /api/login
- POST /api/subscriptions/activate
- POST /api/jobs
- POST /api/jobs/:id/apply
- GET /api/jobs/:id/applicants

## Notes
This version is structured as a commercial MVP and is intentionally built with easy local storage for quick onboarding. It is ready to be upgraded with PostgreSQL, Stripe, email notifications, and a production deploy pipeline.
