import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import ScamAnalyzer from '../components/ScamAnalyzer'
import SafeInternshipSlideshow from '../components/SafeInternshipSlideshow'
import { UserContext } from '../context/UserContext'
import '../styles/HomePage.css'

const API_URL = 'http://localhost:5000/api'

function HomePage() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [showReport, setShowReport] = useState(false)
  const { userId, refreshUser } = useContext(UserContext)

  const handleAnalysis = async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        ...formData,
        user_id: userId
      })
      setAnalysisResult(response.data)
      setShowReport(true)
      refreshUser() // Update credits in navbar
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Error analyzing offer. Please try again.')
    }
  }

  const handleReport = async (reportData) => {
    try {
      await axios.post(`${API_URL}/report`, reportData)
      alert('Thank you for reporting! Our team will verify this.')
      setShowReport(false)
    } catch (error) {
      console.error('Report error:', error)
      alert('Error submitting report. Please try again.')
    }
  }

  return (
    <div className="home-page">
      <section className="hero">
        <h1>
          <img src="/hero-logo.png" alt="Scam Shield" className="hero-logo" />
          AI-Based Fake Internship & Training Scam Detector By Team AIRWAVE
        </h1>
        <p className="hero-subtitle">
          Protecting thousands of students from fake internship scams using AI-powered detection
        </p>
      </section>

      <ScamAnalyzer
        onAnalyze={handleAnalysis}
        result={analysisResult}
        showReport={showReport}
        onReport={handleReport}
      />

      {analysisResult && (
        <>
          <SafeInternshipSlideshow />

          <div className="impact-statement">
            <p>
              💡 Our platform not only protects students from fake internships but also
              proactively recommends verified and safe opportunities using AI.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage
