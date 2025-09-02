# SWOT Coach App

SWOT Coach is a personal growth and productivity app that helps users strengthen their **Strengths**, overcome **Weaknesses**, channel **Opportunities**, and avoid **Threats**.  
The app automatically generates daily, weekly, and long-term tasks to help users track habits and build consistency over time.

## ✨ Features
- Email + password authentication (no email verification required at signup)
- Identify and track personal SWOT (Strengths, Weaknesses, Opportunities, Threats)
- Auto-generate daily task lists from SWOT data
- Immutable daily tasks (cannot move unfinished tasks to the next day)
- Weekly progress tracking and streaks
- Mobile-first design with internationalization
- Email-only notifications
- Built with **Next.js + ShadCN + TypeScript** (frontend) and **Django + DRF** (backend)

## 🛠️ Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, ShadCN UI
- **Backend:** Django 5, Django REST Framework
- **Database:** PostgreSQL
- **Auth:** SessionID + CSRF
- **Jobs:** Django management command / Celery for nightly task generation

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/swot-coach.git
cd swot-coach
