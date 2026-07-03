-- Optional seed data for pinned repos (run after add_pinned_repos.sql)
insert into pinned_repos (name, description, repo_url, stars, forks, language, lang_color, display_order) values
  ('agentic-portfolio-bot', 'AI chatbot for portfolio using Groq + RAG + FastAPI', 'https://github.com/GuptaSandip/agentic-portfolio-bot', 12, 3, 'Python', '#3572A5', 1),
  ('llm-document-qa', 'LlamaIndex-powered document Q&A with streaming', 'https://github.com/GuptaSandip/llm-document-qa', 8, 2, 'Python', '#3572A5', 2),
  ('multi-agent-orchestrator', 'LangChain multi-agent system with tool use', 'https://github.com/GuptaSandip/multi-agent-orchestrator', 15, 5, 'Python', '#3572A5', 3),
  ('sandip-portfolio', 'Personal portfolio — React + FastAPI + Supabase', 'https://github.com/GuptaSandip/sandip-portfolio', 6, 1, 'TypeScript', '#3178c6', 4);
