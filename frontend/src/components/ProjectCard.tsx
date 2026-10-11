import React from 'react'
import { IconGitHub, IconExternalLink, IconArrowRight } from './Icons'
import type { Project } from '../types'
import { Link } from 'react-router-dom'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const techColors = [
    '#10b981', '#06b6d4', '#6366f1', '#f59e0b',
    '#ec4899', '#8b5cf6', '#f97316', '#84cc16',
  ]

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md), var(--shadow-glow)'
        e.currentTarget.style.borderColor = 'var(--border-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.borderColor = ''
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: '100%',
          height: '200px',
          overflow: 'hidden',
          flexShrink: 0,
          background: 'linear-gradient(135deg, var(--bg-surface), rgba(16, 185, 129, 0.08))',
          position: 'relative',
        }}
      >
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.08))',
            }}
          >
            💻
          </div>
        )}

        {/* Status badge overlay */}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <span className={`status-badge ${project.status}`}>
            {project.status === 'published' ? '● Live' : '◎ Draft'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3
          style={{
            fontSize: '1.08rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            lineHeight: 1.35,
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.short_description}
        </p>

        {/* Tech Stack Tags */}
        {project.technologies.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {project.technologies.slice(0, 4).map((tech, i) => (
              <span
                key={tech}
                className="tag"
                style={{
                  borderColor: `${techColors[i % techColors.length]}40`,
                  color: techColors[i % techColors.length],
                }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="tag">+{project.technologies.length - 4}</span>
            )}
          </div>
        )}

        {/* Key Features Preview */}
        {project.features.length > 0 && (
          <ul
            style={{
              paddingLeft: '16px',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            {project.features.slice(0, 2).map((f, i) => (
              <li
                key={i}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-subtle)',
                  lineHeight: 1.5,
                }}
              >
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* Action Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
          }}
        >
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              title="View source code"
              aria-label="GitHub Repository"
            >
              <IconGitHub size={16} />
              <span>Code</span>
            </a>
          )}

          {project.live_demo_url && (
            <a
              href={project.live_demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              title="View live demo"
              aria-label="Live Demo"
            >
              <IconExternalLink size={16} />
              <span>Demo</span>
            </a>
          )}

          <Link
            to={`/projects/${project.slug}`}
            className="btn btn-sm"
            style={{
              marginLeft: 'auto',
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--accent-primary)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
            title="View project details"
          >
            <span>Details</span>
            <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
