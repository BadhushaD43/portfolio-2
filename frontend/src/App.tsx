import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

// 5 Dedicated Page Views
import { Home } from './pages/Home'
import { AboutPage } from './pages/AboutPage'
import { SkillsPage } from './pages/SkillsPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ContactPage } from './pages/ContactPage'

import { ProjectDetail } from './pages/ProjectDetail'
import { AdminLogin } from './pages/AdminLogin'
import { DashboardPage } from './pages/admin/DashboardPage'
import { BusinessMessagesPage } from './pages/admin/BusinessMessagesPage'
import { SocialConnectPage } from './pages/admin/SocialConnectPage'
import { AdminProjectsPage } from './pages/admin/ProjectsPage'
import { ProfilePage } from './pages/admin/ProfilePage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('portfolio_theme')
    return (saved === 'light' ? 'light' : 'dark') as 'dark' | 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
    document.body.setAttribute('data-theme', theme)
    document.body.className = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      localStorage.setItem('portfolio_theme', next)
      return next
    })
  }

  return (
    <div data-theme={theme} className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#090d16] text-[#f8fafc]' : 'bg-[#f8fafc] text-[#0f172a]'}`}>
      <ScrollToTop />

      {/* Navbar shown on all non-admin pages */}
      {!isAdminRoute && (
        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Main Page Routing */}
      <div className="flex-1">
        <Routes>
          {/* 5 Distinct Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Project Details */}
          <Route path="/projects/:slug" element={<ProjectDetail />} />

          {/* Admin Login Route */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Admin Protected Routes with Left Sidebar Layout */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/business-messages"
            element={
              <ProtectedRoute>
                <BusinessMessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/social-connect"
            element={
              <ProtectedRoute>
                <SocialConnectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <AdminProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div
                style={{
                  minHeight: '80vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  paddingTop: 'var(--header-height)',
                }}
              >
                <span style={{ fontSize: '4rem' }}>🔍</span>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Page Not Found</h1>
                <p style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">← Back to Portfolio</a>
              </div>
            }
          />
        </Routes>
      </div>

      {/* Footer appears at the end of each page */}
      {!isAdminRoute && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
