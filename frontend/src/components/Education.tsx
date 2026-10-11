import React from 'react'
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

export const Education: React.FC = () => {
  return (
    <section id="education" className="section relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] rounded-full pointer-events-none filter blur-[100px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #2563eb 0%, #6366f1 60%, transparent 70%)',
        }}
      />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>Education</span>
          </div>

          <h2 className="section-title">
            Academic <span className="gradient-text">Background</span>
          </h2>

          <p className="section-subtitle">
            A solid computer science foundation from Anna University-affiliated engineering institutions.
          </p>
        </div>

        {/* Education Cards Stack */}
        <div className="max-w-3xl mx-auto flex flex-col gap-7">
          {educationData.map((edu) => (
            <div
              key={edu.id}
              className="rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                padding: '28px',
              }}
            >
              {/* Unified 2-Column Layout: Left Icon + Right Structured Content */}
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
                {/* Left Milestone Icon */}
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-200"
                  style={{
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    border: '1px solid rgba(37, 99, 235, 0.2)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  {edu.icon === 'college' ? (
                    <GraduationCap className="w-6 h-6" />
                  ) : (
                    <BookOpen className="w-6 h-6" />
                  )}
                </div>

                {/* Right Content Column - Completely aligned on the same left axis */}
                <div className="flex-1 min-w-0 flex flex-col gap-3.5">
                  {/* Row 1: Degree Title & Timeline / Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <h3
                        className="text-lg sm:text-xl font-bold leading-tight"
                        style={{ color: 'var(--text-main)' }}
                      >
                        {edu.degree}
                      </h3>
                      <p
                        className="text-sm font-semibold mt-1"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        {edu.field}
                      </p>
                    </div>

                    {/* Timeline & Status Pills */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-start">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        {edu.period}
                      </span>

                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          color: '#10b981',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {edu.status}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Institution, Affiliation, Location, Grade Metadata */}
                  <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-xs sm:text-sm">
                    <span
                      className="inline-flex items-center gap-1.5 font-semibold"
                      style={{ color: 'var(--text-main)' }}
                    >
                      <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      {edu.institution}
                    </span>

                    {edu.affiliation && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: 'rgba(37, 99, 235, 0.08)',
                          border: '1px solid rgba(37, 99, 235, 0.2)',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        Affiliated to {edu.affiliation}
                      </span>
                    )}

                    <span
                      className="inline-flex items-center gap-1 text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      {edu.location}
                    </span>

                    {edu.grade && (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          color: '#10b981',
                        }}
                      >
                        <Award className="w-3.5 h-3.5" />
                        {edu.grade}
                      </span>
                    )}
                  </div>

                  {/* Row 3: Narrative Description */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {edu.description}
                  </p>

                  {/* Row 4: Core Coursework & Key Focus Areas */}
                  <div
                    className="pt-3.5 mt-1"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                  >
                    <p
                      className="text-[11px] font-semibold uppercase tracking-wider mb-2.5"
                      style={{ color: 'var(--text-subtle)' }}
                    >
                      Key Coursework & Competencies
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {edu.coursework.map((course) => (
                        <span
                          key={course}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg transition-colors"
                          style={{
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 opacity-80 flex-shrink-0" />
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Education
