import React from 'react'
import { IconAward, IconCheck } from './Icons'

const certifications = [
  {
    title: 'Application Developer – Web & Mobile',
    issuer: 'IT-ITeS Sector Skill Council / NCVET',
    detail: 'NSQF Level 5 | Grade A',
    extra: '540 hours of structured training',
    color: 'var(--accent-primary)',
  },
  {
    title: 'Full Stack Development Internship',
    issuer: 'NoviTech R&D Private Limited',
    detail: 'September 4 – October 14, 2024',
    extra: 'Hands-on full-stack project development',
    color: 'var(--accent-secondary)',
  },
  {
    title: 'React JS Bootcamp',
    issuer: 'NoviTech R&D Private Limited',
    detail: 'September 27, 2024',
    extra: '2-hour intensive workshop',
    color: 'var(--accent-tertiary)',
  },
]

export const Certifications: React.FC = () => {
  return (
    <section id="certifications" className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-pill">
            <IconAward size={14} />
            Certifications
          </div>
          <h2 className="section-title">Credentials & Training</h2>
          <p className="section-subtitle">
            Recognized learning achievements that validate my technical skills and professional development.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            maxWidth: '960px',
            margin: '0 auto',
          }}
        >
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '28px',
                borderLeft: `3px solid ${cert.color}`,
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: `${cert.color}18`,
                  color: cert.color,
                  marginBottom: '16px',
                }}
              >
                <IconAward size={22} />
              </div>

              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: 'var(--text-main)',
                  lineHeight: 1.35,
                }}
              >
                {cert.title}
              </h3>

              <p
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: cert.color,
                  marginBottom: '6px',
                }}
              >
                {cert.issuer}
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  marginTop: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.83rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <IconCheck size={14} style={{ color: cert.color, flexShrink: 0 }} />
                  {cert.detail}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.83rem',
                    color: 'var(--text-subtle)',
                  }}
                >
                  <IconCheck size={14} style={{ color: cert.color, flexShrink: 0 }} />
                  {cert.extra}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
