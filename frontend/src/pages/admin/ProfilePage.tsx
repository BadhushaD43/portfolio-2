import React, { useState, useEffect, useCallback, useRef } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { useAuth } from '../../auth/AuthContext'
import { api } from '../../api/client'
import type { ProfileData } from '../../types'
import {
  User,
  Mail,
  GraduationCap,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Download,
  FileCheck,
  RefreshCw,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react'

export const ProfilePage: React.FC = () => {
  const { token } = useAuth()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [uploadingCV, setUploadingCV] = useState(false)

  // Form fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [education, setEducation] = useState('')

  // Selected CV file for upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  // Feedback messages
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const loadProfile = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getProfile()
      setProfile(data)
      setFullName(data.full_name || '')
      setEmail(data.email || '')
      setEducation(data.education || '')
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to load profile data.',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  // Handle Profile Update Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter both full name and email.',
      })
      return
    }

    setSavingProfile(true)
    setStatusMessage(null)
    try {
      const updated = await api.updateProfile(
        {
          full_name: fullName.trim(),
          email: email.trim(),
          education: education.trim(),
        },
        token
      )
      setProfile(updated)
      setStatusMessage({
        type: 'success',
        text: 'Profile information updated successfully! Changes are now live.',
      })
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update profile.',
      })
    } finally {
      setSavingProfile(false)
    }
  }

  // Handle CV File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['.pdf', '.doc', '.docx']
    const hasValidExt = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    )

    if (!hasValidExt) {
      setStatusMessage({
        type: 'error',
        text: 'Please select a valid document format (.pdf, .doc, or .docx).',
      })
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      setStatusMessage({
        type: 'error',
        text: 'File exceeds maximum allowed size of 15 MB.',
      })
      return
    }

    setSelectedFile(file)
    setStatusMessage(null)
  }

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  // Handle CV Upload Submission
  const handleUploadCV = async () => {
    if (!selectedFile) return

    setUploadingCV(true)
    setStatusMessage(null)
    try {
      const updated = await api.uploadCV(selectedFile, token)
      setProfile(updated)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setStatusMessage({
        type: 'success',
        text: `CV uploaded successfully! Visitors clicking "Download CV" on the website will now download "${updated.cv_filename}".`,
      })
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to upload CV file.',
      })
    } finally {
      setUploadingCV(false)
    }
  }

  // Handle Admin Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter both New password and Confirm password.',
      })
      return
    }

    if (newPassword.trim().length < 6) {
      setStatusMessage({
        type: 'error',
        text: 'New password must be at least 6 characters long.',
      })
      return
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({
        type: 'error',
        text: 'New password and Confirm password do not match. Please verify.',
      })
      return
    }

    setUpdatingPassword(true)
    setStatusMessage(null)
    try {
      const res = await api.changePassword(
        {
          current_password: currentPassword ? currentPassword.trim() : undefined,
          new_password: newPassword.trim(),
          confirm_password: confirmPassword.trim(),
        },
        token
      )
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setStatusMessage({
        type: 'success',
        text: res.message || 'Admin password updated successfully! Please remember your new password.',
      })
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to change admin password.',
      })
    } finally {
      setUpdatingPassword(false)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <AdminLayout
      title="Admin Profile & CV Management"
      subtitle="Edit your public profile attributes, education history, and upload your downloadable CV file."
      actions={
        <button
          onClick={loadProfile}
          disabled={loading}
          className="btn btn-secondary btn-sm"
          style={{ gap: '8px' }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      }
    >
      {/* Status Notification */}
      {statusMessage && (
        <div
          className={`alert ${
            statusMessage.type === 'success' ? 'alert-success' : 'alert-error'
          }`}
          style={{
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            animation: 'fadeIn 0.2s ease-in-out',
          }}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="text-rose-500 flex-shrink-0" />
          )}
          <span style={{ fontSize: '0.92rem', fontWeight: 500, flex: 1 }}>
            {statusMessage.text}
          </span>
          <button
            onClick={() => setStatusMessage(null)}
            className="btn btn-sm btn-ghost"
            style={{ padding: '2px 8px' }}
          >
            ✕
          </button>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ======================================================== */}
        {/* Card 1: Profile Details Form                             */}
        {/* ======================================================== */}
        <div
          className="card"
          style={{
            padding: '28px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(37, 99, 235, 0.12)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                Personal Profile
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  margin: '3px 0 0',
                }}
              >
                Owner identity, official email address & educational credentials
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="profile-name"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: '7px',
                }}
              >
                <User size={15} style={{ color: 'var(--accent-primary)' }} />
                <span>Profile Name *</span>
              </label>
              <input
                id="profile-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Badhusha D"
                required
                className="input"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="profile-email"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: '7px',
                }}
              >
                <Mail size={15} style={{ color: 'var(--accent-primary)' }} />
                <span>Email Address *</span>
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. badhushad0@gmail.com"
                required
                className="input"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                }}
              />
            </div>

            {/* Education */}
            <div>
              <label
                htmlFor="profile-education"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: '7px',
                }}
              >
                <GraduationCap size={15} style={{ color: 'var(--accent-primary)' }} />
                <span>Education & Qualifications</span>
              </label>
              <textarea
                id="profile-education"
                rows={4}
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. Bachelor of Engineering (B.E.) in Computer Science and Engineering - Oxford Engineering College (2020 – 2024)"
                className="input"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  lineHeight: '1.5',
                  resize: 'vertical',
                }}
              />
              <span
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  color: 'var(--text-subtle)',
                  marginTop: '5px',
                }}
              >
                Specify your degree, institution name, major specialization, and graduation year.
              </span>
            </div>

            {/* Submit Button */}
            <div style={{ paddingTop: '8px' }}>
              <button
                type="submit"
                disabled={savingProfile || loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                }}
              >
                {savingProfile ? (
                  <>
                    <RefreshCw size={17} className="animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    <span>Save Profile Information</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ======================================================== */}
        {/* Card 2: CV / Resume File Upload Management              */}
        {/* ======================================================== */}
        <div
          className="card"
          style={{
            padding: '28px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                CV / Resume File
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  margin: '3px 0 0',
                }}
              >
                Automated instant update across entire portfolio
              </p>
            </div>
          </div>

          {/* Current Active CV Status Box */}
          <div
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-subtle)',
                }}
              >
                Currently Active Document
              </span>
              <span
                className="badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10b981',
                  }}
                />
                Live On Website
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              <FileCheck size={28} className="text-blue-500 flex-shrink-0" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={profile?.cv_filename || 'Badhusha_Resume.pdf'}
                >
                  {profile?.cv_filename || 'Badhusha_Resume.pdf'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {profile?.updated_at
                    ? `Last updated: ${new Date(profile.updated_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`
                    : 'Default Portfolio Document'}
                </div>
              </div>

              {/* Direct Test/Download Button */}
              <a
                href={api.getCVDownloadUrl()}
                target="_blank"
                rel="noreferrer"
                download
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  flexShrink: 0,
                }}
                title="Download this file right now to test"
              >
                <Download size={14} />
                <span>Test Download</span>
              </a>
            </div>
          </div>

          {/* Upload New CV File Box */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <label
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                }}
              >
                Upload New CV Document
              </label>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)' }}>
                PDF, DOC, DOCX up to 15MB
              </span>
            </div>

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="cv-file-upload-input"
            />

            {/* Drag & drop visual area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${
                  dragActive ? 'var(--accent-primary)' : 'var(--border-subtle)'
                }`,
                background: dragActive
                  ? 'rgba(37, 99, 235, 0.08)'
                  : 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                padding: '24px 18px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <UploadCloud
                size={34}
                style={{
                  margin: '0 auto 10px',
                  color: dragActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                }}
              />
              <p
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  margin: '0 0 4px',
                }}
              >
                {selectedFile ? selectedFile.name : 'Click to browse or drop file here'}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                {selectedFile
                  ? `Size: ${formatFileSize(selectedFile.size)} • Click to choose different file`
                  : 'Accepts PDF, DOC, or DOCX documents'}
              </p>
            </div>

            {/* Upload Action */}
            {selectedFile && (
              <div
                style={{
                  marginTop: '14px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                <button
                  type="button"
                  onClick={handleUploadCV}
                  disabled={uploadingCV}
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    padding: '11px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                  }}
                >
                  {uploadingCV ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Uploading & Updating CV...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={16} />
                      <span>Upload & Apply New CV</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '11px 14px' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Dynamic Automatic Update Callout Banner */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.22)',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
            }}
          >
            <Sparkles size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                Automatic Real-Time Website Sync
              </strong>
              When you upload a new CV, the <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Download CV</span> button on the public portfolio navbar automatically updates immediately. No manual redeployment or code edits required.
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Card 3: Admin Security & Password Change                 */}
        {/* ======================================================== */}
        <div
          className="card"
          style={{
            padding: '28px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            gridColumn: '1 / -1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(234, 179, 8, 0.12)',
                color: '#eab308',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <KeyRound size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                Admin Password & Security
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  margin: '3px 0 0',
                }}
              >
                Update your admin credentials securely. Confirm your new password to verify accuracy.
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePasswordChange}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              alignItems: 'start',
            }}
          >
            {/* Current Password (Optional verification) */}
            <div>
              <label
                htmlFor="current-password"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: '7px',
                }}
              >
                <Lock size={15} style={{ color: '#eab308' }} />
                <span>Current Password (Optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password if set"
                  className="input"
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  color: 'var(--text-subtle)',
                  marginTop: '5px',
                }}
              >
                Verify your existing administrator password
              </span>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: '7px',
                }}
              >
                <Lock size={15} style={{ color: 'var(--accent-primary)' }} />
                <span>New Password *</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  required
                  minLength={6}
                  className="input"
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  color: 'var(--text-subtle)',
                  marginTop: '5px',
                }}
              >
                Must be at least 6 characters
              </span>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: '7px',
                }}
              >
                <CheckCircle2
                  size={15}
                  style={{
                    color:
                      confirmPassword && confirmPassword === newPassword
                        ? '#10b981'
                        : 'var(--accent-primary)',
                  }}
                />
                <span>Confirm Password *</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                  className="input"
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: `1px solid ${
                      confirmPassword && confirmPassword !== newPassword
                        ? '#ef4444'
                        : confirmPassword && confirmPassword === newPassword
                        ? '#10b981'
                        : 'var(--border-subtle)'
                    }`,
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  color:
                    confirmPassword && confirmPassword !== newPassword
                      ? '#ef4444'
                      : confirmPassword && confirmPassword === newPassword
                      ? '#10b981'
                      : 'var(--text-subtle)',
                  marginTop: '5px',
                }}
              >
                {confirmPassword && confirmPassword !== newPassword
                  ? 'Passwords do not match'
                  : confirmPassword && confirmPassword === newPassword
                  ? '✓ Passwords match'
                  : 'Re-enter the new password to confirm'}
              </span>
            </div>

            {/* Action Button */}
            <div
              style={{
                gridColumn: '1 / -1',
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: '6px',
              }}
            >
              <button
                type="submit"
                disabled={updatingPassword || !newPassword || !confirmPassword}
                className="btn btn-primary"
                style={{
                  padding: '12px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  opacity: !newPassword || !confirmPassword ? 0.7 : 1,
                }}
              >
                {updatingPassword ? (
                  <>
                    <RefreshCw size={17} className="animate-spin" />
                    <span>Updating Admin Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={17} />
                    <span>Update Admin Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ProfilePage
