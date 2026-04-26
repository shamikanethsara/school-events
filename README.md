# 🏫 Royal Events — School Event Management Platform
> BTUI 2025 · ARMITAGE Web Development Competition

A full-stack school event hub with announcements, interactive calendar, countdowns, and online registration/ticketing.

---

## 🗂 Project Structure

```
school-events/
├── backend/          # FastAPI + PostgreSQL
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── routes/
│   │   ├── events.py
│   │   ├── registrations.py
│   │   └── announcements.py
│   ├── requirements.txt
│   └── render.yaml
└── frontend/         # React + Vite + Tailwind CSS
    ├── src/
    │   ├── App.jsx
    │   ├── api/index.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── EventCard.jsx
    │   │   └── Countdown.jsx
    │   └── pages/
    │       ├── Home.jsx
    │       ├── Events.jsx
    │       ├── EventDetail.jsx
    │       ├── Calendar.jsx
    │       ├── Announcements.jsx
    │       └── Admin.jsx
    └── ...config files
```

---

## 🚀 Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt

# Create a local .env file
echo "DATABASE_URL=postgresql://user:password@localhost/schoolevents" > .env

# Run
uvicorn main:app --reload
# API runs at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install

# Copy env and set your backend URL
cp .env.example .env.local
# Edit .env.local → VITE_API_URL=http://localhost:8000

npm run dev
# Runs at http://localhost:5173
```

---

## ☁️ Deployment (Free)

### Step 1 — Deploy Backend to Render

1. Push the `backend/` folder to a GitHub repository
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add a **PostgreSQL** database on Render (free tier)
6. Add environment variable: `DATABASE_URL` → copy from your Render DB

### Step 2 — Deploy Frontend to Vercel

1. Push the `frontend/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import repo
3. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://school-events-api.onrender.com`)
4. Deploy!

---

## ✨ Features

| Feature | Status |
|---|---|
| Home page with hero + stats | ✅ |
| Event listings with filters | ✅ |
| Event detail page | ✅ |
| Countdown timer | ✅ |
| Online registration + ticket code | ✅ |
| Interactive calendar | ✅ |
| Announcements with priority | ✅ |
| Admin panel (create/delete) | ✅ |
| Responsive design | ✅ |
| FastAPI backend | ✅ (bonus) |
| PostgreSQL database | ✅ (bonus) |

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, date-fns
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, Pydantic
- **Hosting:** Vercel (frontend) + Render (backend + DB)
