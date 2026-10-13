import React, { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { api, getAssetUrl } from '../api/client'
import type { Project, ContactMessage } from '../types'
import { ProjectFormModal } from '../components/ProjectFormModal'
import {
  IconPlus,
  IconEdit,
  IconTrash2,
  IconEye,
  IconEyeOff,
  IconCheck,
  IconAlertCircle,
  IconRefresh,
  IconShield,
  IconLayers,
  IconMessageSquare,
} from '../components/Icons'

type ActiveTab = 'projects' | 'messages'

export const AdminDashboard: React.FC = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  const [projects, setProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('projects')

  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const loadProjects = useCallback(async () => {
    setLoadingProjects(true)
    setError(null)
    try {
      const data = await api.getAdminProjects(token)
      setProjects(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoadingProjects(false)
    }
  }, [token])

  const loadMessages = useCallback(async () => {
    setLoadingMessages(true)
    try {
      const data = await api.getAdminMessages(token)
      setMessages(data)
    } catch { /* silently fail */ }
    finally { setLoadingMessages(false) }
  }, [token])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  useEffect(() => {
    if (activeTab === 'messages') loadMessages()
  }, [activeTab, loadMessages])

  const handleDeleteProject = async (id: number) => {
    setDeletingId(id)
    setError(null)
    try {
      const res = await api.deleteProject(id, token)
      setProjects((p) => p.filter((proj) => proj.id !== id))
      showSuccess(res.message)
      setConfirmDeleteId(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const handleTogglePublish = async (project: Project) => {
    try {
      const updated = await api.togglePublish(project.id, token)
      setProjects((p) => p.map((proj) => proj.id === updated.id ? updated : proj))
      showSuccess(`Project "${updated.title}" is now ${updated.status}.`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  const handleFormSave = (saved: Project) => {
    if (editingProject) {
      setProjects((p) => p.map((proj) => proj.id === saved.id ? saved : proj))
      showSuccess(`Project "${saved.title}" updated successfully.`)
    } else {
      setProjects((p) => [saved, ...p])
      showSuccess(`Project "${saved.title}" created successfully!`)
    }
    setEditingProject(null)
    setShowForm(false)
  }

  const handleMarkRead = async (id: number) => {
    await api.markMessageRead(id, token)
    setMessages((m) => m.map((msg) => msg.id === id ? { ...msg, is_read: true } : msg))
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const unreadCount = messages.filter((m) => !m.is_read).length
  const publishedCount = projects.filter((p) => p.status === 'published').length
  const draftCount = projects.filter((p) => p.status === 'draft').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Admin Topbar */}
      <header
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <IconShield size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>Portfolio Admin</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{user?.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link to="/" className="btn btn-secondary btn-sm" target="_blank">
            👁 View Portfolio
          </Link>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">
            Sign Out
          </button>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Projects', value: projects.length, icon: '📁', color: 'var(--accent-primary)' },
            { label: 'Published', value: publishedCount, icon: '🌐', color: 'var(--status-published)' },
            { label: 'Drafts', value: draftCount, icon: '📝', color: 'var(--status-draft)' },
            { label: 'Messages', value: messages.length || '—', icon: '📨', color: 'var(--accent-secondary)', badge: unreadCount > 0 ? unreadCount : undefined },
          ].map((stat) => (
            <div key={stat.label} className="card" style={{ padding: '20px 22px', position: 'relative', overflow: 'visible' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stat.color, lineHeight: 1.1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '4px' }}>{stat.label}</div>
              {stat.badge && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700 }}>
                  {stat.badge}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Status Messages */}
        {successMsg && (
          <div className="alert alert-success" style={{ marginBottom: '16px' }}>
            <IconCheck size={18} /> {successMsg}
          </div>
        )}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '16px' }}>
            <IconAlertCircle size={18} /> {error}
            <button onClick={() => setError(null)} style={{ marginLeft: 'auto', color: 'inherit', opacity: 0.7 }}><IconX size={14} /></button>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '24px', width: 'fit-content' }}>
          {([
            { id: 'projects' as ActiveTab, label: 'Projects', icon: <IconLayers size={16} /> },
            { id: 'messages' as ActiveTab, label: `Messages${unreadCount > 0 ? ` (${unreadCount})` : ''}`, icon: <IconMessageSquare size={16} /> },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn btn-sm"
              style={{
                background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 700 : 500,
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Manage Projects</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={loadProjects} className="btn btn-secondary btn-sm" title="Refresh project list">
                  <IconRefresh size={16} />
                </button>
                <button
                  onClick={() => { setEditingProject(null); setShowForm(true) }}
                  className="btn btn-primary btn-sm"
                >
                  <IconPlus size={16} />
                  New Project
                </button>
              </div>
            </div>

            {loadingProjects ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading projects…</div>
            ) : projects.length === 0 ? (
              <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📁</div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No projects yet. Create your first project.</p>
                <button onClick={() => setShowForm(true)} className="btn btn-primary">
                  <IconPlus size={16} /> Create First Project
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="card"
                    style={{
                      padding: '18px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Thumbnail mini */}
                    <div
                      style={{
                        width: '60px',
                        height: '50px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: 'var(--bg-input)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                      }}
                    >
                      {project.thumbnail_url ? (
                        <img src={getAssetUrl(project.thumbnail_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : '💻'}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.98rem' }}>
                          {project.title}
                        </span>
                        <span className={`status-badge ${project.status}`}>
                          {project.status === 'published' ? '● Published' : '◎ Draft'}
                        </span>
                        {project.display_order > 0 && (
                          <span className="tag" style={{ fontSize: '0.72rem' }}>#{project.display_order}</span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>
                        {project.short_description}
                      </p>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                        {project.technologies.slice(0, 4).map((t) => (
                          <span key={t} className="tag" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <Link
                        to={`/projects/${project.slug}`}
                        target="_blank"
                        className="btn btn-secondary btn-sm btn-icon"
                        title="Preview"
                      >
                        <IconEye size={15} />
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(project)}
                        className="btn btn-secondary btn-sm btn-icon"
                        title={project.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {project.status === 'published' ? <IconEyeOff size={15} /> : <IconCheck size={15} />}
                      </button>
                      <button
                        onClick={() => { setEditingProject(project); setShowForm(true) }}
                        className="btn btn-secondary btn-sm btn-icon"
                        title="Edit project"
                      >
                        <IconEdit size={15} />
                      </button>
                      {confirmDeleteId === project.id ? (
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Confirm?</span>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={deletingId === project.id}
                            className="btn btn-danger btn-sm"
                          >
                            {deletingId === project.id ? '…' : 'Yes, Delete'}
                          </button>
                          <button onClick={() => setConfirmDeleteId(null)} className="btn btn-secondary btn-sm">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(project.id)}
                          className="btn btn-danger btn-sm btn-icon"
                          title="Delete project"
                        >
                          <IconTrash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Contact Messages</h2>
              <button onClick={loadMessages} className="btn btn-secondary btn-sm">
                <IconRefresh size={16} /> Refresh
              </button>
            </div>

            {loadingMessages ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading messages…</div>
            ) : messages.length === 0 ? (
              <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
                <p style={{ color: 'var(--text-muted)' }}>No contact messages received yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="card"
                    style={{
                      padding: '20px 24px',
                      borderLeft: msg.is_read ? '3px solid var(--border-subtle)' : '3px solid var(--accent-primary)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)', marginRight: '10px' }}>{msg.name}</span>
                        <a href={`mailto:${msg.email}`} style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>{msg.email}</a>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {!msg.is_read && (
                          <span style={{ fontSize: '0.72rem', background: 'rgba(16,185,129,0.15)', color: 'var(--accent-primary)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontWeight: 700 }}>
                            NEW
                          </span>
                        )}
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                          {new Date(msg.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {!msg.is_read && (
                          <button onClick={() => handleMarkRead(msg.id)} className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem', padding: '4px 10px' }}>
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                    {msg.subject && (
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                        Subject: {msg.subject}
                      </div>
                    )}
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Project Form Modal */}
      {showForm && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => { setShowForm(false); setEditingProject(null) }}
          onSaved={handleFormSave}
        />
      )}

      {/* Import X for the close alert button */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Need to declare IconX for the error close button
const IconX: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
