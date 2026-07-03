import { createClient } from '@supabase/supabase-js'
import type { Bio, TechItem, Project, Accomplishment, Course, Experience, ResumeOverview, PinnedRepo } from '@/types'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnon)

export async function getBio(): Promise<{ bio: Bio; experience: Experience[] } | null> {
  const [bioRes, expRes] = await Promise.all([
    supabase.from('bio').select('*').eq('id', 1).single(),
    supabase.from('experience').select('*').order('display_order'),
  ])
  if (bioRes.error) return null
  return { bio: bioRes.data as Bio, experience: (expRes.data ?? []) as Experience[] }
}

export async function getTechStack(): Promise<TechItem[]> {
  const { data } = await supabase
    .from('tech_stack')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')
  return (data ?? []) as TechItem[]
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')
  return (data ?? []) as Project[]
}

export async function getAccomplishments(): Promise<Accomplishment[]> {
  const { data } = await supabase
    .from('accomplishments')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')
  return (data ?? []) as Accomplishment[]
}

export async function getCourses(): Promise<Course[]> {
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
  return (data ?? []) as Course[]
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_visible', true)
    .single()
  return data as Course | null
}

export async function getResumeOverview(): Promise<ResumeOverview[]> {
  const { data } = await supabase
    .from('resume_overview')
    .select('*')
    .order('display_order')
  return (data ?? []) as ResumeOverview[]
}

export async function getPinnedRepos(): Promise<PinnedRepo[]> {
  const { data } = await supabase
    .from('pinned_repos')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')
  return (data ?? []) as PinnedRepo[]
}