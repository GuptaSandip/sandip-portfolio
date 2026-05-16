# 🚀 AI-Driven Professional Portfolio | Sandip Gupta

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://sandipgupta.is-a.dev)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![AI-Powered](https://img.shields.io/badge/AI-Llama3--Powered-blue?style=for-the-badge&logo=meta)](https://groq.com/)

A modern, high-performance full-stack portfolio built for an **AI Engineer & Master Trainer**. This project features a RAG-based AI assistant, a secure administrative control panel, and a dynamic frontend with fluid animations.

---

## ✨ Key Features

### 🤖 Intelligent Agentic AI Assistant (RAG) - Chatbot
- **Engine**: Powered by **Llama 3 (Groq API)** for ultra-fast inference.
- **Context Awareness**: Uses **Pinecone Vector Database** for Retrieval-Augmented Generation (RAG), allowing the AI to answer questions specifically about my work, courses, and technical expertise.
- **Consultative Flow**: Designed to guide users from general curiosity to professional collaboration.

### 🔐 Administrative Control Panel
- **Full CRUD**: Manage projects, tech stack, achievements, and course enrollments in real-time.
- **Media Management**: Integrated with **Supabase Storage** for seamless image and file uploads.
- **Analytics**: Built-in monitoring for leads and user inquiries.

### 🎨 Premium User Experience
- **Fluid UI**: Built with **React** and **Framer Motion** for glassmorphic design and subtle micro-animations.
- **Dynamic Content**: Every section (Bio, Skills, Projects) is synced with the backend via RESTful APIs.
- **SEO Optimized**: Fully responsive design with metadata optimization for search engines.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS / Vanilla CSS (Modern UI)
- **Animations**: Framer Motion, Lucide Icons
- **State Management**: React Context API & Hooks

### Backend
- **Core**: Python (FastAPI)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens) with secure password hashing
- **Task Scheduling**: Python-based automation for lead management

### AI / Data Layer
- **LLM**: Meta Llama 3 (via Groq)
- **Embeddings**: HuggingFace Inference API
- **Vector DB**: Pinecone (for RAG storage)
- **Real-time Notifications**: Pushover API integration

---

## 🏗️ Project Architecture

```mermaid
graph TB
    subgraph Client_Side [User Interface - Vercel]
        UI[React Frontend]
        Chat[Agentic AI Chatbot]
        AdminPanel[Admin Dashboard]
    end

    subgraph Server_Side [Backend API - Render]
        FastAPI[FastAPI Main App]
        Auth[JWT Authentication]
        RAG[RAG Logic Engine]
        Notify[Pushover Service]
    end

    subgraph Data_AI_Layer [Data & Intelligence]
        Supabase[(Supabase PostgreSQL)]
        S3[Supabase Storage - Images]
        Pinecone[(Pinecone Vector DB)]
        Groq[Groq - Llama 3.3]
        HF[HuggingFace Embeddings]
    end

    %% User Interactions
    UI -->|HTTPS Requests| FastAPI
    Chat -->|Streaming Text| FastAPI
    AdminPanel -->|Protected CRUD| Auth
    Auth -->|Token Verification| FastAPI

    %% Backend AI Workflow
    FastAPI -->|Query| HF
    HF -->|Vector Embedding| RAG
    RAG -->|Similarity Search| Pinecone
    Pinecone -->|Context Data| RAG
    RAG -->|Full Prompt| Groq
    Groq -->|Generated Response| Chat

    %% Data Flows
    FastAPI -->|Dynamic Content| Supabase
    AdminPanel -->|Image Uploads| S3
    FastAPI -->|Lead Capture| Notify
    FastAPI -->|Lead Storage| Supabase

    %% Styling
    style UI fill:#61dafb,stroke:#333,stroke-width:2px
    style FastAPI fill:#009688,stroke:#333,stroke-width:2px
    style Groq fill:#f39c12,stroke:#333,stroke-width:2px
    style Supabase fill:#3ecf8e,stroke:#333,stroke-width:2px
    style Pinecone fill:#000000,color:#fff,stroke:#333,stroke-width:2px

```
______________________________________________________________________________________________________________________________________________________________________________
```mermaid
graph TD
    User((User)) -->|HTTPS| Vercel[Frontend - Vercel]
    Vercel -->|API Calls| Render[Backend - Render]
    Render -->|CRUD| Supabase[(Supabase - DB & Auth)]
    Render -->|Query| Pinecone[(Pinecone - Vector Search)]
    Render -->|Inference| Groq[Groq API - Llama 3]
    Admin((Admin)) -->|Manage| Vercel
```
### 👨‍💻 About the Author
I am Sandip Gupta, a Master Trainer in Data Science and AI Engineer. I specialize in building end-to-end AI solutions, from custom RAG pipelines to scalable web architectures.

- Portfolio: sandipgupta.is-a.dev
- LinkedIn: sandip-gupta11
- Twitter: @guptasandip11

### 📄 License
This project is MIT licensed. 
Feel free to use it as a template for your own portfolio!
