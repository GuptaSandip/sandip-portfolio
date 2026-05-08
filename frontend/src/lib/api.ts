const BASE = import.meta.env.VITE_API_URL ?? ''

// ── Auth ───────────────────────────────────────────────────
export async function adminLogin(username: string, password: string) {
  const form = new FormData()
  form.append('username', username)
  form.append('password', password)
  const res = await fetch(`${BASE}/api/auth/login`, { method: 'POST', body: form })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? 'Invalid credentials')
  }
  return res.json() as Promise<{ access_token: string; token_type: string }>
}

function getToken() {
  return localStorage.getItem('admin_token') ?? ''
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  }
}

// ── Chat streaming ─────────────────────────────────────────
export async function* streamChat(
  messages: { role: string; content: string }[],
  sessionId?: string
): AsyncGenerator<string> {
  const res = await fetch(`${BASE}/api/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, session_id: sessionId }),
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Chat failed (${res.status}): ${txt}`)
  }
  const reader = res.body!.getReader()
  const dec = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = dec.decode(value)
    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data: ')) continue
      const raw = line.slice(6).trim()
      if (raw === '[DONE]') return
      try {
        const d = JSON.parse(raw)
        if (d.text) yield d.text
        if (d.error) throw new Error(d.error)
      } catch { /* skip malformed */ }
    }
  }
}

// ── Enrollment (public) ────────────────────────────────────
export async function enroll(payload: {
  course_id: string
  name: string
  email: string
  phone?: string
  goal?: string
}) {
  const res = await fetch(`${BASE}/api/enrollments/`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? 'Enrollment failed')
  }
  return res.json()
}

// ── Core admin fetch helper ────────────────────────────────
async function af(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      ...authHeaders(),
      ...(opts?.headers ?? {}),
    },
  })

  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    window.location.href = '/admin/login'
    throw new Error('Session expired')
  }

  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const err = await res.json()
      detail = err.detail ?? detail
    } catch { /* ignore */ }
    throw new Error(detail)
  }

  // Handle empty responses (DELETE etc.)
  const text = await res.text()
  return text ? JSON.parse(text) : {}
}

// ── File upload helper (no Content-Type — let browser set boundary) ──
async function afFile(path: string, form: FormData) {
  const res = await fetch(`${BASE}${path}`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body:    form,
  })
  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    window.location.href = '/admin/login'
    throw new Error('Session expired')
  }
  if (!res.ok) {
    let detail = `Upload failed (HTTP ${res.status})`
    try { detail = (await res.json()).detail ?? detail } catch { /* ignore */ }
    throw new Error(detail)
  }
  return res.json()
}

// ── Admin API ──────────────────────────────────────────────
export const adminApi = {

  // Bio
  getBio: () =>
    af('/api/admin/bio'),

  updateBio: (data: object) =>
    af('/api/admin/bio', { method: 'PUT', body: JSON.stringify(data) }),

  // Fix 8 — avatar upload
  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return afFile('/api/admin/bio/avatar', form)
  },

  // Projects
  getProjects: () =>
    af('/api/admin/projects'),

  createProject: (data: object) =>
    af('/api/admin/projects', { method: 'POST', body: JSON.stringify(data) }),

  updateProject: (id: string, data: object) =>
    af(`/api/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteProject: (id: string) =>
    af(`/api/admin/projects/${id}`, { method: 'DELETE' }),

  // Tech stack
  getTech: () =>
    af('/api/admin/tech-stack'),

  createTech: (data: object) =>
    af('/api/admin/tech-stack', { method: 'POST', body: JSON.stringify(data) }),

  updateTech: (id: string, data: object) =>
    af(`/api/admin/tech-stack/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteTech: (id: string) =>
    af(`/api/admin/tech-stack/${id}`, { method: 'DELETE' }),

  // Accomplishments
  getAccomplishments: () =>
    af('/api/admin/accomplishments'),

  createAccomplishment: (data: object) =>
    af('/api/admin/accomplishments', { method: 'POST', body: JSON.stringify(data) }),

  updateAccomplishment: (id: string, data: object) =>
    af(`/api/admin/accomplishments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteAccomplishment: (id: string) =>
    af(`/api/admin/accomplishments/${id}`, { method: 'DELETE' }),

  // Courses
  getCourses: () =>
    af('/api/admin/courses'),

  createCourse: (data: object) =>
    af('/api/admin/courses', { method: 'POST', body: JSON.stringify(data) }),

  updateCourse: (id: string, data: object) =>
    af(`/api/admin/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  toggleCourse: (id: string, is_visible: boolean) =>
    af(`/api/admin/courses/${id}/toggle`, {
      method: 'PATCH',
      body:   JSON.stringify({ is_visible }),
    }),

  deleteCourse: (id: string) =>
    af(`/api/admin/courses/${id}`, { method: 'DELETE' }),

  // Fix 4 — course thumbnail upload
  uploadCourseThumbnail: (courseId: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return afFile(`/api/admin/courses/${courseId}/thumbnail`, form)
  },

  uploadCourseBrochure: (courseId: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return afFile(`/api/admin/courses/${courseId}/brochure`, form)
  },

  // Enrollments
  getEnrollments: (courseId?: string) =>
    af(`/api/admin/enrollments${courseId ? `?course_id=${courseId}` : ''}`),

  // Fix 7 — enrollment status update
  updateEnrollmentStatus: (id: string, status: string, notes?: string) =>
    af(`/api/admin/enrollments/${id}`, {
      method: 'PATCH',
      body:   JSON.stringify({ status, ...(notes ? { notes } : {}) }),
    }),

  // Leads
  getLeads: () =>
    af('/api/admin/leads'),

  getUnknowns: () =>
    af('/api/admin/unknowns'),

  // Fix 5 — resume upload
  uploadResume: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return afFile('/api/admin/resume', form)
  },
  // Experience
  getExperience: () =>
    af('/api/admin/experience'),

  createExperience: (data: object) =>
    af('/api/admin/experience', { method: 'POST', body: JSON.stringify(data) }),

  updateExperience: (id: string, data: object) =>
    af(`/api/admin/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteExperience: (id: string) =>
    af(`/api/admin/experience/${id}`, { method: 'DELETE' }),

  // Resume Overview
  getResumeOverview: () =>
    af('/api/admin/resume-overview'),

  createResumeOverview: (data: object) =>
    af('/api/admin/resume-overview', { method: 'POST', body: JSON.stringify(data) }),

  updateResumeOverview: (id: string, data: object) =>
    af(`/api/admin/resume-overview/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteResumeOverview: (id: string) =>
    af(`/api/admin/resume-overview/${id}`, { method: 'DELETE' }),

  // Chatbot Knowledge
  getKnowledge: () =>
    af('/api/admin/knowledge'),

  createKnowledge: (data: object) =>
    af('/api/admin/knowledge', { method: 'POST', body: JSON.stringify(data) }),

  updateKnowledge: (id: string, data: object) =>
    af(`/api/admin/knowledge/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteKnowledge: (id: string) =>
    af(`/api/admin/knowledge/${id}`, { method: 'DELETE' }),

  // Contact Messages
  getContacts: () =>
    af('/api/admin/contacts'),

  deleteContact: (id: string) =>
    af(`/api/admin/contacts/${id}`, { method: 'DELETE' }),
}

