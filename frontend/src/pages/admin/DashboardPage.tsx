import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { api } from '../../api/client'
import type { DashboardStats as DashboardStatsType } from '../../types'
import { AdminLayout } from '../../components/admin/AdminLayout'
import {
  BriefcaseBusiness,
  MessagesSquare,
  FolderKanban,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { token } = useAuth()
  const [stats, setStats] = useState<DashboardStatsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getDashboardStats(token)
      setStats(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard statistics.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Real-time operational metrics and recent activity across your portfolio."
      actions={
        <button
          onClick={loadStats}
          disabled={loading}
          className="btn btn-secondary btn-sm"
          style={{ gap: '8px' }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      }
    >
      {/* Error state */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '24px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button
            onClick={loadStats}
            className="btn btn-sm btn-secondary"
            style={{ marginLeft: 'auto' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4 Primary Metric Stat Cards                                   */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {/* Card 1: Total Business Messages */}
        <div
          className="card"
          style={{
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Business Messages
            </span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BriefcaseBusiness size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {loading ? '…' : stats?.total_business_messages ?? 0}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Total inquiries received
          </div>
        </div>

        {/* Card 2: New Business Messages */}
        <div
          className="card"
          style={{
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              New Inquiries
            </span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(234, 179, 8, 0.12)',
                color: '#eab308',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#eab308', lineHeight: 1 }}>
            {loading ? '…' : stats?.new_business_messages ?? 0}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Awaiting response
          </div>
        </div>

        {/* Card 3: Total Social Connect Messages */}
        <div
          className="card"
          style={{
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Social Connect
            </span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessagesSquare size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {loading ? '…' : stats?.total_social_connect_messages ?? 0}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {stats?.unread_social_connect_messages ?? 0} unread messages
          </div>
        </div>

        {/* Card 4: Total Projects */}
        <div
          className="card"
          style={{
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Projects
            </span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FolderKanban size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {loading ? '…' : stats?.total_projects ?? 0}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {stats?.published_projects ?? 0} live on portfolio
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Recent Activity Sections Grid                                */}
      {/* ------------------------------------------------------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Recent Business Messages */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BriefcaseBusiness size={18} className="text-blue-500" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Recent Business Inquiries</h3>
            </div>
            <Link
              to="/admin/business-messages"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
                textDecoration: 'none',
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading inquiries…</div>
          ) : !stats?.recent_business_messages || stats.recent_business_messages.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No business inquiries recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.recent_business_messages.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                      {item.business_name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
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
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{item.email}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{item.requirement_type}</span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.83rem',
                      color: 'var(--text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Social Connect Messages */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessagesSquare size={18} className="text-emerald-500" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Recent Social Connect</h3>
            </div>
            <Link
              to="/admin/social-connect"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
                textDecoration: 'none',
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading messages…</div>
          ) : !stats?.recent_social_messages || stats.recent_social_messages.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No social connect messages yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.recent_social_messages.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {item.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(37, 99, 235, 0.1)',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        {item.source || 'Homepage'}
                      </span>
                    </div>
                    {!item.is_read && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '1px 7px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#ef4444',
                        }}
                      >
                        UNREAD
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.email}</div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.83rem',
                      color: 'var(--text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
export default DashboardPage
