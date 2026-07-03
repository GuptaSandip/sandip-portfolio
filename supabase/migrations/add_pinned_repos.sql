-- Run once in Supabase SQL Editor to add pinned repos table
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

drop policy if exists "pub_pinned_repos" on pinned_repos;
create policy "pub_pinned_repos" on pinned_repos for select using (is_visible = true);
