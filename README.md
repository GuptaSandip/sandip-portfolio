# Sandip Gupta — AI Portfolio Website

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://sandipgupta.is-a.dev)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![AI Powered](https://img.shields.io/badge/AI-Llama3%20%2B%20Pinecone-blue?style=for-the-badge&logo=meta)](https://groq.com/)

A polished, professional portfolio for an **AI Engineer & Master Trainer**. This full-stack project combines a modern frontend, a secure admin dashboard, and an AI-powered chatbot.

---

## ✨ Project Overview

This repository showcases a complete personal branding website with a strong focus on AI, frontend polish, and backend manageability.

- Responsive public portfolio with sections for about, skills, projects, experience, and contact.
- Admin dashboard for managing portfolio content, media, and inquiries.
- Retrieval-Augmented Generation (RAG) chatbot that answers questions from site data.
- Full-stack architecture engineered for deployment and scalability.

---

## 🚀 Key Features

### AI Portfolio Chatbot
- Context-aware responses using **Pinecone** and **Groq Llama 3**.
- Intelligent answers powered by portfolio content, project details, and professional expertise.
- Streamlined chat experience built for visitors and recruiters.

### Admin Dashboard
- Secure admin area with JWT-based authentication.
- Manage projects, achievements, courses, tech stack, and contact leads.
- Upload media assets using **Supabase Storage**.

### Frontend Experience
- Built with **React + Vite** for speed and developer productivity.
- Modern responsive design with smooth animations and subtle transitions.
- Clean navigation, mobile-friendly menu, and section-based scrolling.

### Backend Architecture
- **FastAPI** REST API powering content and AI endpoints.
- **Supabase PostgreSQL** for data storage and auth.
- Robust API structure for scalable content delivery.

---

## 🧰 Technology Stack

**Frontend**
- React
- Vite
- Tailwind CSS / Vanilla CSS
- Framer Motion
- Lucide Icons
- React Router

**Backend**
- Python 3
- FastAPI
- Supabase
- JWT Authentication
- Pydantic

**AI & Data**
- Groq Llama 3
- HuggingFace embeddings
- Pinecone vector DB
- Supabase Storage

---

## 🏗️ Architecture Diagrams

### Project Schema

```mermaid
graph LR
  A[Visitor / Admin] -->|Browser| B[React Frontend]
  B -->|API Requests| C[FastAPI Backend]
  C -->|CRUD / Content| D[Supabase PostgreSQL]
  C -->|Media Uploads| E[Supabase Storage]
  C -->|Vector Search| F[Pinecone]
  C -->|LLM Inference| G[Groq Llama 3]
  B -->|Static Assets| H[Vercel / Hosting]
  subgraph DataLayer [Data & AI]
    D
    E
    F
    G
  end
``` 

### Chatbot Workflow

```mermaid
graph TB
  U[User Question] -->|Send| FFE[Frontend Chat Widget]
  FFE -->|Request| API[FastAPI Chat Endpoint]
  API -->|Embed Query| HF[HuggingFace Embeddings]
  HF -->|Search| P[Pinecone Vector DB]
  P -->|Context| RAG[RAG Engine]
  RAG -->|Prompt| LLM[Groq Llama 3]
  LLM -->|Answer| API
  API -->|Response| FFE
  FFE -->|Render| U
``` 

---

## 📁 Repository Structure

- `frontend/` — React application with the public portfolio and admin interface.
- `backend/` — FastAPI application serving REST APIs, auth, and AI routes.
- `supabase/` — Supabase schema and migration scripts.
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

## 🌐 Deployment

- Frontend is ready for **Vercel** deployment.
- Backend can be deployed on any FastAPI-compatible host.
- Supabase manages database, auth, and media storage.

---

## 👤 About Sandip Gupta
Sandip is an AI engineer and master trainer building intelligent, production-ready applications for data-driven companies.

- Portfolio: https://sandipgupta.is-a.dev
- LinkedIn: https://www.linkedin.com/in/sandipgupta-ai/

---

## 📄 License
This project is licensed under the MIT License.
