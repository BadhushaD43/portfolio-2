import type {
  Project,
  ProjectFormData,
  AuthResponse,
  User,
  ContactMessage,
  BusinessMessage,
  BusinessMessageFormData,
  DashboardStats,
  PaginatedResult,
  ProfileData,
  ProfileUpdateData,
  PasswordChangeData,
} from '../types'

const API_BASE = (import.meta.env.VITE_API_URL as string)?.replace(/\/+$/, '') || '/api'

function getAuthHeader(token?: string | null): Record<string, string> {
  const t = token || localStorage.getItem('badhusha_admin_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export const api = {
  // --- Public APIs ---
  async getPublicProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`)
    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.statusText}`)
    }
    return res.json()
  },

  async getPublicProject(slugOrId: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${slugOrId}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch project: ${res.statusText}`)
    }
    return res.json()
  },

  async submitContact(data: {
    name: string
    email: string
    subject?: string
    message: string
    source?: string
  }): Promise<{ success: boolean; message: string; id?: number }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to send message')
    }
    return body
  },

  async submitBusinessMessage(
    data: BusinessMessageFormData
  ): Promise<{ success: boolean; message: string; id?: number }> {
    const res = await fetch(`${API_BASE}/business-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to send business inquiry')
    }
    return body
  },

  // --- Auth APIs ---
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Authentication failed')
    }
    return body
  },

  async getMe(token?: string | null): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        ...getAuthHeader(token),
      },
    })
    if (!res.ok) {
      throw new Error('Session expired or invalid')
    }
    return res.json()
  },

  // --- Dashboard Aggregation ---
  async getDashboardStats(token?: string | null): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/admin/dashboard/stats`, {
      headers: {
        ...getAuthHeader(token),
      },
    })
    if (!res.ok) {
      throw new Error('Failed to load dashboard statistics')
    }
    return res.json()
  },

  // --- Admin Business Messages APIs ---
  async getBusinessMessages(
    params: {
      page?: number
      limit?: number
      search?: string
      requirement_type?: string
      status_filter?: string
      sort_by?: string
      order?: string
    } = {},
    token?: string | null
  ): Promise<PaginatedResult<BusinessMessage>> {
    const query = new URLSearchParams()
    if (params.page) query.set('page', params.page.toString())
    if (params.limit) query.set('limit', params.limit.toString())
    if (params.search) query.set('search', params.search)
    if (params.requirement_type) query.set('requirement_type', params.requirement_type)
    if (params.status_filter) query.set('status_filter', params.status_filter)
    if (params.sort_by) query.set('sort_by', params.sort_by)
    if (params.order) query.set('order', params.order)

    const res = await fetch(`${API_BASE}/admin/business-messages?${query.toString()}`, {
      headers: {
        ...getAuthHeader(token),
      },
    })
    if (!res.ok) {
      throw new Error('Failed to load business messages')
    }
    return res.json()
  },

  async getBusinessMessageDetail(id: number, token?: string | null): Promise<BusinessMessage> {
    const res = await fetch(`${API_BASE}/admin/business-messages/${id}`, {
      headers: {
        ...getAuthHeader(token),
      },
    })
    if (!res.ok) {
      throw new Error('Failed to load business inquiry detail')
    }
    return res.json()
  },

  async updateBusinessMessageStatus(
    id: number,
    status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED',
    token?: string | null
  ): Promise<{ success: boolean; status: string; message: string }> {
    const res = await fetch(`${API_BASE}/admin/business-messages/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token),
      },
      body: JSON.stringify({ status }),
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to update status')
    }
    return body
  },

  async deleteBusinessMessage(
    id: number,
    token?: string | null
  ): Promise<{ success: boolean; message: string; id: number }> {
    const res = await fetch(`${API_BASE}/admin/business-messages/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(token),
      },
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to delete business inquiry')
    }
    return body
  },

  // --- Admin Social Connect APIs ---
  async getSocialConnectMessages(
    params: {
      page?: number
      limit?: number
      search?: string
      source?: string
      status_filter?: string
      order?: string
    } = {},
    token?: string | null
  ): Promise<PaginatedResult<ContactMessage>> {
    const query = new URLSearchParams()
    if (params.page) query.set('page', params.page.toString())
    if (params.limit) query.set('limit', params.limit.toString())
    if (params.search) query.set('search', params.search)
    if (params.source) query.set('source', params.source)
    if (params.status_filter) query.set('status_filter', params.status_filter)
    if (params.order) query.set('order', params.order)

    const res = await fetch(`${API_BASE}/admin/social-connect?${query.toString()}`, {
      headers: {
        ...getAuthHeader(token),
      },
    })
    if (!res.ok) {
      throw new Error('Failed to load social connect messages')
    }
    return res.json()
  },

  async getSocialConnectDetail(id: number, token?: string | null): Promise<ContactMessage> {
    const res = await fetch(`${API_BASE}/admin/social-connect/${id}`, {
      headers: {
        ...getAuthHeader(token),
      },
    })
    if (!res.ok) {
      throw new Error('Failed to load message detail')
    }
    return res.json()
  },

  async markSocialConnectRead(id: number, token?: string | null): Promise<void> {
    await fetch(`${API_BASE}/admin/social-connect/${id}/read`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeader(token),
      },
    })
  },

  async deleteSocialConnect(
    id: number,
    token?: string | null
  ): Promise<{ success: boolean; message: string; id: number }> {
    const res = await fetch(`${API_BASE}/admin/social-connect/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(token),
      },
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to delete social connect message')
    }
    return body
  },

  // --- Admin Project APIs ---
  async getAdminProjects(token?: string | null): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/admin/projects`, {
      headers: {
        ...getAuthHeader(token),
      },
    })
    if (!res.ok) {
      throw new Error('Failed to load admin projects')
    }
    return res.json()
  },

  async createProject(data: ProjectFormData, token?: string | null): Promise<Project> {
    const res = await fetch(`${API_BASE}/admin/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token),
      },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to create project')
    }
    return body
  },

  async updateProject(id: number, data: Partial<ProjectFormData>, token?: string | null): Promise<Project> {
    const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token),
      },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to update project')
    }
    return body
  },

  async deleteProject(id: number, token?: string | null): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(token),
      },
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to delete project')
    }
    return body
  },

  async togglePublish(id: number, token?: string | null): Promise<Project> {
    const res = await fetch(`${API_BASE}/admin/projects/${id}/publish`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(token),
      },
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to toggle publication status')
    }
    return body
  },

  async uploadImage(file: File, token?: string | null): Promise<{ success: boolean; url: string; filename: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API_BASE}/admin/uploads`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(token),
      },
      body: formData,
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to upload image')
    }
    return body
  },

  // Backward compatibility legacy
  async getAdminMessages(token?: string | null): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/admin/messages`, {
      headers: {
        ...getAuthHeader(token),
      },
    })
    if (!res.ok) {
      throw new Error('Failed to load messages')
    }
    return res.json()
  },

  async markMessageRead(id: number, token?: string | null): Promise<void> {
    await fetch(`${API_BASE}/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeader(token),
      },
    })
  },

  // --- Profile & CV APIs ---
  async getProfile(): Promise<ProfileData> {
    const res = await fetch(`${API_BASE}/profile`)
    if (!res.ok) {
      throw new Error('Failed to load profile details')
    }
    return res.json()
  },

  async updateProfile(data: ProfileUpdateData, token?: string | null): Promise<ProfileData> {
    const res = await fetch(`${API_BASE}/admin/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token),
      },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to update profile')
    }
    return body
  },

  async uploadCV(file: File, token?: string | null): Promise<ProfileData> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API_BASE}/admin/profile/cv`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(token),
      },
      body: formData,
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to upload CV file')
    }
    return body
  },

  getCVDownloadUrl(): string {
    return `${API_BASE}/profile/cv/download`
  },

  async changePassword(
    data: PasswordChangeData,
    token?: string | null
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token),
      },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.detail || 'Failed to change admin password')
    }
    return body
  },
}

