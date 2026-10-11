import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { api } from '../../api/client'
import type { BusinessMessage } from '../../types'
import { AdminLayout } from '../../components/admin/AdminLayout'
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Building2,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export const BusinessMessagesPage: React.FC = () => {
  const { token } = useAuth()
  const [messages, setMessages] = useState<BusinessMessage[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)

  // Filters & Search
  const [search, setSearch] = useState('')
  const [reqType, setReqType] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // UI state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Details Modal & Delete Confirm Modal
  const [selectedMsg, setSelectedMsg] = useState<BusinessMessage | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const showSuccess = (msg: string) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(null), 3500)
  }

  const loadMessages = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getBusinessMessages(
        {
          page,
          limit,
          search: search.trim() || undefined,
          requirement_type: reqType !== 'ALL' ? reqType : undefined,
          status_filter: statusFilter !== 'ALL' ? statusFilter : undefined,
        },
        token
      )
      setMessages(res.items)
      setTotal(res.total)
      setTotalPages(res.total_pages)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch business messages.')
    } finally {
      setLoading(false)
    }
  }, [token, page, limit, search, reqType, statusFilter])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  const handleStatusChange = async (id: number, newStatus: 'NEW' | 'IN_PROGRESS' | 'COMPLETED') => {
    setActionLoading(true)
    try {
      await api.updateBusinessMessageStatus(id, newStatus, token)
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      )
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
      showSuccess(`Status updated to ${newStatus}.`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setActionLoading(true)
    try {
      await api.deleteBusinessMessage(id, token)
      setMessages((prev) => prev.filter((m) => m.id !== id))
      setDeleteConfirmId(null)
      if (selectedMsg?.id === id) setSelectedMsg(null)
      showSuccess('Business inquiry deleted.')
      // Refresh count
      setTotal((prev) => Math.max(0, prev - 1))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete inquiry.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <AdminLayout
      title="Business Messages"
      subtitle="Manage and track incoming client inquiries, project specifications, and proposals."
      actions={
        <button
          onClick={loadMessages}
          disabled={loading}
          className="btn btn-secondary btn-sm"
          style={{ gap: '8px' }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      }
    >
      {/* Success Notification */}
      {success && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Search & Filter Toolbar                                       */}
      {/* ------------------------------------------------------------- */}
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
        {/* Search Input */}
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
            placeholder="Search by company, email, or message…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="form-control"
            style={{ paddingLeft: '36px', height: '40px', fontSize: '0.88rem' }}
          />
        </div>

        {/* Filters Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={15} style={{ color: 'var(--text-subtle)' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Type:</span>
            <select
              value={reqType}
              onChange={(e) => {
                setReqType(e.target.value)
                setPage(1)
              }}
              className="form-control"
              style={{ height: '38px', padding: '0 12px', fontSize: '0.84rem', cursor: 'pointer' }}
            >
              <option value="ALL">All Types</option>
              <option value="WEBSITE">Website</option>
              <option value="WEB_APPLICATION">Web Application</option>
              <option value="OTHER">Others</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="form-control"
              style={{ height: '38px', padding: '0 12px', fontSize: '0.84rem', cursor: 'pointer' }}
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Table Data View                                              */}
      {/* ------------------------------------------------------------- */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr
                style={{
                  background: 'var(--bg-input)',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-subtle)',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Business Name</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Email</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Requirement</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Message Preview</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Submitted</th>
                <th style={{ padding: '14px 20px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw size={18} className="animate-spin text-blue-500" />
                      <span>Loading inquiries…</span>
                    </div>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '56px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <BriefcaseBusiness size={32} style={{ color: 'var(--text-subtle)', opacity: 0.6 }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>No business inquiries found.</p>
                      <span style={{ fontSize: '0.82rem' }}>
                        {search || reqType !== 'ALL' || statusFilter !== 'ALL'
                          ? 'Try clearing the search or filter criteria.'
                          : 'Client business inquiries will appear here.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-input)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Business Name */}
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building2 size={16} className="text-blue-500 flex-shrink-0" />
                        <span>{item.business_name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '16px 20px' }}>
                      <a
                        href={`mailto:${item.email}`}
                        style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}
                      >
                        {item.email}
                      </a>
                    </td>

                    {/* Requirement Type */}
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '3px 9px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(37, 99, 235, 0.1)',
                          color: 'var(--accent-primary)',
                          border: '1px solid rgba(37, 99, 235, 0.2)',
                        }}
                      >
                        {item.requirement_type}
                      </span>
                    </td>

                    {/* Message Preview */}
                    <td style={{ padding: '16px 20px', maxWidth: '240px' }}>
                      <span
                        style={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: 'var(--text-muted)',
                          fontSize: '0.86rem',
                        }}
                      >
                        {item.message}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: '16px 20px' }}>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(
                            item.id,
                            e.target.value as 'NEW' | 'IN_PROGRESS' | 'COMPLETED'
                          )
                        }
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-medium)',
                          background:
                            item.status === 'NEW'
                              ? 'rgba(234, 179, 8, 0.15)'
                              : item.status === 'IN_PROGRESS'
                              ? 'rgba(37, 99, 235, 0.15)'
                              : 'rgba(16, 185, 129, 0.15)',
                          color:
                            item.status === 'NEW'
                              ? '#ca8a04'
                              : item.status === 'IN_PROGRESS'
                              ? '#2563eb'
                              : '#10b981',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="NEW">NEW</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '16px 20px', color: 'var(--text-subtle)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {new Date(item.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedMsg(item)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px 10px', gap: '4px' }}
                          title="View complete details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '6px 10px' }}
                          title="Delete message"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.85rem',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>
              Showing {messages.length} of {total} results (Page {page} of {totalPages})
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 12px', gap: '4px' }}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 12px', gap: '4px' }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Details Modal Dialog                                          */}
      {/* ------------------------------------------------------------- */}
      {selectedMsg && (
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
            zIndex: 100,
          }}
          onClick={() => setSelectedMsg(null)}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={22} className="text-blue-500" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                  {selectedMsg.business_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMsg(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Business Email
                </span>
                <p style={{ margin: '2px 0 0', fontWeight: 600 }}>
                  <a href={`mailto:${selectedMsg.email}`} style={{ color: 'var(--accent-primary)' }}>
                    {selectedMsg.email}
                  </a>
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Requirement Type
                  </span>
                  <p style={{ margin: '2px 0 0', fontWeight: 600, color: 'var(--accent-primary)' }}>
                    {selectedMsg.requirement_type}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Status
                  </span>
                  <p style={{ margin: '2px 0 0', fontWeight: 600 }}>
                    {selectedMsg.status}
                  </p>
                </div>
              </div>

              {selectedMsg.other_requirement && (
                <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Specified Requirements (Others)
                  </span>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-main)', fontWeight: 500 }}>
                    {selectedMsg.other_requirement}
                  </p>
                </div>
              )}

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Complete Project Inquiry / Message
                </span>
                <div
                  style={{
                    margin: '6px 0 0',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                    color: 'var(--text-main)',
                  }}
                >
                  {selectedMsg.message}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                Received on: {new Date(selectedMsg.created_at).toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button
                onClick={() => setSelectedMsg(null)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Delete Confirmation Dialog                                    */}
      {/* ------------------------------------------------------------- */}
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
              Confirm Deletion
            </h4>
            <p style={{ margin: '0 0 20px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Are you sure you want to permanently delete this business inquiry? This action cannot be undone.
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
                {actionLoading ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
export default BusinessMessagesPage
