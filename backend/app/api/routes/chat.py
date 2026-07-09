# chat.py
"""
backend/app/api/routes/chat.py
Agentic chatbot with:
- Groq LLM (llama-3.3-70b)
- RAG via Pinecone (384 dim, all-MiniLM-L6-v2)
- Agent tools: fetch_projects, lookup_resume, get_bio
- Lead capture + unknown question tracking
- Pushover notifications
"""

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel
from groq import AsyncGroq
import httpx
from app.core.config import settings
from app.core.supabase import get_supabase
import json, re, httpx

router  = APIRouter()
limiter = Limiter(key_func=get_remote_address)

async def get_hf_embedding(text: str) -> list:
    """Fetch embeddings from Hugging Face Inference API."""
    if not settings.HUGGINGFACE_API_KEY:
        return []
    
    api_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    headers = {"Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}"}
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(api_url, headers=headers, json={"inputs": text, "options": {"wait_for_model": True}})
            if response.status_code == 200:
                return response.json()
    except Exception as e:
        print(f"[HF Error] {e}")
    return []


# ── Build system prompt dynamically from DB ────────────────────
async def build_system_prompt() -> str:
    """Fetch live data from Supabase to build an up-to-date system prompt."""
    try:
        sb   = get_supabase()
        bio  = sb.table("bio").select("*").eq("id", 1).single().execute().data or {}
        proj = sb.table("projects").select("title,description,tech_tags,github_url,live_url").eq("is_visible", True).order("display_order").limit(10).execute().data or []
        tech = sb.table("tech_stack").select("name,category,level").eq("is_visible", True).order("display_order").execute().data or []

        try:
            kb = sb.table("chatbot_knowledge").select("content").eq("is_active", True).execute().data or []
            kb_text = "\n".join(f"- {k['content']}" for k in kb)
        except Exception:
            kb_text = ""

        project_list = "\n".join(
            f"  • {p['title']}: {p['description'][:100]}... | Tech: {', '.join(p.get('tech_tags', [])[:4])}"
            for p in proj
        ) or "  • Projects available on GitHub"

        tech_by_cat: dict = {}
        for t in tech:
            cat = t["category"]
            tech_by_cat.setdefault(cat, []).append(t["name"])
        tech_text = "\n".join(f"  {cat}: {', '.join(items)}" for cat, items in tech_by_cat.items())

        open_to_work = bio.get("is_open_to_work", True)

        prompt = f"""You are an intelligent AI assistant on Sandip Gupta's personal portfolio website.
Your persona is warm, knowledgeable, and professional — like a trusted colleague who knows Sandip very well.

## Who is Sandip Gupta?
- Name: {bio.get('name', 'Sandip Gupta')}
- Current Role: {bio.get('title', 'Master Trainer · AI Engineer')}
- Location: {bio.get('location', 'India')}
- Bio: {bio.get('about', 'AI Engineer and Master Trainer specializing in LLMs, Agentic AI, and Data Science.')}
- GitHub: {bio.get('github_url', 'https://github.com/GuptaSandip')}
- LinkedIn: {bio.get('linkedin_url', 'https://linkedin.com/in/sandip-gupta11/')}
- HuggingFace: {bio.get('huggingface_url', 'https://huggingface.co/guptasandip')}
- Twitter/X: {bio.get('twitter_url', 'https://x.com/guptasandip11')}
- Open to opportunities: {'Yes — selectively' if open_to_work else 'Not currently'}

## Career
- Master Trainer (Apr 2025 – Present)
- Associate Trainer – Data Science & AI (Sep 2024 – Apr 2025)
- Data Science Trainer (Aug 2023 – Sep 2024)
- 2000+ students trained

## Tech Stack
{tech_text or '  Python, LangChain, FastAPI, Groq, HuggingFace, Scikit-learn, TensorFlow'}

## Projects
{project_list}

## Custom Knowledge Base
{kb_text}

## Behaviour Rules
1. Always Greet user and always be polite to them as friend
2. Be warm and educational — mirror Sandip's trainer energy
3. Never make things up. If unsure, say so honestly
4. Never discuss salary, family/personal life, or politics
5. Generate messages or reply in struture format and ask details in proper format

## Handling work / freelance enquiries
When someone asks about hiring, working with, or collaboration:
1. Say Sandip is {'selectively open to interesting opportunities' if open_to_work else 'not taking new work right now'}
2. {'Ask for their name, email, phone, and what they have in mind' if open_to_work else 'Suggest connecting on LinkedIn for future opportunities'}
3. Once they share details, output on its own line (HIDDEN from user or chatbot):
   LEAD_CAPTURED:{{"name":"NAME","email":"EMAIL","phone":"PHONE_OR_EMPTY","context":"BRIEF_CONTEXT"}}
4. Tell them Sandip will reach out personally
5. If they don't provide details, politely ask again for their name, email, and context. but if they reject again or say thans or bye just polite say good bye to them and wich for the day.

## Unknown questions
If you genuinely don't know something specific:
- Say "I don't have that detail — but you can ask Sandip directly."
- Output on its own line (HIDDEN from user or chatbot):
  UNKNOWN_QUESTION:{{"question":"THE_QUESTION"}}

## What NOT to discuss
- Salary / compensation
- Personal / family life beyond what's listed
- Political or religious topics
"""
        return prompt

    except Exception:
        return """You are an AI assistant for Sandip Gupta's portfolio.
Sandip is an AI Engineer and Master Trainer specializing in LLMs, Agentic AI, Data Science.
Answer questions about his work warmly and concisely (2-4 sentences).
If asked about hiring/collaboration, ask for their contact details and output: LEAD_CAPTURED:{"name":"...","email":"...","phone":"...","context":"..."}
If you don't know something, say so and output: UNKNOWN_QUESTION:{"question":"..."}"""


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    session_id: str | None = None


@router.post("/")
@limiter.limit(f"{settings.CHAT_RATE_LIMIT_PER_HOUR}/hour")
async def chat(request: Request, body: ChatRequest):

    if not settings.GROQ_API_KEY:
        async def no_key():
            msg = "The chatbot is not configured yet. Please add GROQ_API_KEY to backend/.env and restart the server."
            yield f"data: {json.dumps({'text': msg})}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(no_key(), media_type="text/event-stream")

    system_prompt = await build_system_prompt()

    history  = body.messages[-6:]
    messages = [{"role": "system", "content": system_prompt}]
    messages += [{"role": m.role, "content": m.content} for m in history]

    if settings.PINECONE_API_KEY and history:
        try:
            rag = await _get_rag_context(history[-1].content)
            if rag:
                messages[0]["content"] += f"\n\n## Relevant Knowledge Base Context\n{rag}"
        except Exception:
            pass

    async def stream():
        full = ""
        try:
            client  = AsyncGroq(api_key=settings.GROQ_API_KEY)
            stream_ = await client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=messages,
                max_tokens=400,
                temperature=0.7,
                stream=True,
            )
            async for chunk in stream_:
                delta  = chunk.choices[0].delta.content or ""
                full  += delta
                clean  = re.sub(r"(LEAD_CAPTURED|UNKNOWN_QUESTION):\{[^}]*\}", "", delta)
                if clean:
                    yield f"data: {json.dumps({'text': clean})}\n\n"

        except Exception as e:
            err = str(e).lower()
            if "api_key" in err or "authentication" in err or "401" in err:
                msg = "Chatbot API key is invalid or expired. Please update GROQ_API_KEY in backend/.env"
            elif "rate" in err or "429" in err:
                msg = "I'm getting a lot of messages right now. Please try again in a minute!"
            else:
                msg = "Sorry, something went wrong. Please try again or contact Sandip directly on LinkedIn."
            yield f"data: {json.dumps({'text': msg})}\n\n"
        finally:
            await _handle_markers(full, body.session_id)
            yield "data: [DONE]\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")


async def _get_rag_context(query: str) -> str:
    if not settings.PINECONE_API_KEY:
        return ""
    try:
        from pinecone import Pinecone
        
        embedding = await get_hf_embedding(query)
        if not embedding:
            return ""

        pc      = Pinecone(api_key=settings.PINECONE_API_KEY)
        index   = pc.Index(settings.PINECONE_INDEX)
        results = index.query(vector=embedding, top_k=3, include_metadata=True)
        chunks  = [m["metadata"].get("text", "") for m in results.get("matches", []) if m.get("metadata")]
        return "\n".join(chunks[:3])
    except Exception:
        return ""


async def _handle_markers(text: str, session_id: str | None):
    sb = get_supabase()

    lead = re.search(r"LEAD_CAPTURED:(\{[^}]*\})", text)
    if lead:
        try:
            d = json.loads(lead.group(1))
            sb.table("chatbot_leads").insert({
                "name":    d.get("name", ""),
                "email":   d.get("email", ""),
                "phone":   d.get("phone", ""),
                "context": d.get("context", ""),
                "message": text[:500],
            }).execute()
            await _push(
                "Portfolio 🔥 New Chatbot Lead",
                f"{d.get('name','?')} | {d.get('email','?')}\n{d.get('context','')}",
                priority=1,
            )
        except Exception:
            pass

    unknown = re.search(r"UNKNOWN_QUESTION:(\{[^}]*\})", text)
    if unknown:
        try:
            d        = json.loads(unknown.group(1))
            question = d.get("question", text[:200])
            sb.table("chatbot_unknowns").insert({
                "question":   question,
                "session_id": session_id,
            }).execute()
            await _push("Portfolio — Unknown Question", f"Bot couldn't answer:\n{question}")
        except Exception:
            pass


async def _push(title: str, msg: str, priority: int = 0):
    if not settings.PUSHOVER_USER_KEY or not settings.PUSHOVER_APP_TOKEN:
        return
    try:
        async with httpx.AsyncClient(timeout=5) as c:
            await c.post("https://api.pushover.net/1/messages.json", data={
                "token":    settings.PUSHOVER_APP_TOKEN,
                "user":     settings.PUSHOVER_USER_KEY,
                "title":    title,
                "message":  msg,
                "priority": priority,
            })
    except Exception:
        pass