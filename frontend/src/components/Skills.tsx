import React from 'react'
import { IconCode, IconDatabase, IconServer, IconLayers } from './Icons'

const skillCategories = [
  {
    icon: <IconCode size={22} />,
    title: 'Programming Languages',
    color: 'var(--accent-tertiary)',
    skills: ['Java', 'JavaScript', 'Python', 'SQL'],
  },
  {
    icon: <IconServer size={22} />,
    title: 'Backend',
    color: 'var(--accent-primary)',
    skills: ['FastAPI', 'Spring Framework', 'REST APIs', 'Python'],
  },
  {
    icon: <IconLayers size={22} />,
    title: 'Frontend',
    color: 'var(--accent-secondary)',
    skills: ['React.js', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript'],
  },
  {
    icon: <IconDatabase size={22} />,
    title: 'Databases',
    color: 'var(--accent-tertiary)',
    skills: ['PostgreSQL', 'MySQL'],
  },
]

const toolsAndDeployment = {
  Tools: ['Git', 'GitHub', 'MinIO'],
  'Hosting & Deployment': ['Vercel', 'Render'],
  'Development Areas': ['Backend Development', 'Full-Stack Web Development', 'API Integration', 'Database-Driven Applications'],
}

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-pill">
            <IconCode size={14} />
            Technical Skills
          </div>
          <h2 className="section-title">
            Technologies I Work With
          </h2>
          <p className="section-subtitle">
            A curated set of tools and technologies I use to design, build, and deploy robust software systems.
          </p>
        </div>

        {/* Primary Skill Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          {skillCategories.map((cat) => (
            <div
              key={cat.title}
              className="card"
              style={{
                padding: '28px',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: `${cat.color}18`,
                  color: cat.color,
                  marginBottom: '16px',
                }}
              >
                {cat.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
                {cat.title}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {cat.skills.map((skill) => (
                  <span key={skill} className="tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tools, Deployment & Dev Areas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {Object.entries(toolsAndDeployment).map(([category, items]) => (
            <div
              key={category}
              className="card"
              style={{ padding: '24px 28px' }}
            >
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {category}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {items.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
