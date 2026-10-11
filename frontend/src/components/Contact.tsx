import React, { useState } from 'react'
import { api } from '../api/client'
import {
  IconCheck,
  IconAlertCircle,
  IconMail,
  IconPhone,
  IconMapPin,
} from './Icons'
import { Briefcase, ChevronDown } from 'lucide-react'

interface ContactProps {
  source?: 'Homepage' | 'Contact Page'
}

type ContactMode = 'social' | 'business'

export const Contact: React.FC<ContactProps> = ({ source = 'Homepage' }) => {
  // Mode Selection: default is always 'social' (Social Connect)
  const [mode, setMode] = useState<ContactMode>('social')

  // --- Social Connect Form State ---
  const [socialForm, setSocialForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [socialStatus, setSocialStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [socialStatusMessage, setSocialStatusMessage] = useState('')
  const [socialErrors, setSocialErrors] = useState<Record<string, string>>({})

  // --- Business Chat Form State ---
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    email: '',
    requirementType: 'Website' as 'Website' | 'Web Application' | 'Others',
    otherRequirement: '',
    message: '',
  })
  const [businessStatus, setBusinessStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [businessStatusMessage, setBusinessStatusMessage] = useState('')
  const [businessErrors, setBusinessErrors] = useState<Record<string, string>>({})

  // -------------------------------------------------------------
  // Social Connect Validation & Handlers
  // -------------------------------------------------------------
  const validateSocial = () => {
    const errs: Record<string, string> = {}
    if (!socialForm.name.trim() || socialForm.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.'
    }
    if (!socialForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(socialForm.email)) {
      errs.email = 'Enter a valid email address.'
    }
    if (!socialForm.message.trim() || socialForm.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters.'
    }
    return errs
  }

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateSocial()
    if (Object.keys(errs).length > 0) {
      setSocialErrors(errs)
      return
    }
    setSocialErrors({})
    setSocialStatus('loading')
    try {
      const res = await api.submitContact({
        ...socialForm,
        source,
      })
      setSocialStatus('success')
      setSocialStatusMessage(res.message)
      setSocialForm({ name: '', email: '', subject: '', message: '' })
    } catch (err: unknown) {
      setSocialStatus('error')
      setSocialStatusMessage(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
    }
  }

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSocialForm((p) => ({ ...p, [name]: value }))
    if (socialErrors[name]) setSocialErrors((p) => { const n = { ...p }; delete n[name]; return n })
    if (socialStatus !== 'idle') setSocialStatus('idle')
  }

  // -------------------------------------------------------------
  // Business Chat Validation & Handlers
  // -------------------------------------------------------------
  const validateBusiness = () => {
    const errs: Record<string, string> = {}
    if (!businessForm.businessName.trim() || businessForm.businessName.trim().length < 2) {
      errs.businessName = 'Business name is required (min 2 characters).'
    }
    if (!businessForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessForm.email)) {
      errs.email = 'Enter a valid business email address.'
    }
    if (businessForm.requirementType === 'Others' && (!businessForm.otherRequirement.trim() || businessForm.otherRequirement.trim().length < 2)) {
      errs.otherRequirement = 'Please specify your requirements.'
    }
    if (!businessForm.message.trim() || businessForm.message.trim().length < 10) {
      errs.message = 'Please provide details about your project (min 10 characters).'
    }
    return errs
  }

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateBusiness()
    if (Object.keys(errs).length > 0) {
      setBusinessErrors(errs)
      return
    }
    setBusinessErrors({})
    setBusinessStatus('loading')
    try {
      const res = await api.submitBusinessMessage({
        businessName: businessForm.businessName.trim(),
        email: businessForm.email.trim(),
        requirementType: businessForm.requirementType,
        otherRequirement: businessForm.requirementType === 'Others' ? businessForm.otherRequirement.trim() : undefined,
        message: businessForm.message.trim(),
      })
      setBusinessStatus('success')
      setBusinessStatusMessage(res.message)
      setBusinessForm({
        businessName: '',
        email: '',
        requirementType: 'Website',
        otherRequirement: '',
        message: '',
      })
    } catch (err: unknown) {
      setBusinessStatus('error')
      setBusinessStatusMessage(err instanceof Error ? err.message : 'Failed to submit business inquiry. Please try again.')
    }
  }

  const handleBusinessChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setBusinessForm((p) => {
      const updated = { ...p, [name]: value }
      // Clear conditional otherRequirement if requirementType changes away from 'Others'
      if (name === 'requirementType' && value !== 'Others') {
        updated.otherRequirement = ''
      }
      return updated
    })
    if (businessErrors[name]) setBusinessErrors((p) => { const n = { ...p }; delete n[name]; return n })
    if (businessStatus !== 'idle') setBusinessStatus('idle')
  }

  const contactDetails = [
    { icon: <IconMail size={20} />, label: 'Email', value: 'badhushad0@gmail.com', href: 'mailto:badhushad0@gmail.com' },
    { icon: <IconPhone size={20} />, label: 'Phone', value: '+91 9994686205', href: 'tel:+919994686205' },
    { icon: <IconMapPin size={20} />, label: 'Location', value: 'Tiruchirappalli, Tamil Nadu, India', href: null },
  ]

  return (
    <section id="contact" className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-pill">
            <IconMail size={14} />
            Contact
          </div>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Have an opportunity, project, or just want to connect? I'm always open to discussing backend engineering roles, full-stack systems, and business collaborations.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)',
            gap: '32px',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
          className="contact-grid"
        >
          {/* Contact Info Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {contactDetails.map((detail) => (
              <div
                key={detail.label}
                className="card"
                style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {detail.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-subtle)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontWeight: 600,
                      marginBottom: '3px',
                    }}
                  >
                    {detail.label}
                  </div>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        textDecoration: 'none',
                        transition: 'color 0.18s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {detail.value}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Professional Availability Note */}
            <div
              className="card"
              style={{
                padding: '20px 24px',
                borderColor: 'var(--border-accent)',
                background: 'rgba(16, 185, 129, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
                  Currently Available
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Open to backend engineering roles, Java development positions, enterprise web apps, and consulting inquiries. Based in Tiruchirappalli, India.
              </p>
            </div>
          </div>

          {/* Form Container Card */}
          <div className="card" style={{ padding: '32px' }}>
            {/* Mode Dropdown Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                {mode === 'social' ? 'Send a Message' : 'Business Inquiry'}
              </h3>

              {/* Mode Selector Dropdown */}
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <label htmlFor="contact-mode-select" className="sr-only">Contact Mode</label>
                <select
                  id="contact-mode-select"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as ContactMode)}
                  aria-label="Select contact mode: Social Connect or Business Chat"
                  style={{
                    appearance: 'none',
                    padding: '8px 34px 8px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-medium)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <option value="social">Social Connect</option>
                  <option value="business">Business Chat</option>
                </select>
                <ChevronDown
                  size={14}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    pointerEvents: 'none',
                    color: 'var(--text-subtle)',
                  }}
                />
              </div>
            </div>

            {/* ============================================================ */}
            {/* OPTION 1: SOCIAL CONNECT (Default, Exactly Preserved)        */}
            {/* ============================================================ */}
            {mode === 'social' && (
              <>
                {socialStatus === 'success' && (
                  <div className="alert alert-success" style={{ marginBottom: '16px' }}>
                    <IconCheck size={18} />
                    {socialStatusMessage}
                  </div>
                )}

                {socialStatus === 'error' && (
                  <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                    <IconAlertCircle size={18} />
                    {socialStatusMessage}
                  </div>
                )}

                <form onSubmit={handleSocialSubmit} noValidate>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-name">Name *</label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={socialForm.name}
                        onChange={handleSocialChange}
                        placeholder="Your full name"
                        className="form-control"
                        style={{ borderColor: socialErrors.name ? 'var(--status-error)' : undefined }}
                        required
                      />
                      {socialErrors.name && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--status-error)' }}>
                          {socialErrors.name}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-email">Email *</label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={socialForm.email}
                        onChange={handleSocialChange}
                        placeholder="you@example.com"
                        className="form-control"
                        style={{ borderColor: socialErrors.email ? 'var(--status-error)' : undefined }}
                        required
                      />
                      {socialErrors.email && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--status-error)' }}>
                          {socialErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-subject">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      value={socialForm.subject}
                      onChange={handleSocialChange}
                      placeholder="Job opportunity, project inquiry, etc."
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">Message *</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={socialForm.message}
                      onChange={handleSocialChange}
                      placeholder="Tell me about your opportunity or how I can help..."
                      className="form-control"
                      rows={5}
                      style={{
                        resize: 'vertical',
                        minHeight: '120px',
                        borderColor: socialErrors.message ? 'var(--status-error)' : undefined,
                      }}
                      required
                    />
                    {socialErrors.message && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--status-error)' }}>
                        {socialErrors.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={socialStatus === 'loading'}
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '1rem',
                      marginTop: '4px',
                      opacity: socialStatus === 'loading' ? 0.75 : 1,
                    }}
                  >
                    {socialStatus === 'loading' ? (
                      <>
                        <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                        Sending…
                      </>
                    ) : (
                      <>
                        <IconMail size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ============================================================ */}
            {/* OPTION 2: BUSINESS CHAT (New Form with Conditional Field)    */}
            {/* ============================================================ */}
            {mode === 'business' && (
              <>
                {businessStatus === 'success' && (
                  <div className="alert alert-success" style={{ marginBottom: '16px' }}>
                    <IconCheck size={18} />
                    {businessStatusMessage}
                  </div>
                )}

                {businessStatus === 'error' && (
                  <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                    <IconAlertCircle size={18} />
                    {businessStatusMessage}
                  </div>
                )}

                <form onSubmit={handleBusinessSubmit} noValidate>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* 1. Business Name */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="business-name">Business Name *</label>
                      <input
                        id="business-name"
                        type="text"
                        name="businessName"
                        value={businessForm.businessName}
                        onChange={handleBusinessChange}
                        placeholder="Company or Organization"
                        className="form-control"
                        style={{ borderColor: businessErrors.businessName ? 'var(--status-error)' : undefined }}
                        required
                      />
                      {businessErrors.businessName && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--status-error)' }}>
                          {businessErrors.businessName}
                        </span>
                      )}
                    </div>

                    {/* 2. Business Email */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="business-email">Business Email *</label>
                      <input
                        id="business-email"
                        type="email"
                        name="email"
                        value={businessForm.email}
                        onChange={handleBusinessChange}
                        placeholder="contact@company.com"
                        className="form-control"
                        style={{ borderColor: businessErrors.email ? 'var(--status-error)' : undefined }}
                        required
                      />
                      {businessErrors.email && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--status-error)' }}>
                          {businessErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3. Requirements Dropdown */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="business-requirement-type">Requirements *</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        id="business-requirement-type"
                        name="requirementType"
                        value={businessForm.requirementType}
                        onChange={handleBusinessChange}
                        className="form-control"
                        style={{ appearance: 'none', paddingRight: '36px', cursor: 'pointer' }}
                        required
                      >
                        <option value="Website">Website</option>
                        <option value="Web Application">Web Application</option>
                        <option value="Others">Others</option>
                      </select>
                      <ChevronDown
                        size={16}
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          color: 'var(--text-subtle)',
                        }}
                      />
                    </div>
                  </div>

                  {/* 4. Conditional Other Requirements Field */}
                  {businessForm.requirementType === 'Others' && (
                    <div className="form-group" style={{ animation: 'fadeIn 0.25s ease' }}>
                      <label className="form-label" htmlFor="business-other-requirement">
                        Please specify your requirements *
                      </label>
                      <input
                        id="business-other-requirement"
                        type="text"
                        name="otherRequirement"
                        value={businessForm.otherRequirement}
                        onChange={handleBusinessChange}
                        placeholder="e.g. Mobile API backend, Database migration, Cloud deployment..."
                        className="form-control"
                        style={{ borderColor: businessErrors.otherRequirement ? 'var(--status-error)' : undefined }}
                        required
                      />
                      {businessErrors.otherRequirement && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--status-error)' }}>
                          {businessErrors.otherRequirement}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 5. Message */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="business-message">Message *</label>
                    <textarea
                      id="business-message"
                      name="message"
                      value={businessForm.message}
                      onChange={handleBusinessChange}
                      placeholder="Describe your project, timeline, expected functionality, and goals..."
                      className="form-control"
                      rows={5}
                      style={{
                        resize: 'vertical',
                        minHeight: '120px',
                        borderColor: businessErrors.message ? 'var(--status-error)' : undefined,
                      }}
                      required
                    />
                    {businessErrors.message && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--status-error)' }}>
                        {businessErrors.message}
                      </span>
                    )}
                  </div>

                  {/* 6. Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={businessStatus === 'loading'}
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '1rem',
                      marginTop: '4px',
                      opacity: businessStatus === 'loading' ? 0.75 : 1,
                    }}
                  >
                    {businessStatus === 'loading' ? (
                      <>
                        <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                        Submitting Inquiry…
                      </>
                    ) : (
                      <>
                        <Briefcase size={18} />
                        Submit Business Inquiry
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

export default Contact
