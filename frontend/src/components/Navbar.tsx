import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  IconSun,
  IconMoon,
  IconShield,
  IconMenu,
  IconX,
} from './Icons'
import { api } from '../api/client'

interface NavbarProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

// Dynamic CV download route - automatically serves the newest file uploaded by admin,
// or falls back to default resume if no custom file has been uploaded.
const CV_HREF = '/api/profile/cv/download'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/skills', label: 'Skills' },
  { path: '/projects', label: 'Projects' },
  { path: '/contact', label: 'Contact' },
]

/*
 * Colours are driven by the `theme` prop (data-theme on the header), NOT by
 * Tailwind `dark:` classes. Those follow the browser/OS setting, which is why the bar
 * could turn dark (or stay light) while the page used the other theme and the text
 * disappeared after scrolling.
 */
const css = `
.nb {
  --nb-h: var(--header-height, 72px);
  --nb-blue: #2563eb;
}
.nb[data-theme='dark'] {
  --nb-text: #e2e8f0;
  --nb-muted: #aab4c8;
  --nb-title: #ffffff;
  --nb-active: #60a5fa;
  --nb-bg: rgba(9, 13, 22, 0.82);
  --nb-bg-solid: #0b1020;
  --nb-line: rgba(255, 255, 255, 0.12);
  --nb-chip: rgba(255, 255, 255, 0.08);
  --nb-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.8);
}
.nb[data-theme='light'] {
  --nb-text: #1e293b;
  --nb-muted: #475569;
  --nb-title: #0b1633;
  --nb-active: #2563eb;
  --nb-bg: rgba(255, 255, 255, 0.86);
  --nb-bg-solid: #ffffff;
  --nb-line: rgba(15, 23, 42, 0.12);
  --nb-chip: rgba(15, 23, 42, 0.06);
  --nb-shadow: 0 10px 30px -20px rgba(15, 23, 42, 0.35);
}
.nb, .nb *, .nb *::before, .nb *::after { box-sizing: border-box; }

.nb {
  position: fixed; top: 0; left: 0; right: 0;
  height: var(--nb-h);
  z-index: 100;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: background-color .3s ease, border-color .3s ease, box-shadow .3s ease, backdrop-filter .3s ease;
  animation: nb-drop .7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.nb.scrolled, .nb.open {
  background: var(--nb-bg);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  backdrop-filter: blur(14px) saturate(160%);
  border-bottom-color: var(--nb-line);
  box-shadow: var(--nb-shadow);
}
.nb.open { background: var(--nb-bg-solid); }

.nb .nb-inner {
  height: 100%;
  display: flex; align-items: center; justify-content: space-between;
  gap: 24px;
}

/* brand */
.nb a.nb-brand {
  display: inline-flex; align-items: center; gap: 12px;
  color: var(--nb-title); text-decoration: none;
  font-size: 1.1rem; font-weight: 700; letter-spacing: -0.01em;
}
.nb .nb-logo {
  width: 38px; height: 38px; border-radius: 12px;
  display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff; font-size: 0.85rem; font-weight: 800;
  box-shadow: 0 8px 18px -8px rgba(37, 99, 235, 0.9);
  transition: transform .3s ease;
}
.nb a.nb-brand:hover .nb-logo { transform: rotate(-6deg) scale(1.06); }
.nb .nb-brand-d { color: var(--nb-active); font-weight: 800; }

/* links */
.nb .nb-links { display: flex; align-items: center; gap: 30px; }
.nb a.nb-link {
  position: relative;
  padding: 6px 0;
  font-size: 0.9rem; font-weight: 600; line-height: 1.2;
  color: var(--nb-muted); text-decoration: none;
  transition: color .2s ease;
}
.nb a.nb-link:hover { color: var(--nb-active); }
.nb a.nb-link.active { color: var(--nb-active); font-weight: 700; }
.nb a.nb-link::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 2px; border-radius: 2px;
  background: var(--nb-active);
  transform: scaleX(0); transform-origin: left;
  transition: transform .3s cubic-bezier(0.22, 1, 0.36, 1);
}
.nb a.nb-link:hover::after, .nb a.nb-link.active::after { transform: scaleX(1); }

/* actions */
.nb .nb-actions { display: flex; align-items: center; gap: 10px; }
.nb .nb-icon-btn {
  width: 38px; height: 38px; padding: 0; margin: 0;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--nb-chip); color: var(--nb-text);
  border: 1px solid var(--nb-line);
  cursor: pointer;
  transition: transform .25s ease, color .25s ease, border-color .25s ease, background-color .25s ease;
}
.nb .nb-icon-btn:hover { color: var(--nb-active); border-color: var(--nb-active); transform: rotate(15deg); }

.nb a.nb-pill {
  display: inline-flex; align-items: center; gap: 8px;
  height: 38px; padding: 0 16px; margin: 0;
  border-radius: 999px;
  font-size: 0.8rem; font-weight: 600; line-height: 1; white-space: nowrap;
  color: var(--nb-text); text-decoration: none;
  border: 1.5px solid var(--nb-line);
  transition: transform .25s ease, color .25s ease, border-color .25s ease, background-color .25s ease;
}
.nb a.nb-pill:hover { color: var(--nb-active); border-color: var(--nb-active); background: rgba(37, 99, 235, 0.1); transform: translateY(-2px); }
.nb a.nb-pill.primary { border-color: rgba(37, 99, 235, 0.55); }

.nb .nb-burger { display: none; }

/* mobile menu */
.nb .nb-mobile {
  position: absolute; top: 100%; left: 0; right: 0;
  background: var(--nb-bg-solid);
  border-bottom: 1px solid var(--nb-line);
  box-shadow: var(--nb-shadow);
  padding: 14px 24px 20px;
  display: flex; flex-direction: column; gap: 4px;
  animation: nb-menu .3s ease both;
}
.nb a.nb-m-link {
  padding: 12px 14px; border-radius: 12px;
  font-size: 0.95rem; font-weight: 600;
  color: var(--nb-text); text-decoration: none;
  transition: background-color .2s ease, color .2s ease;
}
.nb a.nb-m-link:hover { background: var(--nb-chip); }
.nb a.nb-m-link.active { background: rgba(37, 99, 235, 0.14); color: var(--nb-active); font-weight: 700; }
.nb .nb-m-foot { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; padding-top: 14px; border-top: 1px solid var(--nb-line); }

@keyframes nb-drop { from { opacity: 0; transform: translateY(-100%); } to { opacity: 1; transform: none; } }
@keyframes nb-menu { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }

@media (max-width: 860px) {
  .nb .nb-links { display: none; }
  .nb .nb-burger { display: inline-flex; }
  .nb .nb-desktop-only { display: none !important; }
}
@media (prefers-reduced-motion: reduce) {
  .nb, .nb .nb-mobile { animation: none; }
  .nb *, .nb *::before, .nb *::after { transition: none !important; }
}
`

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cvFilename, setCvFilename] = useState('Badhusha_D_CV.pdf')
  const location = useLocation()

  useEffect(() => {
    // Fetch latest profile CV filename dynamically
    api.getProfile()
      .then((data) => {
        if (data.cv_filename) {
          setCvFilename(data.cv_filename)
        }
      })
      .catch(() => {
        // Fallback already defaults to Badhusha_D_CV.pdf
      })
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the mobile menu whenever the page changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const isAdminRoute = location.pathname.startsWith('/admin')
  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const cvInner = (
    <>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
      <span>Download CV</span>
    </>
  )

  return (
    <header
      className={`nb ${isScrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'open' : ''}`}
      data-theme={theme}
    >
      <style>{css}</style>

      <div className="container nb-inner">
        {/* Brand */}
        <Link to="/" className="nb-brand">
          <span className="nb-logo">BD</span>
          <span>Badhusha <span className="nb-brand-d">D</span></span>
        </Link>

        {/* Desktop links */}
        <nav className="nb-links" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nb-link ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="nb-actions">
          <button
            type="button"
            onClick={onToggleTheme}
            className="nb-icon-btn"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
          </button>

          <a
            href={CV_HREF}
            download={cvFilename}
            className="nb-pill primary nb-desktop-only"
            title="Download CV"
          >
            {cvInner}
          </a>

          <Link
            to={isAdminRoute ? '/' : '/admin'}
            className="nb-pill nb-desktop-only"
            title={isAdminRoute ? 'Return to public portfolio' : 'Admin dashboard'}
          >
            <IconShield size={14} />
            <span>{isAdminRoute ? 'Site' : 'Admin'}</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="nb-icon-btn nb-burger"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <IconX size={20} /> : <IconMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="nb-mobile">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nb-m-link ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="nb-m-foot">
            <a
              href={CV_HREF}
              download={cvFilename}
              className="nb-pill primary"
              title="Download CV"
            >
              {cvInner}
            </a>
            <Link to={isAdminRoute ? '/' : '/admin'} className="nb-pill">
              <IconShield size={14} />
              <span>{isAdminRoute ? 'Site' : 'Admin Portal'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
export default Navbar