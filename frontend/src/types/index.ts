export interface Project {
  id: number
  title: string
  slug: string
  short_description: string
  description?: string | null
  technologies: string[]
  features: string[]
  thumbnail_url?: string | null
  github_url?: string | null
  live_demo_url?: string | null
  status: 'published' | 'draft'
  display_order: number
  created_at?: string | null
  updated_at?: string | null
}

export interface ProjectFormData {
  title: string
  slug?: string
  short_description: string
  description?: string
  technologies: string[]
  features: string[]
  thumbnail_url?: string
  github_url?: string
  live_demo_url?: string
  status: 'published' | 'draft'
  display_order: number
}

export interface User {
  id: number
  email: string
  is_admin: boolean
  created_at?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject?: string | null
  message: string
  source?: string
  is_read: boolean
  created_at: string
}

export type RequirementType = 'WEBSITE' | 'WEB_APPLICATION' | 'OTHER'

export interface BusinessMessage {
  id: number
  business_name: string
  email: string
  requirement_type: string
  other_requirement?: string | null
  message: string
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED'
  created_at: string
  updated_at?: string | null
}

export interface BusinessMessageFormData {
  businessName: string
  email: string
  requirementType: 'Website' | 'Web Application' | 'Others'
  otherRequirement?: string
  message: string
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface DashboardStats {
  total_business_messages: number
  new_business_messages: number
  total_social_connect_messages: number
  unread_social_connect_messages: number
  total_projects: number
  published_projects: number
  recent_business_messages: BusinessMessage[]
  recent_social_messages: ContactMessage[]
  recent_projects: Project[]
}

export interface ProfileData {
  id: number
  full_name: string
  email: string
  education: string
  cv_url?: string | null
  cv_filename?: string | null
  updated_at?: string | null
}

export interface ProfileUpdateData {
  full_name?: string
  email?: string
  education?: string
}

export interface PasswordChangeData {
  current_password?: string
  new_password: string
  confirm_password: string
}
