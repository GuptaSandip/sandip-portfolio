# Sandip Gupta — AI Portfolio Website

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://sandipgupta.is-a.dev)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![AI Powered](https://img.shields.io/badge/AI-Llama3%20%2B%20Pinecone-blue?style=for-the-badge&logo=meta)](https://groq.com/)

A polished, professional portfolio for an **AI Engineer & Master Trainer**. This full-stack project combines a modern frontend, a secure admin dashboard, and an AI-driven chatbot powered by RAG.

---

## ✨ Project Overview

This repository delivers a complete personal branding site with a strong focus on AI, performance, and usability.

- **Public-facing portfolio** with responsive sections for about, skills, projects, experience, and contact.
- **Admin management system** for updating portfolio content in real time.
- **RAG chatbot** designed to answer visitor questions using your portfolio knowledge base.
- **Modern, responsive design** with motion effects and polished UI components.
- **Deployment-ready structure** for frontend and backend hosting.

---

## 🚀 Key Features

### AI-Powered Portfolio Chatbot
- Retrieval-Augmented Generation via **Pinecone** and **Groq Llama 3**.
- Answers questions using portfolio content, project details, and professional experience.
- Enables intelligent conversations tailored to visitors.

### Admin Dashboard
- Secure CRUD interface for projects, achievements, courses, and tech stack.
- Upload media assets through **Supabase Storage**.
- Manage leads and contact messages from an admin console.

### Frontend Experience
- Built with **React + Vite** for speed and developer productivity.
- Responsive layout optimized for desktop, tablet, and mobile.
- Smooth transitions and subtle animations using **Framer Motion**.
- Clean navigation with scroll-linked section anchors.

### Backend Architecture
- **FastAPI** backend serving secure REST APIs.
- **Supabase PostgreSQL** for data storage and authentication.
- JWT-based admin authentication.
- Structured API endpoints for consistent frontend integration.

---

## 🧰 Technology Stack

Frontend:
- React
- Vite
- Tailwind CSS / Vanilla CSS
- Framer Motion
- Lucide Icons
- React Router

Backend:
- Python 3
- FastAPI
- Supabase
- JWT Authentication
- Pydantic models

AI & Data:
- Groq Llama 3
- HuggingFace embeddings
- Pinecone vector DB
- Supabase Storage

---

## 📁 Repository Structure

- `frontend/` — React application with public site and admin panel.
- `backend/` — FastAPI backend with authentication, portfolio APIs, and chatbot endpoints.
- `supabase/` — Database schema and migration scripts.
- `plan.txt` — Project notes and roadmap.

---

## ⚙️ Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/GuptaSandip/sandip-portfolio.git
cd sandip-portfolio
```

### 2. Backend setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

### 4. Run locally
```bash
cd ../backend
uvicorn app.main:app --reload --port 8000
```

```bash
cd ../frontend
npm run dev
```

---

## 🧩 Architecture Summary

This project separates responsibilities across three main layers:

1. **Frontend** renders the portfolio website and admin experience.
2. **Backend** handles authentication, data APIs, and AI orchestration.
3. **AI/Data layer** uses **Pinecone** and **Groq** for contextual chatbot responses.

---

## 🌐 Deployment

- Frontend is optimized for deployment on **Vercel**.
- Backend can be deployed to any FastAPI-compatible host.
- Supabase manages the database, authentication, and media storage.

---

## 👤 About Sandip Gupta
Sandip is an AI engineer and master trainer building intelligent, production-ready applications for data-driven businesses.

- Portfolio: https://sandipgupta.is-a.dev
- LinkedIn: https://www.linkedin.com/in/sandipgupta-ai/

---

## 📄 License
This project is available under the MIT License.
