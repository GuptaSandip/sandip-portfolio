"""
Pinecone Knowledge Base Seeder
================================
Run this ONCE to populate your Pinecone index with Sandip's info.
Your index uses 384 dimensions — we use all-MiniLM-L6-v2 which produces exactly that.

Usage:
  cd backend
  uv run python seed_pinecone.py
"""

import os
from dotenv import load_dotenv

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_INDEX   = os.getenv("PINECONE_INDEX", "sandip-portfolio")

if not PINECONE_API_KEY:
    print("❌ PINECONE_API_KEY not set in .env")
    exit(1)

print("Loading sentence-transformers model (all-MiniLM-L6-v2 → 384 dim)...")
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone

model = SentenceTransformer("all-MiniLM-L6-v2")

# ── Knowledge chunks about Sandip ─────────────────────────────
CHUNKS = [
    {
        "id":   "bio_001",
        "text": "Sandip Gupta is an AI Engineer and Master Trainer based in India. He currently works as a Master Trainer (April 2025 – Present) in Edunet Foundation after previously serving as an Associate Trainer in Data Science and AI (Sep 2024 – Apr 2025) and a Data Science Trainer (Aug 2023 – Sep 2024).",
    },
    {
        "id":   "bio_002",
        "text": "Sandip builds production-grade AI applications using LLMs, Agentic AI frameworks, and modern AI tools. He specializes in LangChain, LlamaIndex, OpenAI API, Groq, and HuggingFace. He also teaches others to build and think in AI.",
    },
    {
        "id":   "skills_001",
        "text": "Sandip's technical expertise covers: Python (expert), Data Science, Machine Learning, Deep Learning, Generative AI, Agentic AI systems, RAG (Retrieval-Augmented Generation), LangChain, LlamaIndex, FastAPI, Streamlit, Scikit-learn, TensorFlow, PyTorch, Pandas, NumPy.",
    },
    {
        "id":   "skills_002",
        "text": "Sandip's infrastructure and database skills include: PostgreSQL, Supabase, Pinecone (vector database), Docker, Git, GitHub Actions. He builds full-stack AI applications with FastAPI backends and React frontends.",
    },
    {
        "id":   "work_001",
        "text": "As a Master Trainer, Sandip leads advanced AI and ML training programs. He mentors cohorts on LLMs, Agentic AI, RAG systems, and production-grade AI engineering. He has trained over 2000 students across various cohorts and workshops.",
    },
    {
        "id":   "contact_001",
        "text": "Sandip Gupta is open to select freelance and consulting opportunities in AI/ML, though he is currently employed full-time. Interested parties can share their name, email, and project details. GitHub: https://github.com/GuptaSandip. LinkedIn: https://www.linkedin.com/in/sandip-gupta11/. Twitter/X: https://x.com/guptasandip11. HuggingFace: https://huggingface.co/guptasandip.",
    },
    {
        "id":   "projects_001",
        "text": "Sandip builds real-world AI projects including: agentic portfolio chatbots using Groq and RAG, LLM-powered document Q&A systems with LlamaIndex, multi-agent orchestrators with LangChain, ML pipelines with Streamlit dashboards, and Gen AI content generation platforms.",
    },
    {
        "id":   "teaching_001",
        "text": "Sandip Gupta teaches Data Science, Machine Learning, and AI to students and professionals. His teaching covers Python programming, ML fundamentals, deep learning, generative AI, building with LLMs, and deploying AI systems to production.",
    },
    {
        "id":   "experience_001",
        "text": "Sandip's career timeline: Data Science Trainer (Aug 2023 – Sep 2024), Associate Trainer – Data Science & AI (Sep 2024 – Apr 2025), Master Trainer (Apr 2025 – Present). He has over 2 years of experience in AI training and education.",
    },
]

def main():
    print(f"Connecting to Pinecone index: {PINECONE_INDEX}...")
    pc    = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(PINECONE_INDEX)

    # Check index stats
    stats = index.describe_index_stats()
    print(f"Index stats: {stats}")

    print(f"\nEmbedding {len(CHUNKS)} knowledge chunks...")
    texts      = [c["text"] for c in CHUNKS]
    embeddings = model.encode(texts, show_progress_bar=True)

    print(f"\nEmbedding shape: {embeddings.shape}")  # Should be (N, 384)
    assert embeddings.shape[1] == 384, f"Expected 384 dims, got {embeddings.shape[1]}"

    vectors = [
        {
            "id":       chunk["id"],
            "values":   emb.tolist(),
            "metadata": {"text": chunk["text"]},
        }
        for chunk, emb in zip(CHUNKS, embeddings)
    ]

    print(f"\nUpserting {len(vectors)} vectors to Pinecone...")
    index.upsert(vectors=vectors)

    print("\n✅ Done! Pinecone knowledge base seeded successfully.")
    print(f"   Index now has {index.describe_index_stats()['total_vector_count']} vectors.")
    print("\nYour chatbot will now use RAG to answer questions about Sandip accurately.")


if __name__ == "__main__":
    main()