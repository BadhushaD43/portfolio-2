import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api, getAssetUrl } from '../api/client'
import type { Project } from '../types'
import { IconGitHub, IconExternalLink, IconArrowRight, IconAlertCircle } from '../components/Icons'

const fmtDate = (v: string) =>
  new Date(v).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })

const css = `
.pd {
  --p-blue: #1f6bff;
  --p-title: var(--text-main, #f5f8ff);
  --p-text: var(--text-muted, #b4bed3);
  --p-subtle: var(--text-subtle, #7f8aa5);
  --p-line: rgba(255, 255, 255, 0.12);
  --p-line-strong: rgba(255, 255, 255, 0.28);
  --p-wash: rgba(31, 107, 255, 0.1);
  --p-img-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.8);
}
:root[data-theme='light'] .pd,
:root.light .pd,
.light .pd,
[data-theme='light'] .pd {
  --p-blue: #0f5fe8;
  --p-title: var(--text-main, #0b1633);
  --p-text: var(--text-muted, #475673);
  --p-subtle: var(--text-subtle, #7683a0);
  --p-line: rgba(11, 22, 51, 0.12);
  --p-line-strong: rgba(11, 22, 51, 0.3);
  --p-wash: rgba(15, 95, 232, 0.07);
  --p-img-shadow: 0 40px 70px -40px rgba(20, 40, 90, 0.45);
}

@keyframes pd-rise {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pd-line {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes pd-shimmer {
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}
@keyframes pd-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
  50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
}

.pd-in { opacity: 0; animation: pd-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: var(--d, 0s); }
.pd-reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); transition-delay: var(--d, 0s); }
.pd-reveal.pd-visible { opacity: 1; transform: none; }

.pd {
  position: relative;
  min-height: 100vh;
  padding: calc(var(--header-height, 72px) + 48px) 0 100px;
}
.pd-wrap { max-width: 1120px; }

/* breadcrumb – plain text */
.pd-crumbs { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 0.82rem; color: var(--p-subtle); margin-bottom: 56px; }
.pd-crumbs a { color: var(--p-subtle); transition: color 0.2s; }
.pd-crumbs a:hover { color: var(--p-blue); }
.pd-crumbs .pd-here { color: var(--p-title); }

/* hero */
.pd-eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--p-blue); }
.pd-eyebrow::before { content: ''; width: 36px; height: 2px; background: var(--p-blue); transform-origin: left; animation: pd-line 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both; }
.pd-title {
  font-size: clamp(2.6rem, 7vw, 5.2rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.02;
  color: var(--p-title);
  margin: 0;
  max-width: 900px;
}
.pd-lead {
  font-size: clamp(1.1rem, 1.8vw, 1.35rem);
  line-height: 1.65;
  color: var(--p-text);
  max-width: 680px;
  margin: 28px 0 0;
}

/* facts strip – no boxes, only hairlines */
.pd-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  margin-top: 52px;
  border-top: 1px solid var(--p-line);
  border-bottom: 1px solid var(--p-line);
}
.pd-fact { padding: 20px 24px 20px 0; }
.pd-fact + .pd-fact { padding-left: 24px; border-left: 1px solid var(--p-line); }
.pd-fact-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--p-subtle); margin-bottom: 8px; }
.pd-fact-value { font-size: 1.05rem; font-weight: 600; color: var(--p-title); display: flex; align-items: center; gap: 8px; }
.pd-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: pd-pulse 2.4s ease-in-out infinite; }
.pd-dot.draft { background: #f59e0b; animation: none; }

/* actions – text links with arrows */
.pd-actions { display: flex; align-items: center; gap: 32px; flex-wrap: wrap; margin-top: 36px; }
.pd-cta {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 26px;
  border-radius: 6px;
  background: var(--p-blue);
  color: #fff;
  font-size: 0.95rem; font-weight: 600;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.pd-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -14px var(--p-blue); }
.pd-textlink {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 0.95rem; font-weight: 600; color: var(--p-title);
  padding-bottom: 4px;
  background: linear-gradient(var(--p-blue), var(--p-blue)) left bottom / 100% 1.5px no-repeat;
  transition: color 0.25s ease, background-size 0.35s ease;
}
.pd-textlink:hover { color: var(--p-blue); }

/* image – clean, no frame */
.pd-figure { margin: 72px 0 0; }
.pd-figure-inner { overflow: hidden; border-radius: 10px; box-shadow: var(--p-img-shadow); background: var(--p-wash); }
.pd-figure img { display: block; width: 100%; aspect-ratio: 16 / 8; object-fit: cover; object-position: top center; transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
.pd-figure:hover img { transform: scale(1.025); }
.pd-figure figcaption { display: flex; justify-content: space-between; gap: 16px; margin-top: 14px; font-size: 0.78rem; color: var(--p-subtle); }
.pd-noimg { aspect-ratio: 16 / 7; display: flex; align-items: flex-end; padding: 32px; font-size: clamp(4rem, 14vw, 9rem); font-weight: 800; letter-spacing: -0.06em; line-height: 0.8; color: var(--p-blue); opacity: 0.4; }

/* body */
.pd-body { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 96px; margin-top: 96px; align-items: start; }
.pd-section + .pd-section { margin-top: 80px; }
.pd-label { display: flex; align-items: baseline; gap: 14px; margin: 0 0 28px; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--p-subtle); }
.pd-label span { color: var(--p-blue); }
.pd-heading { font-size: clamp(1.7rem, 3vw, 2.3rem); font-weight: 700; letter-spacing: -0.025em; line-height: 1.15; color: var(--p-title); margin: 0 0 24px; }
.pd-prose p { font-size: 1.06rem; line-height: 1.9; color: var(--p-text); margin: 0 0 20px; max-width: 680px; }
.pd-prose p:first-child::first-letter { color: var(--p-title); font-weight: 700; }

/* features – ruled list */
.pd-features { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--p-line); }
.pd-feature {
  display: grid; grid-template-columns: 56px 1fr;
  align-items: baseline;
  padding: 22px 0;
  border-bottom: 1px solid var(--p-line);
  position: relative;
  transition: padding-left 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.pd-feature::after { content: ''; position: absolute; left: 0; bottom: -1px; height: 1px; width: 100%; background: var(--p-blue); transform: scaleX(0); transform-origin: left; transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.pd-feature:hover { padding-left: 10px; }
.pd-feature:hover::after { transform: scaleX(1); }
.pd-feature-num { font-size: 0.85rem; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--p-blue); }
.pd-feature-text { font-size: 1.04rem; line-height: 1.6; color: var(--p-title); }

/* sidebar – open, ruled */
.pd-side { position: sticky; top: calc(var(--header-height, 72px) + 32px); }
.pd-side-block { padding-bottom: 28px; margin-bottom: 28px; border-bottom: 1px solid var(--p-line); }
.pd-side-block:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.pd-side-title { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--p-subtle); margin: 0 0 16px; }
.pd-tech { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.pd-tech li {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0; font-size: 0.95rem; font-weight: 500; color: var(--p-title);
  border-bottom: 1px dashed var(--p-line);
  transition: color 0.2s ease, padding-left 0.3s ease;
}
.pd-tech li:last-child { border-bottom: none; }
.pd-tech li:hover { color: var(--p-blue); padding-left: 6px; }
.pd-tech li i { font-style: normal; font-size: 0.72rem; color: var(--p-subtle); font-variant-numeric: tabular-nums; }
.pd-link {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 12px 0; font-size: 0.95rem; font-weight: 600; color: var(--p-title);
  border-bottom: 1px solid var(--p-line);
  transition: color 0.2s ease;
}
.pd-link:first-of-type { padding-top: 0; }
.pd-link:last-of-type { border-bottom: none; padding-bottom: 0; }
.pd-link:hover { color: var(--p-blue); }
.pd-link-l { display: inline-flex; align-items: center; gap: 10px; }
.pd-link-r { display: inline-flex; transition: transform 0.3s ease; }
.pd-link:hover .pd-link-r { transform: translateX(5px); }
.pd-meta-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.9rem; color: var(--p-subtle); }
.pd-meta-row b { color: var(--p-title); font-weight: 600; }

/* footer */
.pd-foot { margin-top: 110px; padding-top: 32px; border-top: 1px solid var(--p-line); display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.pd-back { display: inline-flex; align-items: center; gap: 12px; font-size: 0.95rem; font-weight: 600; color: var(--p-title); transition: color 0.25s ease; }
.pd-back:hover { color: var(--p-blue); }
.pd-back-arrow { display: inline-flex; transform: rotate(180deg); transition: transform 0.3s ease; }
.pd-back:hover .pd-back-arrow { transform: rotate(180deg) translateX(6px); }
.pd-top { font-size: 0.82rem; color: var(--p-subtle); cursor: pointer; background: none; border: none; transition: color 0.2s; }
.pd-top:hover { color: var(--p-blue); }

/* states */
.pd-center { min-height: 70vh; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 18px; text-align: center; }
.pd-skel { border-radius: 6px; background: linear-gradient(90deg, var(--p-wash) 25%, var(--p-line) 50%, var(--p-wash) 75%); background-size: 1200px 100%; animation: pd-shimmer 1.5s linear infinite; }

@media (max-width: 960px) {
  .pd-body { grid-template-columns: 1fr; gap: 64px; margin-top: 72px; }
  .pd-side { position: static; }
}
@media (max-width: 640px) {
  .pd-crumbs { margin-bottom: 36px; }
  .pd-facts { grid-template-columns: 1fr 1fr; }
  .pd-fact, .pd-fact + .pd-fact { padding: 18px 12px 18px 0; border-left: none; }
  .pd-fact:nth-child(even) { padding-left: 16px; border-left: 1px solid var(--p-line); }
  .pd-figure { margin-top: 48px; }
  .pd-feature { grid-template-columns: 40px 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .pd-in { animation: none; opacity: 1; }
  .pd-reveal { opacity: 1; transform: none; transition: none; }
  .pd-eyebrow::before, .pd-dot, .pd-skel { animation: none; }
  .pd-figure img, .pd-feature, .pd-feature::after, .pd-tech li, .pd-cta, .pd-link-r, .pd-back-arrow { transition: none; }
}
`

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) { navigate('/'); return }
    setLoading(true)
    api.getPublicProject(slug)
      .then(setProject)
      .catch(() => setError('Project not found or unavailable.'))
      .finally(() => setLoading(false))
  }, [slug, navigate])

  // Reveal sections on scroll
  useEffect(() => {
    if (!project) return
    const els = document.querySelectorAll<HTMLElement>('.pd-reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('pd-visible'))
      return
    }
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('pd-visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.1 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [project])

  const d = (s: number) => ({ '--d': `${s}s` } as React.CSSProperties)

  if (loading) return (
    <div className="pd">
      <style>{css}</style>
      <div className="container pd-wrap">
        <div className="pd-skel" style={{ width: 220, height: 14, marginBottom: 56 }} />
        <div className="pd-skel" style={{ width: '70%', height: 74, marginBottom: 20 }} />
        <div className="pd-skel" style={{ width: '45%', height: 22, marginBottom: 56 }} />
        <div className="pd-skel" style={{ width: '100%', height: 360 }} />
      </div>
    </div>
  )

  if (error || !project) return (
    <div className="pd">
      <style>{css}</style>
      <div className="container pd-wrap pd-center">
        <IconAlertCircle size={44} style={{ color: 'var(--status-error)', opacity: 0.75 }} />
        <p style={{ color: 'var(--p-text)', fontSize: '1.05rem', margin: 0 }}>{error || 'Project not found.'}</p>
        <Link to="/#projects" className="pd-back">
          <span className="pd-back-arrow"><IconArrowRight size={16} /></span>
          Back to Projects
        </Link>
      </div>
    </div>
  )

  const isPublished = project.status === 'published'
  const paragraphs = (project.description || '').split(/\n+/).filter(Boolean)
  const hasLinks = !!(project.github_url || project.live_demo_url)
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="pd">
      <style>{css}</style>

      <div className="container pd-wrap">

        {/* Breadcrumb */}
        <nav className="pd-crumbs pd-in" style={d(0.05)}>
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/#projects">Projects</Link>
          <span>/</span>
          <span className="pd-here">{project.title}</span>
        </nav>

        {/* Hero */}
        <header>
          <div className="pd-eyebrow pd-in" style={d(0.15)}>
            Case Study{project.display_order > 0 ? ` · No. ${pad(project.display_order)}` : ''}
          </div>
          <h1 className="pd-title pd-in" style={d(0.25)}>{project.title}</h1>
          <p className="pd-lead pd-in" style={d(0.4)}>{project.short_description}</p>

          <div className="pd-actions pd-in" style={d(0.55)}>
            {project.live_demo_url && (
              <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" className="pd-cta">
                <IconExternalLink size={17} />
                Live Demo
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="pd-textlink">
                <IconGitHub size={17} />
                Source Code
              </a>
            )}
          </div>

          {/* Facts strip */}
          <div className="pd-facts pd-in" style={d(0.7)}>
            <div className="pd-fact">
              <div className="pd-fact-label">Status</div>
              <div className="pd-fact-value">
                <span className={`pd-dot ${isPublished ? '' : 'draft'}`} />
                {isPublished ? 'Live' : 'Draft'}
              </div>
            </div>
            {project.created_at && (
              <div className="pd-fact">
                <div className="pd-fact-label">Year</div>
                <div className="pd-fact-value">{new Date(project.created_at).getFullYear()}</div>
              </div>
            )}
            <div className="pd-fact">
              <div className="pd-fact-label">Technologies</div>
              <div className="pd-fact-value">{pad(project.technologies.length)}</div>
            </div>
            <div className="pd-fact">
              <div className="pd-fact-label">Features</div>
              <div className="pd-fact-value">{pad(project.features.length)}</div>
            </div>
          </div>
        </header>

        {/* Image */}
        <figure className="pd-figure pd-in" style={d(0.85)}>
          <div className="pd-figure-inner">
            {project.thumbnail_url ? (
              <img src={getAssetUrl(project.thumbnail_url)} alt={project.title} />
            ) : (
              <div className="pd-noimg">{project.title.slice(0, 2)}</div>
            )}
          </div>
          <figcaption>
            <span>{project.title}</span>
            <span>{isPublished ? 'Production build' : 'Work in progress'}</span>
          </figcaption>
        </figure>

        {/* Body */}
        <div className="pd-body">
          <main>
            {paragraphs.length > 0 && (
              <section className="pd-section pd-reveal">
                <div className="pd-label"><span>01</span> Overview</div>
                <h2 className="pd-heading">About the project</h2>
                <div className="pd-prose">
                  {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </section>
            )}

            {project.features.length > 0 && (
              <section className="pd-section pd-reveal">
                <div className="pd-label"><span>{paragraphs.length > 0 ? '02' : '01'}</span> Features</div>
                <h2 className="pd-heading">What it does</h2>
                <ul className="pd-features">
                  {project.features.map((feature, i) => (
                    <li key={i} className="pd-feature pd-reveal" style={d(Math.min(i, 6) * 0.06)}>
                      <span className="pd-feature-num">{pad(i + 1)}</span>
                      <span className="pd-feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </main>

          <aside className="pd-side pd-reveal" style={d(0.1)}>
            {project.technologies.length > 0 && (
              <div className="pd-side-block">
                <h3 className="pd-side-title">Built with</h3>
                <ul className="pd-tech">
                  {project.technologies.map((tech, i) => (
                    <li key={tech}>
                      {tech}
                      <i>{pad(i + 1)}</i>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hasLinks && (
              <div className="pd-side-block">
                <h3 className="pd-side-title">Links</h3>
                {project.live_demo_url && (
                  <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" className="pd-link">
                    <span className="pd-link-l"><IconExternalLink size={17} /> Live Demo</span>
                    <span className="pd-link-r"><IconArrowRight size={15} /></span>
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="pd-link">
                    <span className="pd-link-l"><IconGitHub size={17} /> GitHub Repository</span>
                    <span className="pd-link-r"><IconArrowRight size={15} /></span>
                  </a>
                )}
              </div>
            )}

            {project.created_at && (
              <div className="pd-side-block">
                <h3 className="pd-side-title">Timeline</h3>
                <div className="pd-meta-row"><span>Created</span><b>{fmtDate(project.created_at)}</b></div>
                {project.updated_at && (
                  <div className="pd-meta-row"><span>Updated</span><b>{fmtDate(project.updated_at)}</b></div>
                )}
              </div>
            )}
          </aside>
        </div>

        {/* Footer */}
        <div className="pd-foot">
          <Link to="/#projects" className="pd-back">
            <span className="pd-back-arrow"><IconArrowRight size={16} /></span>
            Back to All Projects
          </Link>
          <button className="pd-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top ↑
          </button>
        </div>
      </div>
    </div>
  )
}