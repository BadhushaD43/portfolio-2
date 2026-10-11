import React from 'react'
import { Link } from 'react-router-dom'
import { IconMail } from './Icons'

export const Footer: React.FC = () => {
  const year = new Date().getFullYear()
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        padding: '32px 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '0.88rem', color: 'var(--text-subtle)' }}>
          © {year}{' '}
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Badhusha D</span>
          {' '}· Junior Backend Developer
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="mailto:badhushad0@gmail.com"
            style={{ color: 'var(--text-subtle)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.18s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-subtle)')}
          >
            <IconMail size={14} />
            badhushad0@gmail.com
          </a>
          <Link
            to="/admin"
            style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', transition: 'color 0.18s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-subtle)')}
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
