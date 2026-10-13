import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { api, getAssetUrl } from '../../api/client'
import type { Project } from '../../types'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { ProjectFormModal } from '../../components/ProjectFormModal'
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  SlidersHorizontal,
} from 'lucide-react'

export const AdminProjectsPage: React.FC = () => {
  const { token } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Search & Filter
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL', 'published', 'draft'

  // Modal & Action states
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const showSuccess = (msg: string) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(null), 3500)
  }

  const loadProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getAdminProjects(token)
      setProjects(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load projects.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const handleTogglePublish = async (project: Project) => {
    try {
      const updated = await api.togglePublish(project.id, token)
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      showSuccess(`Project "${updated.title}" is now ${updated.status}.`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update publication status.')
    }
  }

  const handleDelete = async (id: number) => {
    setActionLoading(true)
    try {
      const res = await api.deleteProject(id, token)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      setDeleteConfirmId(null)
      showSuccess(res.message)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete project.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleFormSaved = (saved: Project) => {
    if (editingProject) {
      setProjects((prev) => prev.map((p) => (p.id === saved.id ? saved : p)))
      showSuccess(`Project "${saved.title}" updated successfully.`)
    } else {
      setProjects((prev) => [saved, ...prev])
      showSuccess(`Project "${saved.title}" created successfully!`)
    }
    setEditingProject(null)
    setShowModal(false)
  }

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.short_description.toLowerCase().includes(search.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [projects, search, statusFilter])

  return (
    <AdminLayout
      title="Project Management"
      subtitle="Create, edit, reorder, and publish portfolio showcase projects."
      actions={
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={loadProjects}
            disabled={loading}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              setEditingProject(null)
              setShowModal(true)
            }}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Plus size={16} />
            <span>Add Project</span>
          </button>
        </div>
      }
    >
      {/* Notifications */}
      {success && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Toolbar: Search and Filter */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '14px',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '360px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)',
            }}
          />
          <input
            type="text"
            placeholder="Search projects by title, stack, or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '36px', height: '40px', fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={15} style={{ color: 'var(--text-subtle)' }} />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
            style={{ height: '38px', padding: '0 12px', fontSize: '0.84rem', cursor: 'pointer' }}
          >
            <option value="ALL">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          <RefreshCw size={22} className="animate-spin text-blue-500" style={{ margin: '0 auto 10px' }} />
          <div>Loading projects…</div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="card" style={{ padding: '56px 20px', textAlign: 'center' }}>
          <FolderKanban size={36} style={{ color: 'var(--text-subtle)', opacity: 0.6, margin: '0 auto 12px' }} />
          <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '1.05rem' }}>No projects found</p>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px', display: 'block' }}>
            {search || statusFilter !== 'ALL'
              ? 'Try modifying your search or filter options.'
              : 'Add your first showcase project to display it on the public site.'}
          </span>
          <button
            onClick={() => {
              setEditingProject(null)
              setShowModal(true)
            }}
            className="btn btn-primary"
            style={{ gap: '6px' }}
          >
            <Plus size={16} /> Add First Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                flexWrap: 'wrap',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: '74px',
                  height: '56px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {project.thumbnail_url ? (
                  <img
                    src={getAssetUrl(project.thumbnail_url)}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <FolderKanban size={22} className="text-slate-400" />
                )}
              </div>

              {/* Project Meta & Details */}
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.02rem', color: 'var(--text-main)' }}>
                    {project.title}
                  </span>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background:
                        project.status === 'published' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(234, 179, 8, 0.12)',
                      color: project.status === 'published' ? '#10b981' : '#ca8a04',
                      border: `1px solid ${
                        project.status === 'published' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(234, 179, 8, 0.25)'
                      }`,
                    }}
                  >
                    {project.status === 'published' ? 'Published' : 'Draft'}
                  </span>

                  {project.display_order > 0 && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--text-subtle)',
                        background: 'var(--bg-input)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      Order #{project.display_order}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    margin: '0 0 8px',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  {project.short_description}
                </p>

                {/* Tech chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {project.technologies.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      +{project.technologies.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {/* View on Public site */}
                <Link
                  to={`/projects/${project.slug}`}
                  target="_blank"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 10px' }}
                  title="Preview on Public Portfolio"
                >
                  <Eye size={15} />
                </Link>

                {/* Toggle Publish */}
                <button
                  onClick={() => handleTogglePublish(project)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 10px' }}
                  title={project.status === 'published' ? 'Unpublish to Draft' : 'Publish live'}
                >
                  {project.status === 'published' ? <EyeOff size={15} /> : <CheckCircle2 size={15} />}
                </button>

                {/* Edit */}
                <button
                  onClick={() => {
                    setEditingProject(project)
                    setShowModal(true)
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 10px' }}
                  title="Edit project"
                >
                  <Pencil size={15} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => setDeleteConfirmId(project.id)}
                  className="btn btn-danger btn-sm"
                  style={{ padding: '6px 10px' }}
                  title="Delete project"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Form Modal (Create / Edit) */}
      {showModal && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => {
            setShowModal(false)
            setEditingProject(null)
          }}
          onSaved={handleFormSaved}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 110,
          }}
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '26px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ margin: '0 0 10px', fontSize: '1.1rem', fontWeight: 800 }}>
              Confirm Project Deletion
            </h4>
            <p style={{ margin: '0 0 20px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Are you sure you want to permanently delete this project? It will be removed from your public portfolio.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-secondary btn-sm"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="btn btn-danger btn-sm"
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting…' : 'Yes, Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
export default AdminProjectsPage
