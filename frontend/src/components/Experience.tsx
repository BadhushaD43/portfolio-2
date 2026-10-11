import React from 'react'
import { IconBriefcase } from './Icons'

const experiences = [
  {
    role: 'Junior Backend Developer',
    company: 'iZone Technologies',
    period: '2026 – Present',
    type: 'Full-time',
    responsibilities: [
      'Contribute to backend application development and web application functionality.',
      'Work with backend application logic, APIs, databases, and frontend-backend integration.',
      'Apply Java and Spring fundamentals in backend development and application maintenance.',
    ],
    stack: ['Java', 'Spring Framework', 'APIs', 'Databases'],
    current: true,
  },
  {
    role: 'Full Stack Web Developer',
    company: 'Freelance',
    period: '2025 – 2026',
    type: 'Freelance',
    responsibilities: [
      'Developed full-stack applications using React.js, FastAPI, PostgreSQL, and MySQL.',
      'Built responsive frontend interfaces and integrated them with backend REST APIs.',
      'Implemented database-driven functionality for data management applications.',
      'Used Git and GitHub for source-code management and version control.',
      'Deployed applications using Vercel and Render.',
    ],
    stack: ['React.js', 'FastAPI', 'PostgreSQL', 'MySQL', 'Git', 'Vercel', 'Render'],
    current: false,
  },
]

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-pill">
            <IconBriefcase size={14} />
            Experience
          </div>
          <h2 className="section-title">Professional Journey</h2>
          <p className="section-subtitle">
            A track record of building practical, scalable software solutions across backend and full-stack domains.
          </p>
        </div>

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          {/* Timeline vertical line */}
          <div
            style={{
              position: 'absolute',
              left: '28px',
              top: '48px',
              bottom: '48px',
              width: '2px',
              background: 'var(--border-subtle)',
              zIndex: 0,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '28px',
                  position: 'relative',
                }}
              >
                {/* Timeline node */}
                <div
                  style={{
                    flexShrink: 0,
                    width: '58px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: exp.current
                        ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                        : 'var(--bg-card)',
                      border: exp.current ? 'none' : '2px solid var(--border-medium)',
                      color: exp.current ? '#ffffff' : 'var(--text-muted)',
                      boxShadow: exp.current ? 'var(--shadow-glow)' : 'none',
                    }}
                  >
                    <IconBriefcase size={22} />
                  </div>
                </div>

                {/* Experience Card */}
                <div
                  className="card"
                  style={{
                    flex: 1,
                    padding: '24px 28px',
                    borderColor: exp.current ? 'var(--border-accent)' : undefined,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginBottom: '14px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          marginBottom: '4px',
                        }}
                      >
                        {exp.role}
                      </h3>
                      <p style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                        {exp.company}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)',
                          background: 'var(--bg-input)',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {exp.period}
                      </span>
                      {exp.current && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: 'var(--accent-primary)',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            padding: '2px 10px',
                            borderRadius: 'var(--radius-full)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: 'var(--accent-primary)',
                              display: 'inline-block',
                            }}
                          />
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  <ul
                    style={{
                      marginBottom: '18px',
                      paddingLeft: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    {exp.responsibilities.map((resp, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: '0.92rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.65,
                        }}
                      >
                        {resp}
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {exp.stack.map((tech) => (
                      <span key={tech} className="tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
