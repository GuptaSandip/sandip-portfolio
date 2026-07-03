export interface Bio {
  id: number
  name: string
  title: string
  taglines: string[]
  about: string
  email?: string
  location?: string
  linkedin_url?: string
  github_url?: string
  twitter_url?: string
  hackerrank_url?: string
  huggingface_url?: string
  kaggle_url?: string
  resume_url?: string
  avatar_url?: string
  is_open_to_work?: boolean
  updated_at?: string
}

export interface Experience {
  id: string
  role: string
  company: string
  start_date: string
  end_date?: string | null
  is_current: boolean
  description?: string
  display_order: number
}

export interface TechItem {
  id: string
  name: string
  category: string
  icon_slug?: string
  level: number
  display_order: number
  is_visible: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  tech_tags: string[]
  github_url?: string
  live_url?: string
  image_url?: string
  color?: string
  is_featured: boolean
  display_order: number
  is_visible: boolean
}

export interface Accomplishment {
  id: string
  title: string
  description?: string
  category: string
  issuer?: string
  issued_date?: string
  credential_url?: string
  image_url?: string
  display_order: number
  is_visible: boolean
}

export interface Course {
  id: string
  title: string
  slug: string
  short_desc?: string
  description?: string
  curriculum?: unknown[]
  duration_weeks?: number
  level: string
  price: number
  is_free: boolean
  thumbnail_url?: string
  brochure_url?: string
  is_visible: boolean
  enrollment_open: boolean
}

export interface ResumeOverview {
  id: string
  category: string
  label: string
  sub?: string
  display_order: number
}

export interface PinnedRepo {
  id: string
  name: string
  description?: string
  repo_url: string
  stars: number
  forks: number
  language?: string
  lang_color?: string
  display_order: number
  is_visible: boolean
}
