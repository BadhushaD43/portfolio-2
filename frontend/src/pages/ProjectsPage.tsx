import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { IconLayers, IconAlertCircle, IconRefresh, IconArrowRight } from '../components/Icons'
import { ProjectCard } from '../components/ProjectCard'
import { api } from '../api/client'
import type { Project } from '../types'

const ITEMS_PER_PAGE = 6

const STATS = [
  { value: '10+', title: 'CRM Portals', text: 'Interconnected role workflows, stage pipelines, and approvals.' },
  { value: 'RESTful', title: 'Clean APIs', text: 'JWT auth, request validation schemas, and database pooling.' },
  { value: 'SQL', title: 'Relational DBs', text: 'PostgreSQL and MySQL relational database schemas.' },
]

const TECHS = [
  'React.js', 'FastAPI', 'Java', 'Spring Boot', 'PostgreSQL', 'MySQL',
  'Tailwind CSS', 'TypeScript', 'Python', 'SQLAlchemy', 'JWT Auth', 'MinIO',
  'Git', 'Vercel', 'Render', 'REST APIs',
]

/*
 * Scoped CSS with explicit spacing (no Tailwind). Your global CSS resets padding and
 * margins, which is why the filter pills, pagination, cards and chips looked squashed,
 * and why the CTA button text vanished (white text on a white button).
 * Colours follow your theme variables, so dark and light mode both work.
 */
const css = `
.pj-page {
  --p-blue: #2563eb;
  --p-title: var(--text-main, currentColor);
  --p-text: var(--text-muted, currentColor);
  --p-line: color-mix(in srgb, var(--p-title) 14%, transparent);
  --p-chip: color-mix(in srgb, var(--p-title) 7%, transparent);
  --p-tint: color-mix(in srgb, var(--p-title) 3%, transparent);
  width: 100%;
  padding-top: var(--header-height, 72px);
}
.pj-page, .pj-page *, .pj-page *::before, .pj-page *::after { box-sizing: border-box; }

.pj-section { padding: 88px 0; }
.pj-section.tint { background: var(--p-tint); border-top: 1px solid var(--p-line); border-bottom: 1px solid var(--p-line); }
.pj-wrap { max-width: 1180px; margin: 0 auto; }

/* ---------- header ---------- */
.pj-head { display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 720px; margin: 0 auto 44px; }
.pj-pill {
  display: inline-flex; align-items: center; gap: 8px;
  margin: 0 0 22px; padding: 7px 16px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12); border: 1px solid rgba(37, 99, 235, 0.35);
  color: #3b82f6; font-size: 0.75rem; font-weight: 700; line-height: 1; letter-spacing: 0.1em; text-transform: uppercase;
}
.pj-title { margin: 0 0 16px; padding: 0; font-size: clamp(2.2rem, 5vw, 3.6rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.035em; color: var(--p-title); }
.pj-title em { font-style: normal; background: linear-gradient(90deg, #3b82f6, #06b6d4); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.pj-sub { margin: 0; padding: 0; font-size: 1.05rem; line-height: 1.7; color: var(--p-text); }

/* ---------- filters ---------- */
.pj-filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: 0 auto 52px; padding: 0; max-width: 860px; }
.pj-page button.pj-filter {
  display: inline-flex; align-items: center; justify-content: center;
  height: 38px; margin: 0; padding: 0 20px !important;
  border-radius: 999px;
  background: var(--p-chip); border: 1px solid var(--p-line);
  color: var(--p-text); font: inherit; font-size: 0.85rem; font-weight: 600; line-height: 1; white-space: nowrap;
  cursor: pointer;
  transition: transform .25s ease, background-color .25s ease, color .25s ease, border-color .25s ease, box-shadow .25s ease;
}
.pj-page button.pj-filter:hover { transform: translateY(-2px); border-color: rgba(59, 130, 246, 0.6); color: var(--p-title); }
.pj-page button.pj-filter.active { background: var(--p-blue); border-color: var(--p-blue); color: #fff; box-shadow: 0 10px 24px -10px rgba(37, 99, 235, 0.9); }

/* ---------- grid ---------- */
.pj-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; margin: 0; padding: 0; }
.pj-cell { min-width: 0; opacity: 0; animation: pj-rise .7s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: var(--d, 0s); }
.pj-cell > * { height: 100%; }

/* skeleton */
.pj-skel { height: 400px; border-radius: 20px; background: linear-gradient(90deg, var(--p-chip) 25%, rgba(37, 99, 235, 0.14) 50%, var(--p-chip) 75%); background-size: 900px 100%; animation: pj-shimmer 1.4s linear infinite; }

/* states */
.pj-state { display: flex; flex-direction: column; align-items: center; gap: 14px; margin: 0 auto; padding: 72px 0; text-align: center; max-width: 440px; }
.pj-state-title { margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--p-title); }
.pj-state-text { margin: 0; font-size: 0.95rem; line-height: 1.6; color: var(--p-text); }
.pj-page button.pj-retry {
  display: inline-flex; align-items: center; gap: 8px; height: 44px; margin-top: 8px; padding: 0 24px !important;
  border-radius: 999px; background: transparent; border: 1.5px solid var(--p-line); color: var(--p-title);
  font: inherit; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: border-color .25s ease, color .25s ease, transform .25s ease;
}
.pj-page button.pj-retry:hover { border-color: var(--p-blue); color: #3b82f6; transform: translateY(-2px); }

/* ---------- pagination ---------- */
.pj-pager { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 64px 0 0; padding: 0; flex-wrap: wrap; }
.pj-pages { display: flex; align-items: center; gap: 8px; margin: 0; padding: 0; }
.pj-page button.pj-pbtn {
  display: inline-flex; align-items: center; justify-content: center;
  height: 42px; min-width: 42px; margin: 0; padding: 0 18px !important;
  border-radius: 12px; background: transparent; border: 1px solid var(--p-line);
  color: var(--p-title); font: inherit; font-size: 0.88rem; font-weight: 600; line-height: 1; cursor: pointer;
  transition: background-color .25s ease, border-color .25s ease, color .25s ease, transform .25s ease, box-shadow .25s ease;
}
.pj-page button.pj-pbtn.num { padding: 0 !important; width: 42px; }
.pj-page button.pj-pbtn:hover:not(:disabled) { border-color: rgba(59, 130, 246, 0.7); color: #3b82f6; transform: translateY(-2px); }
.pj-page button.pj-pbtn.active { background: var(--p-blue); border-color: var(--p-blue); color: #fff; box-shadow: 0 10px 24px -10px rgba(37, 99, 235, 0.9); }
.pj-page button.pj-pbtn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ---------- stats ---------- */
.pj-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); max-width: 1000px; margin: 0 auto; padding: 0; list-style: none; }
.pj-stat { position: relative; margin: 0; padding: 12px 36px; text-align: center; }
.pj-stat + .pj-stat { border-left: 1px solid var(--p-line); }
.pj-stat-val { display: block; margin: 0 0 14px; font-size: clamp(2.2rem, 4vw, 3rem); font-weight: 800; line-height: 1; letter-spacing: -0.04em; background: linear-gradient(90deg, #3b82f6, #06b6d4); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.pj-stat-title { margin: 0 0 8px; padding: 0; font-size: 1.15rem; font-weight: 700; line-height: 1.3; color: var(--p-title); }
.pj-stat-text { margin: 0 auto; padding: 0; max-width: 280px; font-size: 0.9rem; line-height: 1.65; color: var(--p-text); }

/* ---------- tech chips ---------- */
.pj-tech-title { margin: 0 0 40px; padding: 0; text-align: center; font-size: clamp(1.7rem, 3.4vw, 2.3rem); font-weight: 800; line-height: 1.2; letter-spacing: -0.025em; color: var(--p-title); }
.pj-tech { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; max-width: 900px; margin: 0 auto; padding: 0; list-style: none; }
.pj-tech li {
  display: inline-flex; align-items: center; justify-content: center;
  height: 40px; margin: 0; padding: 0 20px;
  border-radius: 999px;
  background: var(--p-chip); border: 1px solid var(--p-line);
  color: var(--p-title); font-size: 0.85rem; font-weight: 600; line-height: 1; white-space: nowrap;
  transition: transform .25s ease, border-color .25s ease, color .25s ease, background-color .25s ease;
}
.pj-tech li:hover { transform: translateY(-3px); border-color: rgba(59, 130, 246, 0.7); color: #3b82f6; background: rgba(37, 99, 235, 0.1); }

/* ---------- CTA ---------- */
.pj-cta { padding: 96px 0; background: linear-gradient(120deg, #1d4ed8, #4f46e5); position: relative; overflow: hidden; }
.pj-cta::before, .pj-cta::after { content: ''; position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.08); pointer-events: none; }
.pj-cta::before { width: 360px; height: 360px; left: -100px; top: -160px; }
.pj-cta::after { width: 300px; height: 300px; right: -80px; bottom: -150px; }
.pj-cta-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; max-width: 720px; margin: 0 auto; text-align: center; }
.pj-cta-title { margin: 0 0 16px; padding: 0; font-size: clamp(1.9rem, 4vw, 2.8rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; color: #fff; }
.pj-cta-text { margin: 0 0 36px; padding: 0; max-width: 560px; font-size: 1.05rem; line-height: 1.75; color: rgba(255, 255, 255, 0.85); }
.pj-page a.pj-cta-btn {
  display: inline-flex !important; align-items: center; justify-content: center; gap: 10px;
  height: 52px; margin: 0; padding: 0 32px !important;
  border-radius: 999px; background: #fff !important; color: #1d4ed8 !important;
  font-size: 0.98rem; font-weight: 700; line-height: 1; text-decoration: none; white-space: nowrap;
  box-shadow: 0 18px 36px -16px rgba(0, 0, 0, 0.55);
  transition: transform .25s ease, box-shadow .25s ease;
}
.pj-page a.pj-cta-btn span { color: #1d4ed8; }
.pj-page a.pj-cta-btn:hover { transform: translateY(-3px); box-shadow: 0 24px 44px -16px rgba(0, 0, 0, 0.6); }
.pj-page a.pj-cta-btn .pj-cta-arrow { display: inline-flex; color: #1d4ed8; transition: transform .25s ease; }
.pj-page a.pj-cta-btn:hover .pj-cta-arrow { transform: translateX(5px); }

/* ---------- animation ---------- */
.pj-reveal { opacity: 0; transform: translateY(24px); transition: opacity .75s ease, transform .75s cubic-bezier(0.22, 1, 0.36, 1); transition-delay: var(--d, 0s); }
.pj-reveal.pj-visible { opacity: 1; transform: none; }
@keyframes pj-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes pj-shimmer { 0% { background-position: -900px 0; } 100% { background-position: 900px 0; } }

/* ---------- responsive ---------- */
@media (max-width: 1000px) {
  .pj-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 760px) {
  .pj-section { padding: 64px 0; }
  .pj-grid { grid-template-columns: 1fr; gap: 24px; }
  .pj-stats { grid-template-columns: 1fr; }
  .pj-stat { padding: 32px 12px; }
  .pj-stat + .pj-stat { border-left: none; border-top: 1px solid var(--p-line); }
  .pj-cta { padding: 72px 0; }
}
@media (prefers-reduced-motion: reduce) {
  .pj-cell, .pj-reveal { animation: none; opacity: 1; transform: none; transition: none; }
  .pj-skel { animation: none; }
}
`

const d = (s: number) => ({ '--d': `${s}s` } as React.CSSProperties)

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)

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

  // Extract all unique technology tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    projects.forEach((p) => {
      if (Array.isArray(p.technologies)) {
        p.technologies.forEach((t) => tags.add(t))
      }
    })
    return ['All', ...Array.from(tags)]
  }, [projects])

  // Filter projects by tag
  const filteredProjects = useMemo(() => {
    if (selectedTag === 'All') return projects
    return projects.filter(
      (p) => Array.isArray(p.technologies) && p.technologies.includes(selectedTag)
    )
  }, [projects, selectedTag])

  // Pagination calculation
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredProjects, currentPage])

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag)
    setCurrentPage(1)
  }

  // Reveal the lower sections on scroll
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.pj-page .pj-reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('pj-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('pj-visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main className="pj-page">
      <style>{css}</style>

      {/* Session 1: Projects Showcase Header */}
      <section className="pj-section" style={{ paddingBottom: 72 }}>
        <div className="container">
          <div className="pj-wrap">
            <div className="pj-head">
              <div className="pj-pill">
                <IconLayers size={14} />
                Portfolio
              </div>
              <h1 className="pj-title">
                Projects &amp; <em>Engineering</em> Work
              </h1>
              <p className="pj-sub">
                Real-world systems, microservices, database schemas, and full-stack applications. 6 projects per page with instant filtering.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="pj-filters">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagChange(tag)}
                  className={`pj-filter ${selectedTag === tag ? 'active' : ''}`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Loading Skeleton */}
            {loading && (
              <div className="pj-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="pj-skel" />
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="pj-state">
                <IconAlertCircle size={48} style={{ color: '#ef4444', opacity: 0.85 }} />
                <p className="pj-state-text">{error}</p>
                <button type="button" onClick={loadProjects} className="pj-retry">
                  <IconRefresh size={16} />
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredProjects.length === 0 && (
              <div className="pj-state">
                <span style={{ fontSize: '2.6rem', lineHeight: 1 }}>🔍</span>
                <h3 className="pj-state-title">No Projects Found</h3>
                <p className="pj-state-text">No projects matched the selected technology filter.</p>
              </div>
            )}

            {/* Project Grid */}
            {!loading && !error && filteredProjects.length > 0 && (
              <>
                <div className="pj-grid" key={`${selectedTag}-${currentPage}`}>
                  {paginatedProjects.map((project, i) => (
                    <div key={project.id} className="pj-cell" style={d(i * 0.08)}>
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>

                {/* Pagination Controls (6 items per page) */}
                <div className="pj-pager">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="pj-pbtn"
                  >
                    Previous
                  </button>

                  <div className="pj-pages">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`pj-pbtn num ${currentPage === pageNum ? 'active' : ''}`}
                          aria-current={currentPage === pageNum ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="pj-pbtn"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Session 2: System Architecture Focus */}
      <section className="pj-section tint">
        <div className="container">
          <ul className="pj-stats">
            {STATS.map((s, i) => (
              <li key={s.title} className="pj-stat pj-reveal" style={d(i * 0.1)}>
                <span className="pj-stat-val">{s.value}</span>
                <h3 className="pj-stat-title">{s.title}</h3>
                <p className="pj-stat-text">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Session 3: Tech Stack Breakdown */}
      <section className="pj-section">
        <div className="container">
          <div className="pj-wrap">
            <h2 className="pj-tech-title pj-reveal">Technologies Used Across Projects</h2>
            <ul className="pj-tech">
              {TECHS.map((tech, i) => (
                <li key={tech} className="pj-reveal" style={d(Math.min(i, 10) * 0.04)}>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Session 4: Custom Project Inquiries CTA */}
      <section className="pj-cta">
        <div className="container">
          <div className="pj-cta-inner pj-reveal">
            <h2 className="pj-cta-title">Interested in Collaborating on a Project?</h2>
            <p className="pj-cta-text">
              I am open to full-time engineering roles, freelance software contracts, and backend development opportunities.
            </p>
            <Link to="/contact" className="pj-cta-btn">
              <span>Let's Discuss</span>
              <span className="pj-cta-arrow"><IconArrowRight size={16} /></span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
export default ProjectsPage