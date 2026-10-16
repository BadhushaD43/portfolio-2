import React, { useEffect, useRef, useState } from 'react'
import { IconCode, IconServer, IconDatabase, IconMapPin } from './Icons'

/* ------------------------------------------------------------------ */
/* Edit these                                                          */
/* ------------------------------------------------------------------ */
const PROFILE_IMAGE = '/profile.png' // same photo as the hero; falls back to initials if missing

const DETAILS = [
  { label: 'Location', value: 'Tiruchirappalli, Tamil Nadu, India' },
  { label: 'Education', value: 'B.E. Computer Science & Engineering' },
  { label: 'Company', value: 'iZone Technologies' },
  { label: 'Role', value: 'Junior Backend Developer' },
]

const STATS = [
  { value: 3, suffix: '+', label: 'Projects Built' },
  { value: 10, suffix: '', label: 'Portals Managed' },
  { text: 'B.E. CSE', label: 'Education' },
  { text: 'Backend', label: 'Focus Area' },
]

const FOCUS = [
  {
    icon: <IconServer size={20} />,
    title: 'Backend engineering',
    text: 'API design and Java-based server-side development.',
  },
  {
    icon: <IconDatabase size={20} />,
    title: 'Databases',
    text: 'PostgreSQL and MySQL: schema design, query optimization and data integrity.',
  },
  {
    icon: <IconCode size={20} />,
    title: 'Full-stack delivery',
    text: 'End-to-end systems built with React.js and FastAPI.',
  },
]

const WORK = [
  { name: '10-Portal CRM System', stack: 'React.js · FastAPI · PostgreSQL' },
  { name: 'OTT Movie Discovery Platform', stack: 'React.js · FastAPI · MySQL' },
  { name: 'Employee Attendance Management', stack: 'React.js · FastAPI · PostgreSQL' },
]

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */
const css = `
.ab {
  --a-blue: #1f6bff;
  --a-title: var(--text-main, #f5f8ff);
  --a-text: var(--text-muted, #b4bed3);
  --a-subtle: var(--text-subtle, #7f8aa5);
  --a-line: rgba(255, 255, 255, 0.12);
  --a-wash: rgba(31, 107, 255, 0.1);
  --a-chip: rgba(255, 255, 255, 0.06);
  --a-stage-a: #1d4fd8;
  --a-stage-b: #0b1f5c;
  --a-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.75);
}
:root[data-theme='light'] .ab,
:root.light .ab,
.light .ab,
[data-theme='light'] .ab {
  --a-blue: #0f5fe8;
  --a-title: var(--text-main, #0b1633);
  --a-text: var(--text-muted, #475673);
  --a-subtle: var(--text-subtle, #7683a0);
  --a-line: rgba(11, 22, 51, 0.12);
  --a-wash: rgba(15, 95, 232, 0.07);
  --a-chip: #eaf1fb;
  --a-stage-a: #bfdcff;
  --a-stage-b: #d9ebff;
  --a-shadow: 0 30px 50px -30px rgba(20, 40, 90, 0.4);
}

@keyframes ab-line { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes ab-float {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -8px, 0); }
}
@keyframes ab-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
  50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
}

.ab-reveal {
  opacity: 0;
  transform: translate3d(0, 24px, 0);
  transition: opacity 0.75s ease, transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--d, 0s);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.ab-reveal.ab-visible { opacity: 1; transform: translate3d(0, 0, 0); }

.ab { position: relative; padding: 120px 0; background: var(--bg-surface, transparent); }
.ab-wrap { max-width: 1120px; }

/* header */
.ab-eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--a-blue); }
.ab-eyebrow::before { content: ''; width: 36px; height: 2px; background: var(--a-blue); transform-origin: left; transform: scaleX(0); }
.ab-eyebrow.ab-visible::before { animation: ab-line 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards; }
.ab-title { font-size: clamp(2.4rem, 5.5vw, 4rem); font-weight: 800; letter-spacing: -0.035em; line-height: 1.05; color: var(--a-title); margin: 0 0 72px; max-width: 760px; }
.ab-title em { font-style: normal; color: var(--a-blue); }

/* layout */
.ab-grid { display: grid; grid-template-columns: 340px minmax(0, 1fr); gap: 88px; align-items: start; }

/* left */
.ab-left {
  position: sticky;
  top: calc(var(--header-height, 72px) + 32px);
  isolation: isolate;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.ab-photo {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1.1;
  margin-bottom: 36px;
  animation: ab-float 7s ease-in-out infinite;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  perspective: 1000px;
  -webkit-perspective: 1000px;
}
.ab-photo::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 14px;
  background: linear-gradient(145deg, var(--a-stage-a), var(--a-stage-b));
  transform: rotate(-3deg) translate3d(-6px, 6px, 0);
  box-shadow: var(--a-shadow);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  will-change: transform;
}
.ab-photo-inner {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  overflow: hidden;
  background: var(--a-wash);
  border: 1px solid var(--a-line);
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  mask-image: radial-gradient(white, black);
  isolation: isolate;
}
.ab-photo-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  user-select: none;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
  will-change: transform;
}
.ab-monogram { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 5rem; font-weight: 800; letter-spacing: -0.05em; color: var(--a-blue); opacity: 0.6; }

.ab-details { margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--a-line); }
.ab-details li { display: flex; flex-direction: column; gap: 4px; padding: 16px 0; border-bottom: 1px solid var(--a-line); }
.ab-details .ab-d-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--a-subtle); }
.ab-details .ab-d-value { font-size: 0.98rem; font-weight: 600; color: var(--a-title); display: flex; align-items: center; gap: 8px; }
.ab-avail { width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: ab-pulse 2.4s ease-in-out infinite; flex: none; }

/* right */
.ab-lead { font-size: clamp(1.3rem, 2.3vw, 1.75rem); font-weight: 500; line-height: 1.55; letter-spacing: -0.015em; color: var(--a-title); margin: 0 0 28px; }
.ab-lead mark { background: none; color: var(--a-blue); }
.ab-p { font-size: 1.05rem; line-height: 1.9; color: var(--a-text); margin: 0 0 20px; max-width: 700px; }
.ab-p strong { color: var(--a-title); font-weight: 600; }

/* stats */
.ab-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 56px 0 72px; border-top: 1px solid var(--a-line); border-bottom: 1px solid var(--a-line); }
.ab-stat { padding: 24px 20px 24px 0; }
.ab-stat + .ab-stat { padding-left: 24px; border-left: 1px solid var(--a-line); }
.ab-stat-num { font-size: clamp(1.5rem, 2.8vw, 2.3rem); font-weight: 800; letter-spacing: -0.03em; color: var(--a-title); line-height: 1.1; font-variant-numeric: tabular-nums; }
.ab-stat-num span { color: var(--a-blue); }
.ab-stat-label { margin-top: 8px; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--a-subtle); }

/* sub sections */
.ab-sub { display: flex; align-items: baseline; gap: 14px; margin: 0 0 24px; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--a-subtle); }
.ab-sub span { color: var(--a-blue); }

.ab-focus { list-style: none; margin: 0 0 72px; padding: 0; border-top: 1px solid var(--a-line); }
.ab-focus li {
  position: relative;
  display: grid; grid-template-columns: 44px minmax(0, 220px) 1fr; gap: 20px; align-items: start;
  padding: 24px 0; border-bottom: 1px solid var(--a-line);
  transition: padding-left 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.ab-focus li::after { content: ''; position: absolute; left: 0; bottom: -1px; height: 1px; width: 100%; background: var(--a-blue); transform: scaleX(0); transform-origin: left; transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.ab-focus li:hover { padding-left: 10px; }
.ab-focus li:hover::after { transform: scaleX(1); }
.ab-focus-icon { color: var(--a-blue); display: inline-flex; padding-top: 2px; transition: transform 0.35s ease; }
.ab-focus li:hover .ab-focus-icon { transform: rotate(-10deg) scale(1.15); }
.ab-focus-title { font-size: 1.05rem; font-weight: 700; color: var(--a-title); letter-spacing: -0.01em; }
.ab-focus-text { font-size: 0.98rem; line-height: 1.65; color: var(--a-text); }

.ab-work { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--a-line); counter-reset: w; }
.ab-work li {
  counter-increment: w;
  display: grid; grid-template-columns: 48px 1fr auto; gap: 16px; align-items: baseline;
  padding: 20px 0; border-bottom: 1px solid var(--a-line);
  transition: color 0.25s ease, padding-left 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.ab-work li::before { content: '0' counter(w); font-size: 0.85rem; font-weight: 600; color: var(--a-blue); font-variant-numeric: tabular-nums; }
.ab-work li:hover { padding-left: 10px; }
.ab-work-name { font-size: 1.1rem; font-weight: 600; color: var(--a-title); letter-spacing: -0.01em; }
.ab-work-stack { font-size: 0.82rem; color: var(--a-subtle); }

/* responsive */
@media (max-width: 960px) {
  .ab { padding: 90px 0; }
  .ab-grid { grid-template-columns: 1fr; gap: 56px; }
  .ab-left { position: static; display: grid; grid-template-columns: 220px 1fr; gap: 32px; align-items: start; }
  .ab-photo { margin-bottom: 0; }
  .ab-title { margin-bottom: 48px; }
}
@media (max-width: 640px) {
  .ab-left { grid-template-columns: 1fr; }
  .ab-photo { max-width: 260px; }
  .ab-stats { grid-template-columns: 1fr 1fr; }
  .ab-stat, .ab-stat + .ab-stat { padding: 20px 12px 20px 0; border-left: none; }
  .ab-stat:nth-child(even) { padding-left: 16px; border-left: 1px solid var(--a-line); }
  .ab-stat:nth-child(n+3) { border-top: 1px solid var(--a-line); }
  .ab-focus li { grid-template-columns: 36px 1fr; }
  .ab-focus-text { grid-column: 2; }
  .ab-work li { grid-template-columns: 40px 1fr; }
  .ab-work-stack { grid-column: 2; }
}
@media (prefers-reduced-motion: reduce) {
  .ab-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  .ab-photo, .ab-avail { animation: none !important; transform: none !important; }
  .ab-eyebrow::before { transform: none !important; animation: none !important; }
  .ab-focus li, .ab-focus li::after, .ab-work li, .ab-focus-icon { transition: none !important; }
}
`

/* ------------------------------------------------------------------ */
/* Count-up number that starts when scrolled into view                 */
/* ------------------------------------------------------------------ */
const CountUp: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) { setN(to); return }

    let raf = 0
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const dur = 1400
      const tick = (t: number) => {
        const p = Math.min((t - start) / dur, 1)
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to])

  return <div ref={ref} className="ab-stat-num">{n}<span>{suffix}</span></div>
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export const About: React.FC = () => {
  const [imgOk, setImgOk] = useState(true)

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('#about .ab-reveal, #about .ab-eyebrow')
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('ab-visible'))
      return
    }
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('ab-visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.12 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const d = (s: number) => ({ '--d': `${s}s` } as React.CSSProperties)

  return (
    <section id="about" className="ab">
      <style>{css}</style>

      <div className="container ab-wrap">
        <div className="ab-eyebrow">About</div>
        <h2 className="ab-title ab-reveal">
          Building reliable backends and <em>clean, usable</em> full-stack products.
        </h2>

        <div className="ab-grid">
          {/* ---------------- Left ---------------- */}
          <aside className="ab-left ab-reveal" style={d(0.1)}>
            <div className="ab-photo">
              <div className="ab-photo-inner">
                {imgOk ? (
                  <img src={PROFILE_IMAGE} alt="Badhusha D" onError={() => setImgOk(false)} draggable={false} />
                ) : (
                  <div className="ab-monogram">BD</div>
                )}
              </div>
            </div>

            <ul className="ab-details">
              <li>
                <span className="ab-d-label">Name</span>
                <span className="ab-d-value">Badhusha D</span>
              </li>
              {DETAILS.map(item => (
                <li key={item.label}>
                  <span className="ab-d-label">{item.label}</span>
                  <span className="ab-d-value">
                    {item.label === 'Location' && <IconMapPin size={15} style={{ color: 'var(--a-blue)', flex: 'none' }} />}
                    {item.value}
                  </span>
                </li>
              ))}
              <li>
                <span className="ab-d-label">Availability</span>
                <span className="ab-d-value"><span className="ab-avail" />Open to opportunities</span>
              </li>
            </ul>
          </aside>

          {/* ---------------- Right ---------------- */}
          <div>
            <p className="ab-lead ab-reveal">
              I'm a <mark>Junior Backend Developer</mark> and Full Stack Web Developer with hands-on
              experience building backend APIs, database-driven applications and responsive web interfaces.
            </p>

            <p className="ab-p ab-reveal" style={d(0.05)}>
              My focus is on designing scalable, reliable and user-centric software that solves
              real-world problems efficiently. Currently I contribute at <strong>iZone Technologies</strong>,
              working on backend application logic, REST APIs, database integration and frontend-backend
              coordination using Java and Spring Framework fundamentals.
            </p>

            <p className="ab-p ab-reveal" style={d(0.1)}>
              Through freelance engagements I built and deployed production full-stack applications,
              including a <strong>10-portal CRM system</strong>, an <strong>OTT movie discovery platform</strong> and
              an <strong>employee attendance management system</strong>, all using React.js, FastAPI,
              PostgreSQL and MySQL.
            </p>

            {/* Stats */}
            <div className="ab-stats ab-reveal">
              {STATS.map(s => (
                <div key={s.label} className="ab-stat">
                  {'value' in s && s.value !== undefined
                    ? <CountUp to={s.value} suffix={s.suffix} />
                    : <div className="ab-stat-num">{s.text}</div>}
                  <div className="ab-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Focus */}
            <div className="ab-sub ab-reveal"><span>01</span> What I focus on</div>
            <ul className="ab-focus">
              {FOCUS.map((f, i) => (
                <li key={f.title} className="ab-reveal" style={d(i * 0.08)}>
                  <span className="ab-focus-icon">{f.icon}</span>
                  <span className="ab-focus-title">{f.title}</span>
                  <span className="ab-focus-text">{f.text}</span>
                </li>
              ))}
            </ul>

            {/* Work */}
            <div className="ab-sub ab-reveal"><span>02</span> Selected work</div>
            <ul className="ab-work">
              {WORK.map((w, i) => (
                <li key={w.name} className="ab-reveal" style={d(i * 0.08)}>
                  <span className="ab-work-name">{w.name}</span>
                  <span className="ab-work-stack">{w.stack}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}