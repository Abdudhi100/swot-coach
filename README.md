# 🌱 SWOT Coach

**SWOT Coach** is a web and mobile-first application designed to help users identify their **Strengths, Weaknesses, Opportunities, and Threats (SWOT)**. From these inputs, the system automatically generates **daily tasks**, tracks progress, and builds long-term habits over time.

---

## 🚀 Tech Stack

* **Frontend**: [Next.js](https://nextjs.org/) + [shadcn/ui](https://ui.shadcn.com/) + TypeScript + Tailwind CSS
* **Backend**: [Django](https://www.djangoproject.com/) + [Django REST Framework](https://www.django-rest-framework.org/)
* **Database**: PostgreSQL
* **Auth**: Django session + CSRF-based authentication
* **Background Jobs**: Django Q / Celery for nightly task generation
* **Notifications**: Email (SMTP, SendGrid, or similar)
* **Hosting**: (Planned) Vercel (frontend) + Render/Heroku (backend)

---

## ✨ Features

* 🔑 **Authentication**

  * Register/login/logout with session-based auth
  * Password reset with email verification

* 📝 **SWOT Inputs**

  * Add strengths, weaknesses, opportunities, and threats
  * Each input tied to daily/weekly/monthly/quarterly task generation

* 📅 **Task Generation**

  * Nightly job creates the next day’s tasks
  * Tasks cannot be edited for past days
  * Unfinished tasks don’t carry over

* ✅ **Task Management**

  * States: *pending* or *done*
  * Mark tasks as completed directly from the dashboard

* 🔥 **Tracking & Streaks**

  * Weekly progress tracking
  * Streaks count daily completions
  * Metrics validated for accuracy

* 📧 **Notifications**

  * Daily reminders or weekly summaries via email

---

## 📂 Project Structure

```
swot-coach/
│── backend/        # Django + DRF project
│   ├── core/       # Models, views, serializers, tasks
│   └── ...
│
│── frontend/       # Next.js + TypeScript app
│   ├── app/        # Pages (login, dashboard, swot, progress)
│   └── components/ # shadcn/ui components
│
│── docs/           # Documentation (build plan, roadmap)
│── README.md
```

---

## ⚙️ Installation

### 1. Clone the repo

```bash
git clone https://github.com/your-username/swot-coach.git
cd swot-coach
```

### 2. Backend Setup (Django + DRF)

```bash
cd backend
python -m venv env
source env/bin/activate   # on Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup (Next.js + TypeScript)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://127.0.0.1:8000`

---

## 🛠 API Endpoints (Backend)

* `POST /api/auth/register/` → Register user
* `POST /api/auth/login/` → Login
* `POST /api/auth/logout/` → Logout
* `POST /api/auth/reset-password/` → Password reset
* `GET /api/swot/` → CRUD SWOT items
* `GET /api/tasks/` → List today’s tasks
* `POST /api/tasks/<id>/done/` → Mark task done
* `GET /api/streak/` → Fetch streak stats

---

## 🗓 Development Roadmap

* **Phase 1**: Project setup (Django + Next.js)
* **Phase 2**: Authentication system
* **Phase 3**: Core models & APIs (User, SWOTItem, Task, Streak)
* **Phase 4**: Nightly task generation (Django Q / Celery)
* **Phase 5**: Frontend pages (auth, dashboard, swot, progress)
* **Phase 6**: Email notifications (daily/weekly)
* **Phase 7**: Mobile-first polish + i18n groundwork + deployment

---

## 📌 Future Plans

* Monetization (subscription tiers, premium features)
* Mobile app wrapper (React Native or Expo)
* Advanced analytics and insights
* Community features

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License**.

---
