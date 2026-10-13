import React, { useEffect, useState } from 'react'
import { Contact as ContactComponent } from '../components/Contact'
import { IconMail, IconPhone, IconMapPin } from '../components/Icons'
import { api } from '../api/client'

const FAQ_ITEMS = [
  {
    q: 'What roles are you currently looking for?',
    a: 'I am actively seeking Junior Backend Developer, Java Developer, and Full Stack Developer positions (full-time, contract, or remote).',
  },
  {
    q: 'How quickly can you respond to inquiries?',
    a: 'I typically reply to all email and form messages within 24 hours on business days.',
  },
  {
    q: 'Can you work with both relational and NoSQL databases?',
    a: 'Yes, my primary expertise is in PostgreSQL and MySQL, with strong schema design and indexing fundamentals.',
  },
  {
    q: 'Are you available for freelance projects?',
    a: 'Yes! I have successfully delivered full-stack CRM and management portals as a freelancer and welcome new inquiries.',
  },
]

/*
 * Scoped CSS with explicit spacing (no Tailwind), because your global CSS resets
 * padding/margins and was breaking the card spacing. Colours follow your theme
 * variables, so dark and light mode both work.
 */
const css = `
.ct-page {
  --c-blue: #2563eb;
  --c-title: var(--text-main, currentColor);
  --c-text: var(--text-muted, currentColor);
  --c-line: color-mix(in srgb, var(--c-title) 14%, transparent);
  --c-chip: color-mix(in srgb, var(--c-title) 7%, transparent);
  --c-tint: color-mix(in srgb, var(--c-title) 3%, transparent);
  width: 100%;
  padding-top: var(--header-height, 72px);
}
.ct-page, .ct-page *, .ct-page *::before, .ct-page *::after { box-sizing: border-box; }

.ct-section { padding: 96px 0; }
.ct-section.tint { background: var(--c-tint); border-top: 1px solid var(--c-line); border-bottom: 1px solid var(--c-line); }

/* ---------- quick channels ---------- */
.ct-channels {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 1080px; margin: 0 auto; padding: 0; list-style: none;
  border-top: 1px solid var(--c-line); border-bottom: 1px solid var(--c-line);
}
.ct-channel {
  position: relative;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  margin: 0; padding: 48px 32px 52px;
}
.ct-channel + .ct-channel { border-left: 1px solid var(--c-line); }
.ct-channel::before {
  content: ''; position: absolute; left: 0; right: 0; top: -1px; height: 2px;
  background: linear-gradient(90deg, #2563eb, #06b6d4);
  transform: scaleX(0); transform-origin: center;
  transition: transform .5s cubic-bezier(0.22, 1, 0.36, 1);
}
.ct-channel:hover::before { transform: scaleX(1); }
.ct-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 60px; height: 60px; margin: 0 0 22px;
  border-radius: 50%;
  background: rgba(37, 99, 235, 0.14); color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
  transition: transform .4s ease, background-color .3s ease, color .3s ease, box-shadow .4s ease;
}
.ct-channel:hover .ct-icon { transform: translateY(-4px) rotate(-8deg); background: var(--c-blue); color: #fff; box-shadow: 0 16px 30px -12px rgba(37, 99, 235, 0.8); }
.ct-ch-title { margin: 0 0 8px; padding: 0; font-size: 1.2rem; font-weight: 700; line-height: 1.25; letter-spacing: -0.015em; color: var(--c-title); }
.ct-ch-note { margin: 0 0 18px; padding: 0; max-width: 260px; font-size: 0.88rem; line-height: 1.6; color: var(--c-text); }
.ct-page a.ct-ch-link, .ct-ch-plain {
  display: inline-block; margin: 0; padding: 0 0 3px;
  font-size: 0.98rem; font-weight: 600; line-height: 1.4; text-decoration: none;
  color: var(--c-title);
}
.ct-page a.ct-ch-link {
  color: #3b82f6;
  background: linear-gradient(currentColor, currentColor) left bottom / 0 1.5px no-repeat;
  transition: background-size .35s ease, color .25s ease;
}
.ct-page a.ct-ch-link:hover { background-size: 100% 1.5px; }

/* ---------- FAQ ---------- */
.ct-wrap { max-width: 820px; margin: 0 auto; }
.ct-head { text-align: center; margin: 0 auto 56px; max-width: 620px; }
.ct-title { margin: 0 0 14px; padding: 0; font-size: clamp(1.9rem, 4vw, 2.7rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; color: var(--c-title); }
.ct-title em {
  font-style: normal;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.ct-sub { margin: 0; padding: 0; font-size: 1.02rem; line-height: 1.7; color: var(--c-text); }

.ct-faq { margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--c-line); }
.ct-faq-item { position: relative; margin: 0; padding: 0; border-bottom: 1px solid var(--c-line); }
.ct-faq-item::after {
  content: ''; position: absolute; left: 0; bottom: -1px; height: 1px; width: 100%;
  background: var(--c-blue); transform: scaleX(0); transform-origin: left;
  transition: transform .5s cubic-bezier(0.22, 1, 0.36, 1);
}
.ct-faq-item.open::after, .ct-faq-item:hover::after { transform: scaleX(1); }
.ct-faq-btn {
  display: grid; grid-template-columns: 48px minmax(0, 1fr) 36px; align-items: center; column-gap: 8px;
  width: 100%; margin: 0; padding: 26px 0;
  background: none; border: none; text-align: left; cursor: pointer;
  color: var(--c-title); font: inherit;
}
.ct-faq-num { font-size: 0.85rem; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: 0.06em; color: rgba(59, 130, 246, 0.8); }
.ct-faq-q { font-size: 1.1rem; font-weight: 600; line-height: 1.4; letter-spacing: -0.01em; transition: color .25s ease; }
.ct-faq-btn:hover .ct-faq-q, .ct-faq-item.open .ct-faq-q { color: #3b82f6; }
.ct-faq-plus {
  position: relative; justify-self: end;
  width: 32px; height: 32px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--c-chip); color: var(--c-title);
  transition: transform .4s ease, background-color .3s ease, color .3s ease;
}
.ct-faq-item.open .ct-faq-plus { transform: rotate(45deg); background: var(--c-blue); color: #fff; }
.ct-faq-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .45s cubic-bezier(0.22, 1, 0.36, 1); }
.ct-faq-item.open .ct-faq-panel { grid-template-rows: 1fr; }
.ct-faq-panel > div { overflow: hidden; }
.ct-faq-a { margin: 0; padding: 0 56px 28px 56px; font-size: 1rem; line-height: 1.8; color: var(--c-text); }

/* ---------- availability ---------- */
.ct-cta { position: relative; overflow: hidden; text-align: center; padding: 110px 0; }
.ct-cta::before {
  content: ''; position: absolute; left: 50%; top: 50%; width: 720px; height: 420px;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse, rgba(37, 99, 235, 0.22), transparent 70%);
  filter: blur(30px); pointer-events: none;
  animation: ct-glow 7s ease-in-out infinite;
}
.ct-cta-inner { position: relative; display: flex; flex-direction: column; align-items: center; max-width: 720px; margin: 0 auto; }
.ct-avail {
  display: inline-flex; align-items: center; gap: 10px;
  margin: 0 0 26px; padding: 9px 18px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35);
  color: #10b981; font-size: 0.74rem; font-weight: 700; line-height: 1; letter-spacing: 0.12em; text-transform: uppercase;
}
.ct-dot { position: relative; width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
.ct-dot::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: #10b981; animation: ct-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
.ct-cta-title { margin: 0 0 18px; padding: 0; font-size: clamp(2rem, 4.6vw, 3.2rem); font-weight: 800; line-height: 1.12; letter-spacing: -0.03em; color: var(--c-title); }
.ct-cta-title em { font-style: normal; background: linear-gradient(90deg, #3b82f6, #06b6d4); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.ct-cta-text { margin: 0; padding: 0; max-width: 600px; font-size: 1.08rem; line-height: 1.75; color: var(--c-text); }

/* ---------- reveal & keyframes ---------- */
.ct-reveal { opacity: 0; transform: translateY(24px); transition: opacity .75s ease, transform .75s cubic-bezier(0.22, 1, 0.36, 1); transition-delay: var(--d, 0s); }
.ct-reveal.ct-visible { opacity: 1; transform: none; }
@keyframes ct-ping { 0% { transform: scale(1); opacity: .7; } 80%, 100% { transform: scale(3); opacity: 0; } }
@keyframes ct-glow { 0%, 100% { opacity: .65; } 50% { opacity: 1; } }

/* ---------- responsive ---------- */
@media (max-width: 860px) {
  .ct-section { padding: 72px 0; }
  .ct-cta { padding: 84px 0; }
  .ct-channels { grid-template-columns: 1fr; }
  .ct-channel { padding: 40px 24px; }
  .ct-channel + .ct-channel { border-left: none; border-top: 1px solid var(--c-line); }
  .ct-faq-a { padding: 0 8px 26px 56px; }
}
@media (max-width: 520px) {
  .ct-faq-btn { grid-template-columns: 34px minmax(0, 1fr) 32px; padding: 22px 0; }
  .ct-faq-q { font-size: 1rem; }
  .ct-faq-a { padding: 0 0 24px 34px; }
}
@media (prefers-reduced-motion: reduce) {
  .ct-reveal { opacity: 1; transform: none; transition: none; }
  .ct-cta::before, .ct-dot::after { animation: none; }
  .ct-channel::before, .ct-icon, .ct-faq-panel, .ct-faq-plus, .ct-faq-item::after { transition: none; }
}
`

const d = (s: number) => ({ '--d': `${s}s` } as React.CSSProperties)

export const ContactPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.ct-page .ct-reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('ct-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('ct-visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main className="ct-page">
      <style>{css}</style>

      {/* Session 1: Direct Message Form & Info */}
      <ContactComponent source="Contact Page" />

      {/* Session 2: Quick Communication Channels */}
      <section className="ct-section tint">
        <div className="container">
          <ul className="ct-channels">
            <li className="ct-channel ct-reveal">
              <span className="ct-icon"><IconMail size={24} /></span>
              <h3 className="ct-ch-title">Email Me</h3>
              <p className="ct-ch-note">For business inquiries and opportunities</p>
              <a href="mailto:badhushad0@gmail.com" className="ct-ch-link">badhushad0@gmail.com</a>
            </li>

            <li className="ct-channel ct-reveal" style={d(0.1)}>
              <span className="ct-icon"><IconPhone size={24} /></span>
              <h3 className="ct-ch-title">Call / WhatsApp</h3>
              <p className="ct-ch-note">Available during standard IST business hours</p>
              <a href="tel:+919994686205" className="ct-ch-link">+91 9994686205</a>
            </li>

            <li className="ct-channel ct-reveal" style={d(0.2)}>
              <span className="ct-icon"><IconMapPin size={24} /></span>
              <h3 className="ct-ch-title">Location</h3>
              <p className="ct-ch-note">Open to on-site and remote opportunities</p>
              <span className="ct-ch-plain">Tiruchirappalli, Tamil Nadu, India</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Session 3: Frequently Asked Questions */}
      <section className="ct-section">
        <div className="container">
          <div className="ct-wrap">
            <div className="ct-head ct-reveal">
              <h2 className="ct-title">
                Frequently <em>Asked</em> Questions
              </h2>
              <p className="ct-sub">
                Common questions regarding availability, technical fit, and response time.
              </p>
            </div>

            <ul className="ct-faq">
              {FAQ_ITEMS.map((item, idx) => {
                const open = openIdx === idx
                return (
                  <li key={idx} className={`ct-faq-item ct-reveal ${open ? 'open' : ''}`} style={d(idx * 0.08)}>
                    <button
                      type="button"
                      className="ct-faq-btn"
                      aria-expanded={open}
                      onClick={() => setOpenIdx(open ? null : idx)}
                    >
                      <span className="ct-faq-num">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="ct-faq-q">{item.q}</span>
                      <span className="ct-faq-plus" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </span>
                    </button>
                    <div className="ct-faq-panel">
                      <div>
                        <p className="ct-faq-a">{item.a}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Session 4: Availability & Response Commitment */}
      <section className="ct-section tint ct-cta">
        <div className="container">
          <div className="ct-cta-inner ct-reveal">
            <div className="ct-avail">
              <span className="" />
              Immediate Availability
            </div>
            <h2 className="ct-cta-title">
              Ready to Join Your <em>Engineering Team</em>
            </h2>
            <p className="ct-cta-text">
              I can onboard quickly with minimal ramp-up time. Feel free to{' '}
              <a
                href={api.getCVDownloadUrl()}
                download="Badhusha_D_CV.pdf"
                style={{
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                download my resume
              </a>{' '}
              or leave a message through the contact form above.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
export default ContactPage