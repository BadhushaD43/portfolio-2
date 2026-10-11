import React, { useEffect, useState } from 'react'
import { IconLayers, IconAlertCircle, IconRefresh } from './Icons'
import { ProjectCard } from './ProjectCard'
import { api } from '../api/client'
import type { Project } from '../types'

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getPublicProjects()
      setProjects(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load projects.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-pill">
            <IconLayers size={14} />
            Projects
          </div>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Production-ready systems and full-stack applications demonstrating backend engineering, API design, and real-world problem solving.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card"
                style={{
                  height: '360px',
                  background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s ease infinite',
                }}
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <IconAlertCircle size={48} style={{ color: 'var(--status-error)', opacity: 0.7 }} />
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>{error}</p>
            <button onClick={loadProjects} className="btn btn-secondary">
              <IconRefresh size={16} />
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '3rem' }}>🚧</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>No Projects Yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '380px' }}>
              Projects will appear here once they are published from the admin dashboard.
            </p>
          </div>
        )}

        {/* Project Cards Grid */}
        {!loading && !error && projects.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  )
}
