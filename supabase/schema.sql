-- ============================================================
-- SANDIP GUPTA PORTFOLIO — SUPABASE SCHEMA v1
-- Run in: Supabase Dashboard → SQL Editor → Run
-- ============================================================
create extension if not exists "uuid-ossp";

-- 1. BIO ──────────────────────────────────────────────────
create table if not exists bio (
  id              integer primary key default 1,
  name            text not null default 'Sandip Gupta',
  title           text not null default 'Master Trainer · Data Science & AI',
  taglines        text[] not null default array[
    'AI Engineer & Master Trainer',
    'Building with LLMs & Agentic AI',
    'Gen AI · ML · Data Science',
    'Turning Complex AI into Simple Solutions'
  ],
  about           text not null default 'I''m Sandip Gupta — an AI engineer and Master Trainer who builds production-grade applications with LLMs, agentic AI, and modern AI frameworks. I spend my days creating real-world AI systems, experimenting with autonomous workflows, and teaching others to build and think in AI. When I''m not coding or training, I''m exploring the bleeding edge of Gen AI and turning complex concepts into practical, working solutions.',
  email           text default 'jobsforsandipgupta@gmail.com',
  location        text default 'India',
  linkedin_url    text default 'https://www.linkedin.com/in/sandipgupta-ai/',
  github_url      text default 'https://github.com/GuptaSandip',
  twitter_url     text default 'https://x.com/guptasandip11',
  hackerrank_url  text default 'https://www.hackerrank.com/profile/sandip_gupta_111',
  huggingface_url text default 'https://huggingface.co/guptasandip',
  kaggle_url      text,
  resume_url      text,
  avatar_url      text,
  is_open_to_work boolean default true,
  updated_at      timestamptz default now()
);
insert into bio (id) values (1) on conflict (id) do nothing;

-- 2. EXPERIENCE ───────────────────────────────────────────
create table if not exists experience (
  id            uuid primary key default uuid_generate_v4(),
  role          text not null,
  company       text not null,
  start_date    date not null,
  end_date      date,
  is_current    boolean default false,
  description   text,
  display_order smallint default 0
);
insert into experience (role, company, start_date, is_current, description, display_order) values
  ('Master Trainer', 'Edtech / Training Organisation', '2025-04-01', true,
   'Leading advanced AI/ML training programs. Mentoring cohorts on LLMs, Agentic AI, RAG systems, and production-grade AI engineering.', 1),
  ('Associate Trainer – Data Science & AI', 'Training Organisation', '2024-09-01', false,
   'Delivered hands-on Data Science and AI curriculum, bridging theory with real-world application across ML pipelines and Gen AI workflows.', 2),
  ('Data Science Trainer', 'Training Organisation', '2023-08-01', false,
   'Taught core Data Science fundamentals — Python, machine learning, statistics, and visualisation — to professional and student cohorts.', 3)
on conflict do nothing;

-- 3. TECH STACK ───────────────────────────────────────────
create table if not exists tech_stack (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  category      text not null check (category in ('language','framework','tool','cloud','database','ai_ml','other')),
  icon_slug     text,
  level         smallint default 4 check (level between 1 and 5),
  display_order smallint default 0,
  is_visible    boolean default true,
  created_at    timestamptz default now()
);
insert into tech_stack (name, category, icon_slug, level, display_order) values
  ('Python',        'language',  'python',      5,  1),
  ('SQL',           'language',  'mysql',        4,  2),
  ('JavaScript',    'language',  'javascript',   3,  3),
  ('FastAPI',       'framework', 'fastapi',      5,  4),
  ('React',         'framework', 'react',        3,  5),
  ('Streamlit',     'framework', 'streamlit',    5,  6),
  ('LangChain',     'ai_ml',    'langchain',     5,  7),
  ('LlamaIndex',    'ai_ml',    'llamaindex',    4,  8),
  ('OpenAI API',    'ai_ml',    'openai',        5,  9),
  ('Groq',          'ai_ml',    'groq',          4, 10),
  ('HuggingFace',   'ai_ml',    'huggingface',   5, 11),
  ('Scikit-learn',  'ai_ml',    'scikitlearn',   5, 12),
  ('TensorFlow',    'ai_ml',    'tensorflow',    4, 13),
  ('PyTorch',       'ai_ml',    'pytorch',       4, 14),
  ('Pandas',        'tool',     'pandas',        5, 15),
  ('NumPy',         'tool',     'numpy',         5, 16),
  ('Pinecone',      'database', 'pinecone',      4, 17),
  ('Supabase',      'database', 'supabase',      4, 18),
  ('PostgreSQL',    'database', 'postgresql',    4, 19),
  ('Docker',        'tool',     'docker',        3, 20),
  ('Git',           'tool',     'git',           5, 21)
on conflict do nothing;

-- 4. PROJECTS ─────────────────────────────────────────────
create table if not exists projects (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text not null,
  tech_tags     text[] default '{}',
  github_url    text,
  live_url      text,
  image_url     text,
  is_featured   boolean default false,
  display_order smallint default 0,
  is_visible    boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 5. ACCOMPLISHMENTS ──────────────────────────────────────
create table if not exists accomplishments (
  id             uuid primary key default uuid_generate_v4(),
  title          text not null,
  description    text,
  category       text default 'achievement' check (
                   category in ('patent','award','publication','certification','milestone','other')),
  issuer         text,
  issued_date    date,
  credential_url text,
  image_url      text,
  display_order  smallint default 0,
  is_visible     boolean default false,
  created_at     timestamptz default now()
);

-- 6. COURSES ──────────────────────────────────────────────
create table if not exists courses (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  slug            text unique not null,
  short_desc      text,
  description     text,
  curriculum      jsonb default '[]',
  duration_weeks  smallint,
  level           text default 'beginner' check (level in ('beginner','intermediate','advanced')),
  price           numeric(10,2) default 0,
  is_free         boolean default true,
  thumbnail_url   text,
  brochure_url    text,
  is_visible      boolean default false,
  enrollment_open boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- 7. ENROLLMENTS ──────────────────────────────────────────
create table if not exists enrollments (
  id          uuid primary key default uuid_generate_v4(),
  course_id   uuid references courses(id) on delete cascade,
  name        text not null,
  email       text not null,
  phone       text,
  goal        text,
  status      text default 'pending' check (status in ('pending','approved','rejected','waitlisted')),
  notes       text,
  enrolled_at timestamptz default now()
);

-- 8. CHATBOT LEADS ────────────────────────────────────────
create table if not exists chatbot_leads (
  id         uuid primary key default uuid_generate_v4(),
  name       text,
  email      text,
  phone      text,
  message    text,
  context    text,
  is_read    boolean default false,
  created_at timestamptz default now()
);

-- 9. CHATBOT UNKNOWN QUESTIONS ────────────────────────────
create table if not exists chatbot_unknowns (
  id         uuid primary key default uuid_generate_v4(),
  question   text not null,
  session_id text,
  is_read    boolean default false,
  created_at timestamptz default now()
);

-- RLS ─────────────────────────────────────────────────────
alter table bio               enable row level security;
alter table experience        enable row level security;
alter table tech_stack        enable row level security;
alter table projects          enable row level security;
alter table accomplishments   enable row level security;
alter table courses           enable row level security;
alter table enrollments       enable row level security;
alter table chatbot_leads     enable row level security;
alter table chatbot_unknowns  enable row level security;

create policy "pub_bio"        on bio              for select using (true);
create policy "pub_exp"        on experience       for select using (true);
create policy "pub_tech"       on tech_stack       for select using (is_visible = true);
create policy "pub_projects"   on projects         for select using (is_visible = true);
create policy "pub_acc"        on accomplishments  for select using (is_visible = true);
create policy "pub_courses"    on courses          for select using (is_visible = true);
create policy "ins_enroll"     on enrollments      for insert with check (true);
create policy "ins_leads"      on chatbot_leads    for insert with check (true);
create policy "ins_unknowns"   on chatbot_unknowns for insert with check (true);

-- 10. RESUME OVERVIEW ─────────────────────────────────────
create table if not exists resume_overview (
  id            uuid primary key default uuid_generate_v4(),
  category      text not null check (category in ('experience','skills','education','highlights')),
  label         text not null,
  sub           text,
  display_order smallint default 0,
  created_at    timestamptz default now()
);
alter table resume_overview enable row level security;
create policy "pub_resume_ov" on resume_overview for select using (true);

-- 11. PINNED GITHUB REPOS ─────────────────────────────────
create table if not exists pinned_repos (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  description   text,
  repo_url      text not null,
  stars         integer default 0,
  forks         integer default 0,
  language      text,
  lang_color    text default '#3572A5',
  display_order smallint default 0,
  is_visible    boolean default true,
  created_at    timestamptz default now()
);
alter table pinned_repos enable row level security;
create policy "pub_pinned_repos" on pinned_repos for select using (is_visible = true);