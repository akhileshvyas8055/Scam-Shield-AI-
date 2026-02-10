import React, { useState, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminDashboard from './pages/AdminDashboard'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import MembershipPage from './pages/MembershipPage'
import DoremonChatbot from './components/DoremonChatbot'
import { UserContext } from './context/UserContext'
import './App.css'

function App() {
  const [theme, setTheme] = useState('default')
  const { user } = useContext(UserContext)

  const handleThemeChange = (e) => {
    setTheme(e.target.value)
  }

  return (
    <Router>
      <div className={`app theme-${theme}`}>
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <img src="/logo.png" alt="Scam Shield AI" className="logo-image" />
              <span>Scam Shield AI</span>
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/resume" className="nav-link">Resume Analyzer</Link>
              <Link to="/membership" className="nav-link membership-link">Membership</Link>
              <Link to="/admin" className="nav-link">Admin</Link>

              {user && (
                <div className="credit-badge">
                  {user.is_premium ? (
                    <span title="Scam Checks / Resume Checks Left">
                      🛡️ {user.scam_checks_left}/2 • 📄 {user.resume_checks_left}/2
                    </span>
                  ) : (
                    <Link to="/membership" className="upgrade-badge">
                      ⭐ Upgrade
                    </Link>
                  )}
                </div>
              )}

              <select
                value={theme}
                onChange={handleThemeChange}
                className="theme-selector"
              >
                <option value="default">Default</option>
                <option value="dark">Dark Mode</option>
                <option value="glass">Glass Effect</option>
                <option value="blue">Blue Tint</option>
              </select>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resume" element={<ResumeAnalyzer />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        <footer className="footer">
          <div className="footer-branding" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <img src="/team-logo.png" alt="Team Air Wave" style={{ height: '80px', borderRadius: '50%' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Team Air Wave</span>
          </div>
          <p>© 2026 Scam Shield AI | Protecting students from fake internships</p>
          <div className="footer-contact">
            <p>📞 Helpline: 8949690598 | ✉️ Email: akhileshvyas56@gmail.com</p>
          </div>
        </footer>
        <DoremonChatbot />
      </div>
    </Router>
  )
}

export default App
