import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import {
  LayoutDashboard,
  BriefcaseBusiness,
  MessagesSquare,
  FolderKanban,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  User,
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={19} />,
      exact: true,
    },
    {
      label: 'Business Messages',
      path: '/admin/business-messages',
      icon: <BriefcaseBusiness size={19} />,
    },
    {
      label: 'Social Connect',
      path: '/admin/social-connect',
      icon: <MessagesSquare size={19} />,
    },
    {
      label: 'Projects',
      path: '/admin/projects',
      icon: <FolderKanban size={19} />,
    },
    {
      label: 'Profile',
      path: '/admin/profile',
      icon: <User size={19} />,
    },
  ]

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--bg-base)',
        color: 'var(--text-main)',
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. Left Fixed Sidebar (Desktop)                               */}
      {/* ------------------------------------------------------------- */}
      <aside
        className="hidden md:flex flex-col"
        style={{
          width: '260px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
        }}
      >
        {/* Brand / Logo Header */}
        <div
          style={{
            height: '72px',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)',
              flexShrink: 0,
            }}
          >
            <Shield size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Badhusha D
            </h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Admin Console
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '20px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.92rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#ffffff' : 'var(--text-muted)',
                  background: active ? 'var(--accent-primary)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.18s ease',
                  boxShadow: active ? '0 4px 14px var(--accent-glow)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'var(--bg-input)'
                    e.currentTarget.style.color = 'var(--text-main)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', opacity: active ? 1 : 0.85 }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer User & Actions */}
        <div
          style={{
            padding: '18px 16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background: 'var(--bg-surface)',
          }}
        >
          <Link
            to="/admin/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              padding: '6px 8px',
              margin: '-6px -8px',
              borderRadius: 'var(--radius-md)',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-input)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
            title="Manage profile & CV"
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Signed In (Profile)
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--accent-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '180px',
                }}
                title={user?.email}
              >
                {user?.email}
              </div>
            </div>
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', padding: '7px 10px', gap: '6px' }}
              title="Open Public Portfolio in new tab"
            >
              <ExternalLink size={14} />
              Site
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-danger btn-sm"
              style={{ fontSize: '0.8rem', padding: '7px 10px', gap: '6px' }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. Mobile Responsive Topbar / Drawer                          */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden w-full fixed top-0 left-0 right-0 z-50">
        <header
          style={{
            height: '64px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span style={{ fontWeight: 800, fontSize: '0.98rem' }}>Admin Console</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/" target="_blank" className="btn btn-secondary btn-sm" style={{ padding: '6px 10px' }}>
              <ExternalLink size={14} />
            </Link>
            <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ padding: '6px 10px' }}>
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {navItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#ffffff' : 'var(--text-muted)',
                    background: active ? 'var(--accent-primary)' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Main Workspace Area                                        */}
      {/* ------------------------------------------------------------- */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          marginLeft: '0px',
          paddingTop: '64px',
        }}
        className="md:!ml-[260px] md:!pt-0"
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(20px, 3vw, 36px)' }}>
          {/* Page Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  margin: 0,
                  color: 'var(--text-main)',
                }}
              >
                {title}
              </h2>
              {subtitle && (
                <p style={{ margin: '4px 0 0', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                  {subtitle}
                </p>
              )}
            </div>

            {actions && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {actions}
              </div>
            )}
          </div>

          {/* Page Content Body */}
          {children}
        </div>
      </main>
    </div>
  )
}
export default AdminLayout
