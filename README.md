# Aido Care — Web Application Frontend

A modern, responsive healthcare consultation and management web application built for patients and doctors, featuring real backend full-stack integration for appointments, doctor directory, and clinical records.

- **Live Frontend:** [https://calvinapriliohariyanto.github.io/aidocare-app/](https://calvinapriliohariyanto.github.io/aidocare-app/)
- **Live Backend API:** [https://aidocare-backend-production.up.railway.app](https://aidocare-backend-production.up.railway.app/)
- **Repository:** [https://github.com/CalvinAprilioHariyanto/aidocare-app](https://github.com/CalvinAprilioHariyanto/aidocare-app)

---

## 👥 Team Members

- **Calvin Aprilio Hariyanto** (`calvinuphstudent@gmail.com`)
- **SirImro / Glenn** (`rawglennvids@gmail.com`)
- **Euro William Wijaya** (`eurowijaya123@gmail.com`)

---

## 🛠️ Technology Stack

- **Framework / Runtime:** React 19, Vite 8
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Language:** JavaScript (ES modules)
- **Quality & Linting:** ESLint 10

---

## 🚀 Key Features & Full-Stack Integration

- **Authentication & Roles:** JWT authentication with role-based routing (`/patient` and `/doctor`), auto-attaching bearer tokens to API requests.
- **Doctor Directory (`/patient/find-doctor` & `/patient/doctors/:id`):** Connected to backend `GET /api/doctors` and `GET /api/doctors/:id`, displaying real doctor profiles, specialties, bios, and computed working slot availability with loading, empty, and error states.
- **Appointments (`/patient/appointments` & `/patient/appointments/book`):** Fully integrated with backend `POST /api/appointments`, `GET /api/appointments`, `GET /api/appointments/:id`, and `PATCH /api/appointments/:id`. Backed by PostgreSQL transactions with concurrency/conflict prevention, past date rejection, cancellation, and rescheduling.
- **Doctor Working Schedule (`/doctor/schedule`):** Connected to `GET /api/doctor/schedules` and `GET /api/appointments`, displaying registered weekly working hours and scheduled consultations in real time.
- **Medical Records & Prescriptions (`/doctor/patients/:id` & `/doctor/records`):** Connected to `GET /api/patients/:id/records`, `POST /api/patients/:id/records`, and `PATCH /api/patients/:id/records/:recordId`, persisting clinical records, diagnoses, and prescriptions directly into PostgreSQL.
- **Doctor Account & Patient Health Profile:** Settings pages connected to `/api/doctor/account` and `/api/patient/profile`.

---

## ⚙️ Prerequisites & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation
```bash
git clone https://github.com/CalvinAprilioHariyanto/aidocare-app.git
cd aidocare-app
npm install
```

### Environment Configuration
Create a `.env` file in the root directory based on `.env.example`:
```env
# Point to local backend during development
VITE_API_URL=http://localhost:3000

# Or point to production Railway backend:
# VITE_API_URL=https://aidocare-backend-production.up.railway.app
```

---

## 📜 Available Scripts

- `npm run dev`: Starts the local development server at `http://localhost:5173`.
- `npm run build`: Bundles the application for production inside the `dist/` folder.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code style and syntax issues across all source files.

---

## 🌐 Deployment

The frontend is deployed to GitHub Pages with the base URL `/aidocare-app/`.
Production builds are generated via Vite and pushed to the `gh-pages` deployment target.
