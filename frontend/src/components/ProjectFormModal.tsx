import React, { useState } from 'react'
import type { Project, ProjectFormData } from '../types'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import {
  IconX,
  IconUpload,
  IconCheck,
  IconAlertCircle,
  IconPlus,
  IconTrash2,
} from '../components/Icons'

interface ProjectFormModalProps {
  project?: Project | null
  onClose: () => void
  onSaved: (project: Project) => void
}

const defaultForm: ProjectFormData = {
  title: '',
  slug: '',
  short_description: '',
  description: '',
  technologies: [],
  features: [],
  thumbnail_url: '',
  github_url: '',
  live_demo_url: '',
  status: 'published',
  display_order: 0,
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ project, onClose, onSaved }) => {
  const { token } = useAuth()
  const [form, setForm] = useState<ProjectFormData>(
    project
      ? {
          title: project.title,
          slug: project.slug,
          short_description: project.short_description,
          description: project.description || '',
          technologies: project.technologies,
          features: project.features,
          thumbnail_url: project.thumbnail_url || '',
          github_url: project.github_url || '',
          live_demo_url: project.live_demo_url || '',
          status: project.status,
          display_order: project.display_order,
        }
      : { ...defaultForm }
  )

  const [techInput, setTechInput] = useState('')
  const [featureInput, setFeatureInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isEditing = !!project

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: name === 'display_order' ? parseInt(value) || 0 : value }))
    setError(null)
  }

  const addTech = () => {
    const t = techInput.trim()
    if (t && !form.technologies.includes(t)) {
      setForm((p) => ({ ...p, technologies: [...p.technologies, t] }))
    }
    setTechInput('')
  }

  const removeTech = (tech: string) => {
    setForm((p) => ({ ...p, technologies: p.technologies.filter((t) => t !== tech) }))
  }

  const addFeature = () => {
    const f = featureInput.trim()
    if (f && !form.features.includes(f)) {
      setForm((p) => ({ ...p, features: [...p.features, f] }))
    }
    setFeatureInput('')
  }

  const removeFeature = (feat: string) => {
    setForm((p) => ({ ...p, features: p.features.filter((f) => f !== feat) }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const res = await api.uploadImage(file, token)
      setForm((p) => ({ ...p, thumbnail_url: res.url }))
      setSuccess('Image uploaded successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const validate = (): string | null => {
    if (!form.title.trim() || form.title.trim().length < 2) return 'Title must be at least 2 characters.'
    if (!form.short_description.trim() || form.short_description.trim().length < 5) return 'Short description must be at least 5 characters.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setSaving(true)
    setError(null)
    try {
      const payload: Partial<ProjectFormData> = {
        ...form,
        title: form.title.trim(),
        short_description: form.short_description.trim(),
        description: form.description?.trim() || '',
        thumbnail_url: form.thumbnail_url?.trim() || undefined,
        github_url: form.github_url?.trim() || undefined,
        live_demo_url: form.live_demo_url?.trim() || undefined,
        slug: form.slug?.trim() || undefined,
      }

      let saved: Project
      if (isEditing && project) {
        saved = await api.updateProject(project.id, payload, token)
      } else {
        saved = await api.createProject(payload as ProjectFormData, token)
      }
      onSaved(saved)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-dialog" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            {isEditing ? '✏️ Edit Project' : '➕ New Project'}
          </h2>
          <button onClick={onClose} className="btn btn-secondary btn-icon btn-sm" aria-label="Close dialog">
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {error && (
              <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                <IconAlertCircle size={16} />
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" style={{ marginBottom: '16px' }}>
                <IconCheck size={16} />
                {success}
              </div>
            )}

            {/* Title + Slug Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pf-title">Title <span style={{ color: 'var(--status-error)' }}>*</span></label>
                <input id="pf-title" name="title" value={form.title} onChange={handleChange} className="form-control" placeholder="Project name" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pf-slug">
                  Slug <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 400 }}>(optional, auto-generated)</span>
                </label>
                <input id="pf-slug" name="slug" value={form.slug} onChange={handleChange} className="form-control" placeholder="url-friendly-slug" />
              </div>
            </div>

            {/* Short Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="pf-short_description">Short Description <span style={{ color: 'var(--status-error)' }}>*</span></label>
              <input id="pf-short_description" name="short_description" value={form.short_description} onChange={handleChange} className="form-control" placeholder="One-line project summary" required />
            </div>

            {/* Full Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="pf-description">Detailed Description</label>
              <textarea id="pf-description" name="description" value={form.description} onChange={handleChange} className="form-control" rows={4} placeholder="In-depth project overview, architecture decisions, challenges..." style={{ resize: 'vertical' }} />
            </div>

            {/* Technologies */}
            <div className="form-group">
              <label className="form-label">Technology Stack</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech() } }}
                  className="form-control"
                  placeholder="e.g. React.js, FastAPI"
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={addTech} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                  <IconPlus size={16} /> Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {form.technologies.map((tech) => (
                  <span key={tech} className="tag" style={{ cursor: 'pointer', color: 'var(--accent-primary)', borderColor: 'rgba(16,185,129,0.4)' }} onClick={() => removeTech(tech)}>
                    {tech} <IconX size={12} />
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="form-group">
              <label className="form-label">Key Features</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }}
                  className="form-control"
                  placeholder="Describe a key feature…"
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={addFeature} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                  <IconPlus size={16} /> Add
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {form.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <IconCheck size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{feat}</span>
                    <button type="button" onClick={() => removeFeature(feat)} style={{ color: 'var(--status-error)', opacity: 0.6, padding: '2px' }}>
                      <IconTrash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="form-group">
              <label className="form-label">Project Thumbnail</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <input
                  name="thumbnail_url"
                  value={form.thumbnail_url || ''}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="https://... or upload below"
                  style={{ flex: 1 }}
                />
              </div>
              <div style={{ marginTop: '8px' }}>
                <label
                  htmlFor="pf-upload"
                  className="btn btn-secondary btn-sm"
                  style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.65 : 1, display: 'inline-flex' }}
                >
                  <IconUpload size={15} />
                  {uploading ? 'Uploading…' : 'Upload Image'}
                </label>
                <input
                  id="pf-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginLeft: '10px' }}>
                  JPG, PNG, WEBP, SVG · Max 5 MB
                </span>
              </div>
              {form.thumbnail_url && (
                <div style={{ marginTop: '8px' }}>
                  <img
                    src={form.thumbnail_url}
                    alt="Thumbnail preview"
                    style={{ height: '80px', width: 'auto', maxWidth: '100%', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                  />
                </div>
              )}
            </div>

            {/* URLs Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pf-github_url">GitHub URL</label>
                <input id="pf-github_url" name="github_url" value={form.github_url || ''} onChange={handleChange} className="form-control" placeholder="https://github.com/..." type="url" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pf-live_demo_url">Live Demo URL</label>
                <input id="pf-live_demo_url" name="live_demo_url" value={form.live_demo_url || ''} onChange={handleChange} className="form-control" placeholder="https://..." type="url" />
              </div>
            </div>

            {/* Status + Order Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pf-status">Publication Status</label>
                <select id="pf-status" name="status" value={form.status} onChange={handleChange} className="form-control">
                  <option value="published">✅ Published (visible publicly)</option>
                  <option value="draft">📝 Draft (hidden from public)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pf-order">Display Order</label>
                <input id="pf-order" name="display_order" type="number" min={0} value={form.display_order} onChange={handleChange} className="form-control" placeholder="0" />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
              {saving ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                  Saving…
                </>
              ) : (
                <>
                  <IconCheck size={16} />
                  {isEditing ? 'Save Changes' : 'Create Project'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
