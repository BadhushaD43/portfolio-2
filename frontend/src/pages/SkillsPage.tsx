import React, { useEffect } from 'react'
import { Skills as SkillsComponent } from '../components/Skills'
import { IconDatabase, IconTerminal, IconAward, IconLayers } from '../components/Icons'

const workflowSteps = [
  {
    step: '01',
    title: 'Architecture & Schema Design',
    desc: 'Modeling entity relationships, database indexing, and REST API contract specification.',
  },
  {
    step: '02',
    title: 'Robust Backend Development',
    desc: 'Writing maintainable server logic with Java/Spring or FastAPI with security and authentication.',
  },
  {
    step: '03',
    title: 'Frontend Integration',
    desc: 'Building responsive React user interfaces with clean state management and real-time updates.',
  },
  {
    step: '04',
    title: 'Deployment & Monitoring',
    desc: 'Containerized deployments, automated CI/CD pipelines, and active server observability.',
  },
]

const proficiencies = [
  { name: 'Core Java & OOP', level: 90 },
  { name: 'Spring Framework & REST APIs', level: 85 },
  { name: 'FastAPI & Python', level: 88 },
  { name: 'React.js & TypeScript', level: 85 },
  { name: 'PostgreSQL & MySQL', level: 86 },
  { name: 'Linux & Shell Scripting', level: 82 },
]

/* Best-practice visuals (illustrative, not measured data) */
const LAYERS = [
  { name: 'Controller', note: 'Request handling' },
  { name: 'Service', note: 'Business logic' },
  { name: 'Repository', note: 'Data access' },
  { name: 'Database', note: 'PostgreSQL · MySQL' },
]

const ENDPOINTS = [
  { method: 'GET', path: '/api/projects', status: '200' },
  { method: 'POST', path: '/api/projects', status: '201' },
  { method: 'GET', path: '/api/projects/{slug}', status: '200' },
]

/*
 * Scoped CSS with explicit spacing. Your global CSS resets padding/margins
 * (that's why Tailwind's p-6, mb-12, gap-* weren't applying), so nothing here
 * depends on Tailwind. Colours follow your theme variables, so dark/light work automatically.
 */
const css = `
.sk-page {
  --s-blue: #2563eb;
  --s-title: var(--text-main, currentColor);
  --s-text: var(--text-muted, currentColor);
  --s-line: color-mix(in srgb, var(--s-title) 14%, transparent);
  --s-chip: color-mix(in srgb, var(--s-title) 7%, transparent);
  --s-tint: color-mix(in srgb, var(--s-title) 3%, transparent);
  width: 100%;
  padding-top: var(--header-height, 72px);
}
.sk-page, .sk-page *, .sk-page *::before, .sk-page *::after { box-sizing: border-box; }

.sk-section { padding: 96px 0; }
.sk-section.tint { background: var(--s-tint); border-top: 1px solid var(--s-line); border-bottom: 1px solid var(--s-line); }
.sk-wrap { max-width: 1080px; margin: 0 auto; }

/* ---------- section header ---------- */
.sk-head { display: flex; flex-direction: column; align-items: center; text-align: center; margin: 0 auto 64px; max-width: 680px; }
.sk-pill {
  display: inline-flex; align-items: center; gap: 8px;
  margin: 0 0 20px; padding: 7px 16px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  border: 1px solid rgba(37, 99, 235, 0.35);
  color: #3b82f6;
  font-size: 0.75rem; font-weight: 700; line-height: 1; letter-spacing: 0.1em; text-transform: uppercase;
}
.sk-title { margin: 0 0 14px; padding: 0; font-size: clamp(2rem, 4.2vw, 2.9rem); font-weight: 800; line-height: 1.12; letter-spacing: -0.03em; color: var(--s-title); }
.sk-title em {
  font-style: normal;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.sk-sub { margin: 0; padding: 0; font-size: 1.05rem; line-height: 1.7; color: var(--s-text); }

/* ---------- proficiency ---------- */
.sk-prof { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 72px; row-gap: 36px; max-width: 960px; margin: 0 auto; }
.sk-prof-item { margin: 0; padding: 0; }
.sk-prof-row { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin: 0 0 12px; }
.sk-prof-name { margin: 0; font-size: 1rem; font-weight: 600; line-height: 1.3; color: var(--s-title); }
.sk-prof-val { margin: 0; font-size: 0.9rem; font-weight: 700; font-variant-numeric: tabular-nums; color: #3b82f6; }
.sk-bar { position: relative; width: 100%; height: 8px; border-radius: 999px; background: var(--s-chip); overflow: hidden; }
.sk-fill {
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb, #06b6d4);
  box-shadow: 0 0 14px rgba(37, 99, 235, 0.5);
  transition: width 1.3s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--d, 0s);
}
.sk-visible .sk-fill { width: var(--w); }

/* ---------- workflow ---------- */
.sk-flow { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 40px; margin: 0; padding: 0; list-style: none; }
.sk-step { position: relative; margin: 0; padding: 28px 0 0; border-top: 1px solid var(--s-line); }
.sk-step::before {
  content: ''; position: absolute; left: 0; top: -1px; height: 2px; width: 48px;
  background: var(--s-blue);
  transition: width .5s cubic-bezier(0.22, 1, 0.36, 1);
}
.sk-step:hover::before { width: 100%; }
.sk-step-num { display: block; margin: 0 0 18px; font-size: 2.6rem; font-weight: 800; line-height: 1; letter-spacing: -0.04em; color: rgba(59, 130, 246, 0.45); font-variant-numeric: tabular-nums; transition: color .3s ease; }
.sk-step:hover .sk-step-num { color: #3b82f6; }
.sk-step-title { margin: 0 0 10px; padding: 0; font-size: 1.12rem; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; color: var(--s-title); }
.sk-step-desc { margin: 0; padding: 0; font-size: 0.93rem; line-height: 1.7; color: var(--s-text); }

/* ---------- best practices (bento) ---------- */
.sk-bx {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 24px;
}
.sk-bx-card {
  position: relative; overflow: hidden;
  display: flex; flex-direction: column;
  margin: 0; padding: 36px;
  border-radius: 28px;
  background: linear-gradient(150deg, color-mix(in srgb, var(--s-title) 6%, transparent), color-mix(in srgb, var(--s-title) 1.5%, transparent));
  border: 1px solid var(--s-line);
  transition: transform .45s cubic-bezier(0.22, 1, 0.36, 1), border-color .3s ease, box-shadow .45s ease;
}
.sk-bx-card.tall { grid-row: span 2; }
.sk-bx-card::after {
  content: ''; position: absolute; right: -80px; top: -80px; width: 260px; height: 260px; border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.25), transparent 70%);
  opacity: 0; transition: opacity .45s ease; pointer-events: none;
}
.sk-bx-card:hover { transform: translateY(-6px); border-color: rgba(59, 130, 246, 0.55); box-shadow: 0 30px 60px -32px rgba(37, 99, 235, 0.7); }
.sk-bx-card:hover::after { opacity: 1; }

.sk-bx-top { display: flex; align-items: center; justify-content: space-between; margin: 0 0 24px; }
.sk-bx-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 52px; height: 52px; border-radius: 16px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff;
  box-shadow: 0 14px 28px -14px rgba(37, 99, 235, 0.9);
  transition: transform .4s ease;
}
.sk-bx-card:hover .sk-bx-icon { transform: rotate(-8deg) scale(1.08); }
.sk-bx-num { margin: 0; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.12em; font-variant-numeric: tabular-nums; color: rgba(59, 130, 246, 0.75); }
.sk-bx-name { margin: 0 0 10px; padding: 0; font-size: 1.4rem; font-weight: 700; line-height: 1.2; letter-spacing: -0.02em; color: var(--s-title); }
.sk-bx-desc { margin: 0 0 28px; padding: 0; max-width: 460px; font-size: 0.97rem; line-height: 1.7; color: var(--s-text); }
.sk-bx-visual { margin-top: auto; }

/* layers diagram */
.sk-layers { display: flex; flex-direction: column; gap: 0; margin: 0; padding: 0; list-style: none; }
.sk-layer {
  position: relative;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  margin: 0; padding: 15px 20px;
  border-radius: 14px;
  background: rgba(37, 99, 235, calc(0.22 - var(--i) * 0.045));
  border: 1px solid rgba(59, 130, 246, 0.35);
  opacity: 0; transform: translateX(-18px);
  transition: opacity .6s ease, transform .6s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(0.25s + var(--i) * 0.14s);
}
.sk-visible .sk-layer { opacity: 1; transform: none; }
.sk-layer + .sk-layer { margin-top: 22px; }
.sk-layer + .sk-layer::before {
  content: ''; position: absolute; left: 36px; top: -23px; width: 2px; height: 22px;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.2), #3b82f6);
}
.sk-layer + .sk-layer::after {
  content: ''; position: absolute; left: 32px; top: -8px; width: 8px; height: 8px;
  border-right: 2px solid #3b82f6; border-bottom: 2px solid #3b82f6; transform: rotate(45deg);
}
.sk-layer-name { margin: 0; font-size: 0.98rem; font-weight: 700; color: var(--s-title); }
.sk-layer-note { margin: 0; font-size: 0.78rem; font-weight: 500; color: var(--s-text); white-space: nowrap; }

/* endpoints */
.sk-eps { display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 0; list-style: none; }
.sk-ep {
  display: flex; align-items: center; gap: 12px;
  margin: 0; padding: 11px 14px;
  border-radius: 12px;
  background: var(--s-chip); border: 1px solid var(--s-line);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.8rem;
  opacity: 0; transform: translateY(10px);
  transition: opacity .5s ease, transform .5s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(0.25s + var(--i) * 0.12s);
}
.sk-visible .sk-ep { opacity: 1; transform: none; }
.sk-ep-m { flex: none; min-width: 48px; padding: 3px 8px; border-radius: 6px; text-align: center; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.04em; }
.sk-ep-m.get { background: rgba(16, 185, 129, 0.18); color: #10b981; }
.sk-ep-m.post { background: rgba(37, 99, 235, 0.2); color: #60a5fa; }
.sk-ep-p { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--s-title); }
.sk-ep-s { flex: none; font-size: 0.72rem; font-weight: 600; color: #10b981; }

/* index vs scan */
.sk-scan { display: flex; flex-direction: column; gap: 16px; margin: 0 0 22px; }
.sk-scan-row-top { display: flex; justify-content: space-between; margin: 0 0 7px; font-size: 0.78rem; font-weight: 600; color: var(--s-text); }
.sk-scan-row-top b { color: var(--s-title); font-weight: 700; }
.sk-scan-track { position: relative; height: 8px; border-radius: 999px; background: var(--s-chip); overflow: hidden; }
.sk-scan-fill { position: absolute; left: 0; top: 0; bottom: 0; width: 0; border-radius: 999px; transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1); transition-delay: var(--d, 0s); }
.sk-scan-fill.slow { background: linear-gradient(90deg, #f59e0b, #ef4444); }
.sk-scan-fill.fast { background: linear-gradient(90deg, #10b981, #06b6d4); }
.sk-visible .sk-scan-fill { width: var(--w); }
.sk-bx-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
.sk-bx-tags li {
  margin: 0; padding: 6px 13px; border-radius: 8px;
  background: rgba(37, 99, 235, 0.12); border: 1px solid rgba(59, 130, 246, 0.3);
  font-size: 0.76rem; font-weight: 600; line-height: 1.2; letter-spacing: 0.02em; color: #3b82f6;
}
.sk-note { margin: 12px 0 0; font-size: 0.7rem; color: var(--s-text); opacity: 0.7; }

/* ---------- reveal ---------- */
.sk-reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s cubic-bezier(0.22, 1, 0.36, 1); transition-delay: var(--d, 0s); }
.sk-reveal.sk-visible { opacity: 1; transform: none; }
/* cards keep their own hover transform once revealed */
.sk-bx-card.sk-reveal.sk-visible { transition: opacity .7s ease, transform .45s cubic-bezier(0.22, 1, 0.36, 1), border-color .3s ease, box-shadow .45s ease; }

/* ---------- responsive ---------- */
@media (max-width: 1000px) {
  .sk-flow { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 48px 40px; }
}
@media (max-width: 900px) {
  .sk-bx { grid-template-columns: 1fr; }
  .sk-bx-card.tall { grid-row: auto; }
}
@media (max-width: 820px) {
  .sk-section { padding: 72px 0; }
  .sk-head { margin-bottom: 48px; }
  .sk-prof { grid-template-columns: 1fr; row-gap: 28px; }
}
@media (max-width: 560px) {
  .sk-flow { grid-template-columns: 1fr; gap: 40px; }
  .sk-bx-card { padding: 26px 22px; border-radius: 22px; }
  .sk-layer-note { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .sk-reveal { opacity: 1; transform: none; transition: none; }
  .sk-fill, .sk-scan-fill { transition: none; width: var(--w); }
  .sk-layer, .sk-ep { opacity: 1; transform: none; transition: none; }
  .sk-step::before, .sk-step-num, .sk-bx-card, .sk-bx-icon { transition: none; }
}
`

const d = (s: number) => ({ '--d': `${s}s` } as React.CSSProperties)
const v = (name: string, value: string | number) => ({ [name]: value } as React.CSSProperties)

export const SkillsPage: React.FC = () => {
  // Reveal sections and animate the bars/diagrams when they scroll into view
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.sk-page .sk-reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('sk-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('sk-visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.15 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main className="sk-page">
      <style>{css}</style>

      {/* Session 1: Skills Matrix */}
      <SkillsComponent />

      {/* Session 2: Technical Proficiencies */}
      <section className="sk-section tint">
        <div className="container">
          <div className="sk-wrap">
            <div className="sk-head sk-reveal">
              <div className="sk-pill">
                <IconAward size={14} />
                Proficiency
              </div>
              <h2 className="sk-title">Core Competencies</h2>
              <p className="sk-sub">
                Relative proficiency across programming languages, backend frameworks, and relational databases.
              </p>
            </div>

            <div className="sk-prof">
              {proficiencies.map((item, i) => (
                <div
                  key={item.name}
                  className="sk-prof-item sk-reveal"
                  style={{ ...d((i % 2) * 0.08 + Math.floor(i / 2) * 0.1), ...v('--w', `${item.level}%`) }}
                >
                  <div className="sk-prof-row">
                    <span className="sk-prof-name">{item.name}</span>
                    <span className="sk-prof-val">{item.level}%</span>
                  </div>
                  <div className="sk-bar">
                    <div className="sk-fill" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Session 3: Development Workflow */}
      <section className="sk-section">
        <div className="container">
          <div className="sk-wrap">
            <div className="sk-head sk-reveal">
              <div className="sk-pill">
                <IconTerminal size={14} />
                Methodology
              </div>
              <h2 className="sk-title">Engineering Workflow</h2>
              <p className="sk-sub">
                How I approach software architecture, API development, and project lifecycle management.
              </p>
            </div>

            <ol className="sk-flow">
              {workflowSteps.map((step, i) => (
                <li key={step.step} className="sk-step sk-reveal" style={d(i * 0.1)}>
                  <span className="sk-step-num">{step.step}</span>
                  <h3 className="sk-step-title">{step.title}</h3>
                  <p className="sk-step-desc">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Session 4: Code Quality & Best Practices */}
      <section className="sk-section tint">
        <div className="container">
          <div className="sk-wrap">
            <div className="sk-head sk-reveal">
              <div className="sk-pill">
                <IconLayers size={14} />
                Best Practices
              </div>
              <h2 className="sk-title">
                Quality &amp; <em>Clean Code</em> Standards
              </h2>
              <p className="sk-sub">
                The principles I follow on every project to keep the code readable, documented and fast.
              </p>
            </div>

            <div className="sk-bx">
              {/* 01 Clean Architecture (tall card with layer diagram) */}
              <article className="sk-bx-card tall sk-reveal">
                <div className="sk-bx-top">
                  <span className="sk-bx-icon"><IconLayers size={24} /></span>
                  <span className="sk-bx-num">01</span>
                </div>
                <h3 className="sk-bx-name">Clean Architecture</h3>
                <p className="sk-bx-desc">
                  Separation of concerns between controller layers, business services, and database repositories.
                </p>
                <div className="sk-bx-visual">
                  <ul className="sk-layers">
                    {LAYERS.map((l, i) => (
                      <li key={l.name} className="sk-layer" style={v('--i', i)}>
                        <span className="sk-layer-name">{l.name}</span>
                        <span className="sk-layer-note">{l.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              {/* 02 API Documentation */}
              <article className="sk-bx-card sk-reveal" style={d(0.12)}>
                <div className="sk-bx-top">
                  <span className="sk-bx-icon"><IconTerminal size={24} /></span>
                  <span className="sk-bx-num">02</span>
                </div>
                <h3 className="sk-bx-name">API Documentation</h3>
                <p className="sk-bx-desc">
                  Well-structured Swagger/OpenAPI documentation for smooth frontend and client integration.
                </p>
                <div className="sk-bx-visual">
                  <ul className="sk-eps">
                    {ENDPOINTS.map((e, i) => (
                      <li key={e.method + e.path} className="sk-ep" style={v('--i', i)}>
                        <span className={`sk-ep-m ${e.method.toLowerCase()}`}>{e.method}</span>
                        <span className="sk-ep-p">{e.path}</span>
                        <span className="sk-ep-s">{e.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              {/* 03 Database Optimization */}
              <article className="sk-bx-card sk-reveal" style={d(0.24)}>
                <div className="sk-bx-top">
                  <span className="sk-bx-icon"><IconDatabase size={24} /></span>
                  <span className="sk-bx-num">03</span>
                </div>
                <h3 className="sk-bx-name">Database Optimization</h3>
                <p className="sk-bx-desc">
                  Normalized schemas, efficient indexes, transactions, and optimized SQL queries.
                </p>
                <div className="sk-bx-visual">
                  <div className="sk-scan">
                    <div>
                      <div className="sk-scan-row-top"><span>Full table scan</span><b>Slow</b></div>
                      <div className="sk-scan-track">
                        <div className="sk-scan-fill slow" style={{ ...d(0.4), ...v('--w', '90%') }} />
                      </div>
                    </div>
                    <div>
                      <div className="sk-scan-row-top"><span>Indexed lookup</span><b>Fast</b></div>
                      <div className="sk-scan-track">
                        <div className="sk-scan-fill fast" style={{ ...d(0.6), ...v('--w', '18%') }} />
                      </div>
                    </div>
                  </div>
                  <ul className="sk-bx-tags">
                    <li>Normalization</li>
                    <li>Indexes</li>
                    <li>Transactions</li>
                  </ul>
                  <p className="sk-note">Illustrative comparison</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
export default SkillsPage