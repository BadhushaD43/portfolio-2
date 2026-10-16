import React from 'react'
import { Link } from 'react-router-dom'
import { IconArrowRight } from './Icons'

// Profile photo path
const PROFILE_IMAGE = '/profile.png'

// false = normal rectangular photo (cropped neatly inside the card)  <- your current photo
// true  = transparent-background cut-out PNG (head pops out above the card)
const PHOTO_POPS_OUT = false

const SOCIALS = [
  {
    name: 'GitHub',
    url: 'https://github.com/badhushad43',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/badhusha-d',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: 'Email',
    url: 'mailto:badhushad0@gmail.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

const SKILLS_LIST = [
  {
    title: 'Java Developer',
    subtitle: 'Backend • OOP • Spring',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: 'Web Developer',
    subtitle: 'React • Next.js • Tailwind',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
      </svg>
    ),
  },
  {
    title: 'Database',
    subtitle: 'MySQL • PostgreSQL',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    title: 'Linux',
    subtitle: 'Bash • Ubuntu • BOSS Linux',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.012 0c-3.414.04-5.23 2.05-5.23 5.485 0 1.25.32 2.67.8 3.92-.38.53-.78 1.15-1.12 1.83-1.01 2.04-1.33 3.95-.91 5.41.34 1.19 1.14 2.1 2.29 2.59-.11.45-.19.91-.23 1.37-.15 1.67.55 2.65 1.94 2.76 1.43.11 2.79-.62 3.48-1.84.45.06.91.09 1.39.09.47 0 .91-.03 1.35-.09.68 1.22 2.05 1.95 3.48 1.84 1.39-.11 2.09-1.09 1.94-2.76-.04-.46-.12-.92-.23-1.37 1.15-.49 1.95-1.4 2.29-2.59.42-1.46.1-3.37-.91-5.41-.34-.68-.74-1.3-1.12-1.83.48-1.25.8-2.67.8-3.92 0-3.435-1.816-5.445-5.23-5.485h-.78zm-.39 2.03c2.44 0 3.39 1.48 3.39 3.455 0 1.05-.28 2.23-.68 3.32-.4-.2-.84-.33-1.31-.41.38-.85.59-1.74.59-2.51 0-.96-.46-1.52-1.28-1.52-.77 0-1.45.54-1.95 1.55-.49-1.01-1.18-1.55-1.95-1.55-.82 0-1.28.56-1.28 1.52 0 .77.21 1.66.59 2.51-.47.08-.91.21-1.31.41-.4-1.09-.68-2.27-.68-3.32 0-1.975.95-3.455 3.39-3.455h.49z" />
      </svg>
    ),
  },
]

/*
 * Everything below is scoped to .hero-root and does NOT use Tailwind.
 * Spacing, grid and button sizes are set explicitly (with margin resets and
 * higher specificity) so global CSS like `h1, p { margin: 0 }` or `a { padding: 0 }`
 * can't break the layout.
 *
 * Colours come from your existing theme variables (--text-main, --text-muted,
 * --bg-card) and color-mix(), so dark and light mode follow your toggle automatically.
 */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');

.hero-root {
  --h-blue: #2563eb;
  --h-blue-hover: #1d4ed8;
  --h-title: var(--text-main, currentColor);
  --h-text: var(--text-muted, currentColor);
  --h-line: color-mix(in srgb, var(--h-title) 14%, transparent);
  --h-chip: color-mix(in srgb, var(--h-title) 8%, transparent);
  --h-panel: var(--bg-card, color-mix(in srgb, var(--h-title) 6%, transparent));
}
.hero-root, .hero-root *, .hero-root *::before, .hero-root *::after { box-sizing: border-box; }

.hero-root {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: calc(var(--header-height, 72px) + 48px) 0 80px;
  overflow: hidden;
}
.hero-root .hero-glow {
  position: absolute; top: 8%; right: 4%;
  width: 560px; height: 560px; border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.28) 0%, rgba(37, 99, 235, 0.05) 55%, transparent 70%);
  filter: blur(50px);
  pointer-events: none;
  transform: translate3d(0, 0, 0);
  will-change: transform, opacity;
  isolation: isolate;
  animation: hero-glow 8s ease-in-out infinite;
}

/* ---------- layout ---------- */
.hero-root .hero-grid {
  position: relative; z-index: 1;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.85fr) 272px;
  column-gap: clamp(28px, 4vw, 56px);
  row-gap: 48px;
  align-items: center;
}

/* ---------- left ---------- */
.hero-root .hero-left { display: flex; flex-direction: column; align-items: flex-start; text-align: left; min-width: 0; }

.hero-root .hero-greet {
  display: inline-flex; align-items: center; gap: 10px;
  margin: 0 0 22px; padding: 9px 20px 9px 14px;
  border-radius: 14px;
  background: var(--h-chip);
  border: 1px solid var(--h-line);
  color: var(--h-title);
  font-size: 0.95rem; font-weight: 600; line-height: 1.2;
}
.hero-root .hero-wave { display: inline-block; font-size: 1.15rem; transform-origin: 70% 70%; animation: wave-hand 2.2s infinite ease-in-out; }

.hero-root .hero-h1 {
  margin: 0 0 10px; padding: 0;
  font-size: clamp(2.8rem, 5.4vw, 4.4rem);
  font-weight: 800; line-height: 1.05; letter-spacing: -0.035em;
  color: var(--h-title);
}
.hero-root .hero-h1 .hero-d {
  font-weight: 800;
  background: linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: hero-shine 4s linear infinite;
}
.hero-root .hero-h2 {
  margin: 0 0 22px; padding: 0;
  font-size: clamp(1.6rem, 2.9vw, 2.3rem);
  font-weight: 700; line-height: 1.15; letter-spacing: -0.02em;
  color: var(--h-title);
}
.hero-root .hero-p {
  margin: 0 0 34px; padding: 0;
  max-width: 470px;
  font-size: 1.1rem; line-height: 1.7;
  color: var(--h-text);
}

.hero-root .hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin: 0 0 30px; padding: 0; }

.hero-root a.hero-btn {
  position: relative; overflow: hidden;
  display: inline-flex !important; align-items: center; justify-content: center;
  gap: 10px;
  height: 50px !important; min-height: 50px;
  padding: 0 30px !important;
  margin: 0;
  border-radius: 999px;
  font-size: 15px; font-weight: 600; line-height: 1;
  white-space: nowrap; text-decoration: none;
  cursor: pointer;
  transition: transform .25s ease, box-shadow .25s ease, background-color .25s ease, border-color .25s ease, color .25s ease;
}
.hero-root a.hero-btn:hover { transform: translateY(-3px); }
.hero-root a.hero-btn:active { transform: translateY(0) scale(0.97); }

.hero-root a.hero-btn-primary {
  background: var(--h-blue); color: #fff;
  border: 1.5px solid var(--h-blue);
  box-shadow: 0 12px 28px -12px rgba(37, 99, 235, 0.9);
}
.hero-root a.hero-btn-primary:hover { background: var(--h-blue-hover); border-color: var(--h-blue-hover); }
.hero-root a.hero-btn-primary::before {
  content: ''; position: absolute; top: 0; left: -80%; width: 50%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,.4), transparent);
  transform: skewX(-20deg); transition: left .6s ease;
}
.hero-root a.hero-btn-primary:hover::before { left: 140%; }
.hero-root .hero-arrow { display: inline-flex; transition: transform .25s ease; }
.hero-root a.hero-btn-primary:hover .hero-arrow { transform: translateX(5px); }

.hero-root a.hero-btn-ghost {
  background: transparent; color: var(--h-title);
  border: 1.5px solid color-mix(in srgb, var(--h-title) 40%, transparent);
}
.hero-root a.hero-btn-ghost:hover { border-color: var(--h-blue); color: var(--h-blue); background: rgba(37, 99, 235, 0.1); }

.hero-root .hero-socials { display: flex; align-items: center; gap: 12px; margin: 0; padding: 0; }
.hero-root a.hero-social {
  display: inline-flex !important; align-items: center; justify-content: center;
  width: 42px !important; height: 42px !important; padding: 0 !important; margin: 0;
  border-radius: 50%;
  background: var(--h-chip); color: var(--h-title);
  border: 1px solid var(--h-line);
  text-decoration: none; line-height: 1;
  transition: transform .25s ease, background-color .25s ease, color .25s ease, border-color .25s ease;
}
.hero-root a.hero-social:hover { transform: translateY(-4px); background: var(--h-blue); border-color: var(--h-blue); color: #fff; }

/* ---------- center / photo ---------- */
.hero-root .hero-center {
  position: relative;
  display: flex;
  justify-content: center;
  min-width: 0;
  isolation: isolate;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.hero-root .hero-photo {
  position: relative; width: 100%; max-width: 340px;
  aspect-ratio: 1 / 1.18;
  animation: hero-float 7s ease-in-out 1.5s infinite;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  perspective: 1000px;
  -webkit-perspective: 1000px;
}
.hero-root .hero-photo.pops { margin-top: 44px; }
.hero-root .hero-layer {
  position: absolute;
  inset: 0;
  border-radius: 28px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  will-change: transform;
}
.hero-root .hero-layer.back {
  background: rgba(37, 99, 235, 0.35);
  transform: rotate(6deg) translate3d(10px, -8px, 0);
}
.hero-root .hero-layer.front {
  background: linear-gradient(145deg, #3b82f6, #1d4ed8 60%, #1e3a8a);
  transform: rotate(-4deg) translate3d(-8px, 8px, 0);
  box-shadow: 0 30px 60px -24px rgba(37, 99, 235, 0.7);
}
.hero-root .hero-frame {
  position: absolute;
  inset: 0;
  border-radius: 28px;
  overflow: hidden;
  z-index: 2;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  mask-image: radial-gradient(white, black);
  isolation: isolate;
}
.hero-root .hero-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  user-select: none;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
  will-change: transform;
}
.hero-root .hero-cutout {
  position: absolute; bottom: 0; left: 50%; z-index: 2;
  height: 122%; width: auto; max-width: none;
  transform: translate3d(-50%, 0, 0);
  object-fit: contain; object-position: bottom center;
  user-select: none; pointer-events: none;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
  will-change: transform;
}
.hero-root .hero-dots {
  position: absolute; left: 6%; top: 30%;
  width: 56px; height: 84px; z-index: 3; pointer-events: none;
  background-image: radial-gradient(rgba(59, 130, 246, 0.95) 1.7px, transparent 2.3px);
  background-size: 14px 14px;
  transform: translate3d(0, 0, 0);
  animation: hero-dots 3s ease-in-out infinite;
  will-change: opacity;
}

/* ---------- right ---------- */
.hero-root .hero-right { display: flex; flex-direction: column; align-items: flex-start; gap: 26px; min-width: 0; }
.hero-root .hero-panel {
  width: 100%; margin: 0; padding: 10px 14px;
  border-radius: 20px;
  background: var(--h-panel);
  border: 1px solid var(--h-line);
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.hero-root .hero-skill {
  display: flex; align-items: center; gap: 14px;
  margin: 0; padding: 12px 6px;
  border-radius: 14px;
  transition: background-color .25s ease, transform .25s ease;
}
.hero-root .hero-skill + .hero-skill { border-top: 1px solid var(--h-line); }
.hero-root .hero-skill:hover { background: rgba(37, 99, 235, 0.12); transform: translateX(4px); }
.hero-root .hero-skill-icon {
  flex: none; width: 42px; height: 42px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--h-chip); color: var(--h-title);
  transition: transform .35s ease;
}
.hero-root .hero-skill:hover .hero-skill-icon { transform: rotate(-10deg) scale(1.12); }
.hero-root .hero-skill-title { margin: 0; font-size: 0.95rem; font-weight: 600; line-height: 1.25; color: var(--h-title); }
.hero-root .hero-skill-sub { margin: 3px 0 0; font-size: 0.76rem; line-height: 1.3; color: var(--h-text); white-space: nowrap; }

.hero-root .hero-tag { padding-left: 6px; transform: rotate(-5deg); transform-origin: left center; user-select: none; }
.hero-root .hero-tag-text { font-family: 'Caveat', 'Segoe Script', cursive; font-size: 1.7rem; font-weight: 600; line-height: 1.05; color: #3b82f6; }
.hero-root .hero-swoosh { display: block; width: 176px; height: 22px; margin-top: 4px; overflow: visible; }
.hero-root .hero-swoosh path { stroke-dasharray: 200; stroke-dashoffset: 200; animation: hero-draw 1.2s ease-out forwards; }
.hero-root .hero-swoosh path:nth-child(1) { animation-delay: 1.9s; }
.hero-root .hero-swoosh path:nth-child(2) { animation-delay: 2.2s; }

/* ---------- entrance animations ---------- */
.hero-root .hero-in    { opacity: 0; animation: hero-rise 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: var(--d, 0s); will-change: transform, opacity; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.hero-root .hero-slide { opacity: 0; animation: hero-slide 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: var(--d, 0s); will-change: transform, opacity; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.hero-root .hero-pop   { opacity: 0; animation: hero-pop 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; animation-delay: var(--d, 0s); will-change: transform, opacity; backface-visibility: hidden; -webkit-backface-visibility: hidden; }

@keyframes wave-hand { 0%{transform:rotate(0)} 10%{transform:rotate(14deg)} 20%{transform:rotate(-8deg)} 30%{transform:rotate(14deg)} 40%{transform:rotate(-4deg)} 50%{transform:rotate(10deg)} 60%,100%{transform:rotate(0)} }
@keyframes hero-rise { from{opacity:0;transform:translate3d(0, 24px, 0)} to{opacity:1;transform:translate3d(0, 0, 0);filter:none} }
@keyframes hero-slide { from{opacity:0;transform:translate3d(40px, 0, 0)} to{opacity:1;transform:translate3d(0, 0, 0)} }
@keyframes hero-pop { 0%{opacity:0;transform:scale3d(.8, .8, 1)} 70%{transform:scale3d(1.05, 1.05, 1)} 100%{opacity:1;transform:scale3d(1, 1, 1)} }
@keyframes hero-float { 0%,100%{transform:translate3d(0, 0, 0)} 50%{transform:translate3d(0, -10px, 0)} }
@keyframes hero-glow { 0%,100%{opacity:.6;transform:translate3d(0, 0, 0) scale3d(1, 1, 1)} 50%{opacity:1;transform:translate3d(0, 0, 0) scale3d(1.08, 1.08, 1)} }
@keyframes hero-dots { 0%,100%{opacity:.45} 50%{opacity:1} }
@keyframes hero-draw { to{stroke-dashoffset:0} }
@keyframes hero-shine { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }

/* ---------- responsive ---------- */
@media (max-width: 1180px) {
  .hero-root .hero-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr); column-gap: 36px; }
  .hero-root .hero-right { grid-column: 1 / -1; flex-direction: row; align-items: center; gap: 36px; flex-wrap: wrap; }
  .hero-root .hero-panel { max-width: 420px; }
}
@media (max-width: 760px) {
  .hero-root { padding-bottom: 56px; }
  .hero-root .hero-grid { grid-template-columns: 1fr; row-gap: 44px; }
  .hero-root .hero-center { order: 2; }
  .hero-root .hero-right { order: 3; flex-direction: column; align-items: flex-start; }
  .hero-root .hero-panel { max-width: 100%; }
  .hero-root .hero-photo { max-width: 300px; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-root .hero-in, .hero-root .hero-slide, .hero-root .hero-pop { animation: none !important; opacity: 1 !important; transform: none !important; }
  .hero-root .hero-glow, .hero-root .hero-photo, .hero-root .hero-dots, .hero-root .hero-wave, .hero-root .hero-d { animation: none !important; transform: none !important; }
  .hero-root .hero-swoosh path { animation: none !important; stroke-dashoffset: 0 !important; }
  .hero-root a.hero-btn, .hero-root a.hero-btn-primary::before { transition: none !important; }
}
`

const d = (s: number) => ({ '--d': `${s}s` } as React.CSSProperties)

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero-root">
      <style>{css}</style>
      <div className="hero-glow" />

      <div className="container">
        <div className="hero-grid">

          {/* ================= LEFT ================= */}
          <div className="hero-left">
            <div className="hero-greet hero-in" style={d(0.1)}>
              <span className="hero-wave">👋</span>
              <span>Hello, I'm</span>
            </div>

            <h1 className="hero-h1 hero-in" style={d(0.25)}>
              Badhusha <span className="hero-d">D</span>
            </h1>

            <h2 className="hero-h2 hero-in" style={d(0.4)}>Full Stack Developer</h2>

            <p className="hero-p hero-in" style={d(0.55)}>
              I build modern, responsive and user-friendly web applications with a focus on performance and clean code.
            </p>

            <div className="hero-actions hero-in" style={d(0.7)}>
              <Link to="/projects" className="hero-btn hero-btn-primary">
                <span>View My Projects</span>
                <span className="hero-arrow"><IconArrowRight size={18} /></span>
              </Link>

              <Link to="/contact" className="hero-btn hero-btn-ghost">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>Contact Me</span>
              </Link>
            </div>

            <div className="hero-socials">
              {SOCIALS.map((soc, i) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  aria-label={soc.name}
                  target={soc.url.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="hero-social hero-pop"
                  style={d(0.9 + i * 0.1)}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ================= CENTER (photo) ================= */}
          <div className="hero-center hero-slide" style={d(0.35)}>
            <div className={`hero-photo ${PHOTO_POPS_OUT ? 'pops' : ''}`}>
              <div className="hero-layer back" />
              <div className="hero-layer front" />
              <div className="hero-dots" />

              {PHOTO_POPS_OUT ? (
                <img className="hero-cutout" src={PROFILE_IMAGE} alt="Badhusha D" draggable={false} />
              ) : (
                <div className="hero-frame">
                  <img src={PROFILE_IMAGE} alt="Badhusha D" draggable={false} />
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT (skills) ================= */}
          <div className="hero-right">
            <div className="hero-panel hero-slide" style={d(0.5)}>
              {SKILLS_LIST.map((skill, i) => (
                <div key={skill.title} className="hero-skill hero-in" style={d(0.85 + i * 0.12)}>
                  <span className="hero-skill-icon">{skill.icon}</span>
                  <div>
                    <div className="hero-skill-title">{skill.title}</div>
                    <div className="hero-skill-sub">{skill.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hero-tag hero-in" style={d(1.6)}>
              <div className="hero-tag-text">
                Turning Ideas
                <br />
                into Real Solutions
              </div>
              <svg className="hero-swoosh" viewBox="0 0 175 20" fill="none" aria-hidden="true">
                <path d="M 4 14 Q 85 4 170 11" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M 25 17 Q 95 9 155 15" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
export default Hero