import React, { useEffect, useState } from 'react'
import {
  CircleHelp,
  ChevronDown,
  Briefcase,
  Clock,
  Database,
  Sparkles,
  MessageCircleQuestion,
  ArrowRight,
} from 'lucide-react'
import { Contact as ContactComponent } from '../components/Contact'
import { IconMail, IconPhone, IconMapPin } from '../components/Icons'
import { api } from '../api/client'

interface FAQItem {
  q: string
  a: string
  category: string
  icon: React.ComponentType<{ className?: string }>
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'What roles are you currently looking for?',
    a: 'I am actively seeking Junior Backend Developer, Java Developer, and Full Stack Developer positions (full-time, contract, or remote). Open to hybrid or on-site opportunities as well as distributed teams.',
    category: 'Career & Opportunities',
    icon: Briefcase,
  },
  {
    q: 'How quickly can you respond to inquiries?',
    a: 'I typically reply to all email, WhatsApp, and contact form messages within 24 hours on business days. For urgent matters, direct phone or WhatsApp is the fastest channel.',
    category: 'Communication',
    icon: Clock,
  },
  {
    q: 'Can you work with both relational and NoSQL databases?',
    a: 'Yes! My primary expertise is in PostgreSQL and MySQL with schema modeling, query optimization, and indexing. I also work with MongoDB and Redis for caching and rapid prototyping.',
    category: 'Technical Fit',
    icon: Database,
  },
  {
    q: 'Are you available for freelance projects?',
    a: 'Yes! I have successfully delivered full-stack CRM and management portals as a freelancer. I can handle database design, REST APIs, responsive frontends, and cloud deployment.',
    category: 'Freelance & Contract',
    icon: Sparkles,
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
}
@media (prefers-reduced-motion: reduce) {
  .ct-reveal { opacity: 1; transform: none; transition: none; }
  .ct-cta::before, .ct-dot::after { animation: none; }
  .ct-channel::before, .ct-icon { transition: none; }
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

      {/* Session 3: Frequently Asked Questions (Tailwind CSS) */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white dark:from-[#090d16] dark:via-[#0c1322] dark:to-[#090d16] border-y border-slate-200/80 dark:border-white/10">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-blue-400/10 dark:bg-blue-600/15 rounded-full blur-[110px] pointer-events-none -z-0" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200/90 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/25 mb-4 shadow-sm">
                <CircleHelp className="w-3.5 h-3.5" />
                <span>FAQ Guide</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Frequently <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">Asked</span> Questions
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Common questions regarding my availability, technical capabilities, response times, and project fit.
              </p>
            </div>

            {/* FAQ Accordion List */}
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => {
                const open = openIdx === idx
                const IconComponent = item.icon
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      open
                        ? 'bg-white dark:bg-[#0f172a] border-blue-600 dark:border-blue-500/80 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/15'
                        : 'bg-white dark:bg-[#0f172a]/70 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-md shadow-sm'
                    }`}
                  >
                    <button
                      type="button"
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none transition-colors"
                      onClick={() => setOpenIdx(open ? null : idx)}
                      aria-expanded={open}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Icon Box */}
                        <div
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            open
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                              : 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/50'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>

                        {/* Question & Category */}
                        <div className="min-w-0">
                          <span className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                            {item.category}
                          </span>
                          <h3
                            className={`text-base sm:text-lg font-semibold tracking-tight transition-colors duration-200 ${
                              open
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {item.q}
                          </h3>
                        </div>
                      </div>

                      {/* Chevron Toggle */}
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          open
                            ? 'bg-blue-600 text-white rotate-180 shadow-sm'
                            : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                      </div>
                    </button>

                    {/* Expandable Answer Panel */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 sm:px-6 pb-6 pt-3 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Need more answers banner */}
            <div className="mt-12 sm:mt-14 p-6 sm:p-8 rounded-2xl border border-blue-200/80 dark:border-slate-800 bg-gradient-to-r from-blue-50/80 via-white to-sky-50/80 dark:from-[#0d1527] dark:via-[#101b33] dark:to-[#0d1527] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                  <MessageCircleQuestion className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Have a different question or specific requirement?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                    I'm happy to provide custom solutions or clarify any technical details.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold !text-white !bg-blue-600 hover:!bg-blue-500 shadow-md shadow-blue-600/30 transition-all duration-200 whitespace-nowrap active:scale-95 cursor-pointer"
                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
              >
                <span style={{ color: '#ffffff' }}>Ask Directly</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Session 4: Availability & Response Commitment */}
      <section className="ct-section tint ct-cta">
        <div className="container">
          <div className="ct-cta-inner ct-reveal">
            <div className="ct-avail">
              <span className="ct-dot" />
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