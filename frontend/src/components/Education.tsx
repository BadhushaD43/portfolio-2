import React, { useEffect, useRef } from 'react'
import {
  GraduationCap,
  BookOpen,
  Calendar,
  MapPin,
  Building2,
  Award,
  CheckCircle2,
} from 'lucide-react'

interface EducationItem {
  id: string
  degree: string
  field: string
  institution: string
  location: string
  affiliation?: string
  period: string
  status: string
  grade?: string
  description: string
  coursework: string[]
  icon: 'college' | 'school'
}

const educationData: EducationItem[] = [
  {
    id: 'undergrad',
    degree: 'Bachelor of Engineering (B.E.)',
    field: 'Computer Science and Engineering',
    institution: 'Oxford Engineering College',
    location: 'Tiruchirappalli, Tamil Nadu',
    affiliation: 'Anna University',
    period: '2020 – 2024',
    status: 'Graduated',
    grade: 'CGPA: 7.5 / 10',
    description:
      'Completed a comprehensive 4-year undergraduate engineering program focusing on software architecture, backend system design, database management, and algorithmic problem-solving.',
    coursework: [
      'Data Structures & Algorithms',
      'Database Management Systems',
      'Object-Oriented Programming (Java)',
      'Operating Systems',
      'Computer Networks',
      'Web Technologies',
    ],
    icon: 'college',
  },
  {
    id: 'hsc',
    degree: 'Higher Secondary Certificate (HSC)',
    field: 'Computer Science & Mathematics Stream',
    institution: 'Bishop Heber Higher Secondary School',
    location: 'Teppakulam, Tiruchirappalli',
    period: '2018 – 2020',
    status: 'Completed',
    grade: 'First Class with Distinction',
    description:
      'Built a strong foundation in computational thinking, programming concepts, and mathematical foundations, preparing for advanced computer science studies.',
    coursework: [
      'Computer Science',
      'Advanced Mathematics',
      'Physics',
      'Chemistry',
      'Programming Fundamentals',
    ],
    icon: 'school',
  },
]

/*
 * Scoped CSS with explicit spacing (no Tailwind). Your global CSS resets padding and
 * margins, so utility classes like px-4, gap-5 and mb-3 were not applying and the
 * rows collapsed against each other. Colours follow your theme variables.
 */
const css = `
.ed {
  --e-blue: #2563eb;
  --e-title: var(--text-main, currentColor);
  --e-text: var(--text-muted, currentColor);
  --e-subtle: var(--text-subtle, var(--e-text));
  --e-line: color-mix(in srgb, var(--e-title) 14%, transparent);
  --e-chip: color-mix(in srgb, var(--e-title) 7%, transparent);
  position: relative;
  overflow: hidden;
  padding: 96px 0;
}
.ed, .ed *, .ed *::before, .ed *::after { box-sizing: border-box; }
.ed svg { flex: none; }

.ed-glow {
  position: absolute; top: 30%; left: 50%; width: 640px; height: 340px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(37, 99, 235, 0.35), rgba(99, 102, 241, 0.15) 60%, transparent 72%);
  filter: blur(80px); opacity: 0.35; pointer-events: none;
}
.ed-wrap { position: relative; z-index: 1; max-width: 880px; margin: 0 auto; }

/* ---------- header ---------- */
.ed-head { display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 640px; margin: 0 auto 72px; }
.ed-pill {
  display: inline-flex; align-items: center; gap: 8px;
  margin: 0 0 22px; padding: 8px 18px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12); border: 1px solid rgba(37, 99, 235, 0.35);
  color: #3b82f6; font-size: 0.75rem; font-weight: 700; line-height: 1; letter-spacing: 0.1em; text-transform: uppercase;
}
.ed-title { margin: 0 0 16px; padding: 0; font-size: clamp(2rem, 4.4vw, 3rem); font-weight: 800; line-height: 1.12; letter-spacing: -0.03em; color: var(--e-title); }
.ed-title em { font-style: normal; background: linear-gradient(90deg, #3b82f6, #06b6d4); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.ed-sub { margin: 0; padding: 0; font-size: 1.05rem; line-height: 1.7; color: var(--e-text); }

/* ---------- timeline ---------- */
.ed-list { margin: 0; padding: 0; list-style: none; }
.ed-item { position: relative; display: grid; grid-template-columns: 56px minmax(0, 1fr); column-gap: 32px; margin: 0; padding: 0 0 64px; }
.ed-item:last-child { padding-bottom: 0; }

.ed-rail { position: relative; display: flex; flex-direction: column; align-items: center; }
.ed-icon {
  position: relative; z-index: 1;
  display: inline-flex; align-items: center; justify-content: center;
  width: 56px; height: 56px; border-radius: 18px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff;
  box-shadow: 0 14px 28px -14px rgba(37, 99, 235, 0.9);
  transition: transform .4s ease;
}
.ed-item:hover .ed-icon { transform: rotate(-8deg) scale(1.08); }
.ed-stem {
  flex: 1; width: 2px; margin-top: 10px;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.7), var(--e-line));
  transform: scaleY(0); transform-origin: top;
  transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) .3s;
}
.ed-visible .ed-stem { transform: scaleY(1); }
.ed-item:last-child .ed-stem { display: none; }

.ed-body { min-width: 0; padding-top: 2px; }

.ed-top { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 14px 24px; margin: 0 0 18px; }
.ed-degree { margin: 0 0 6px; padding: 0; font-size: clamp(1.25rem, 2.4vw, 1.55rem); font-weight: 700; line-height: 1.25; letter-spacing: -0.02em; color: var(--e-title); }
.ed-field { margin: 0; padding: 0; font-size: 0.98rem; font-weight: 600; line-height: 1.4; color: #3b82f6; }

.ed-tags { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 0; padding: 0; }
.ed-period {
  display: inline-flex; align-items: center; gap: 8px;
  height: 34px; margin: 0; padding: 0 14px;
  border-radius: 999px; background: var(--e-chip); border: 1px solid var(--e-line);
  color: var(--e-text); font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace); font-size: 0.8rem; font-weight: 500; line-height: 1; white-space: nowrap;
}
.ed-period svg { color: #3b82f6; }
.ed-status {
  display: inline-flex; align-items: center; justify-content: center;
  height: 34px; margin: 0; padding: 0 16px;
  border-radius: 999px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35);
  color: #10b981; font-size: 0.78rem; font-weight: 700; line-height: 1; white-space: nowrap;
}

.ed-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; margin: 0 0 20px; padding: 0 0 20px; border-bottom: 1px solid var(--e-line); }
.ed-meta-item { display: inline-flex; align-items: center; gap: 8px; margin: 0; font-size: 0.92rem; line-height: 1.4; color: var(--e-text); }
.ed-meta-item svg { color: #3b82f6; }
.ed-meta-item.strong { font-weight: 600; color: var(--e-title); }
.ed-aff {
  display: inline-flex; align-items: center; height: 28px; margin: 0; padding: 0 12px;
  border-radius: 8px; background: rgba(37, 99, 235, 0.12); border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6; font-size: 0.78rem; font-weight: 600; line-height: 1; white-space: nowrap;
}
.ed-grade {
  display: inline-flex; align-items: center; gap: 8px; height: 30px; margin: 0; padding: 0 14px;
  border-radius: 999px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981; font-size: 0.8rem; font-weight: 700; line-height: 1; white-space: nowrap;
}

.ed-desc { margin: 0 0 26px; padding: 0; max-width: 700px; font-size: 1rem; line-height: 1.8; color: var(--e-text); }

.ed-cw-label { margin: 0 0 14px; padding: 0; font-size: 0.72rem; font-weight: 700; line-height: 1; letter-spacing: 0.14em; text-transform: uppercase; color: var(--e-subtle); }
.ed-cw { display: flex; flex-wrap: wrap; gap: 10px; margin: 0; padding: 0; list-style: none; }
.ed-cw li {
  display: inline-flex; align-items: center; gap: 8px;
  height: 36px; margin: 0; padding: 0 14px;
  border-radius: 10px; background: var(--e-chip); border: 1px solid var(--e-line);
  color: var(--e-title); font-size: 0.82rem; font-weight: 500; line-height: 1; white-space: nowrap;
  transition: transform .25s ease, border-color .25s ease, background-color .25s ease, color .25s ease;
}
.ed-cw li svg { color: #3b82f6; opacity: 0.85; }
.ed-cw li:hover { transform: translateY(-3px); border-color: rgba(59, 130, 246, 0.7); background: rgba(37, 99, 235, 0.1); color: #3b82f6; }

/* ---------- animation ---------- */
.ed-reveal { opacity: 0; transform: translateY(26px); transition: opacity .8s ease, transform .8s cubic-bezier(0.22, 1, 0.36, 1); transition-delay: var(--d, 0s); }
.ed-reveal.ed-visible { opacity: 1; transform: none; }
/* ---------- responsive ---------- */
@media (max-width: 720px) {
  .ed { padding: 72px 0; }
  .ed-head { margin-bottom: 52px; }
  .ed-item { grid-template-columns: 44px minmax(0, 1fr); column-gap: 18px; padding-bottom: 52px; }
  .ed-icon { width: 44px; height: 44px; border-radius: 14px; }
  .ed-icon svg { width: 20px; height: 20px; }
  .ed-cw li { white-space: normal; height: auto; min-height: 36px; padding: 8px 14px; line-height: 1.3; }
}
@media (prefers-reduced-motion: reduce) {
  .ed-reveal { opacity: 1; transform: none; transition: none; }
  .ed-stem { transform: scaleY(1); transition: none; }
  .ed-icon, .ed-cw li { transition: none; }
}
`

const d = (s: number) => ({ '--d': `${s}s` } as React.CSSProperties)

export const Education: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = rootRef.current?.querySelectorAll<HTMLElement>('.ed-reveal')
    if (!els) return
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('ed-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('ed-visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="education" className="ed" ref={rootRef}>
      <style>{css}</style>
      <div className="ed-glow" />

      <div className="container">
        <div className="ed-wrap">
          {/* Section Header */}
          <div className="ed-head ed-reveal">
            <div className="ed-pill">
              <GraduationCap size={16} />
              <span>Education</span>
            </div>
            <h2 className="ed-title">
              Academic <em>Background</em>
            </h2>
            <p className="ed-sub">
              A solid computer science foundation from Anna University-affiliated engineering institutions.
            </p>
          </div>

          {/* Timeline */}
          <ol className="ed-list">
            {educationData.map((edu, i) => (
              <li key={edu.id} className="ed-item ed-reveal" style={d(i * 0.12)}>
                {/* Left rail: icon + connecting line */}
                <div className="ed-rail">
                  <span className="ed-icon">
                    {edu.icon === 'college' ? <GraduationCap size={26} /> : <BookOpen size={26} />}
                  </span>
                  <span className="ed-stem" />
                </div>

                {/* Right content, everything on one left edge */}
                <div className="ed-body">
                  {/* Row 1: degree + period/status */}
                  <div className="ed-top">
                    <div>
                      <h3 className="ed-degree">{edu.degree}</h3>
                      <p className="ed-field">{edu.field}</p>
                    </div>
                    <div className="ed-tags">
                      <span className="ed-period">
                        <Calendar size={15} />
                        {edu.period}
                      </span>
                      <span className="ed-status">
                        {edu.status}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: institution, affiliation, location, grade */}
                  <div className="ed-meta">
                    <span className="ed-meta-item strong">
                      <Building2 size={16} />
                      {edu.institution}
                    </span>
                    {edu.affiliation && <span className="ed-aff">Affiliated to {edu.affiliation}</span>}
                    <span className="ed-meta-item">
                      <MapPin size={15} />
                      {edu.location}
                    </span>
                    {edu.grade && (
                      <span className="ed-grade">
                        <Award size={15} />
                        {edu.grade}
                      </span>
                    )}
                  </div>

                  {/* Row 3: description */}
                  <p className="ed-desc">{edu.description}</p>

                  {/* Row 4: coursework */}
                  <p className="ed-cw-label">Key Coursework &amp; Competencies</p>
                  <ul className="ed-cw">
                    {edu.coursework.map((course) => (
                      <li key={course}>
                        <CheckCircle2 size={15} />
                        {course}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default Education