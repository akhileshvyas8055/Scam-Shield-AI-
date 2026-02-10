import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/SafeInternshipSlideshow.css'

const API_URL = 'http://localhost:5000/api'

function SafeInternshipSlideshow() {
  const [internships, setInternships] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    fetchInternships()
  }, [])

  useEffect(() => {
    if (internships.length === 0 || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % internships.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [internships.length, isPaused])

  const fetchInternships = async () => {
    try {
      const response = await axios.get(`${API_URL}/safe-internships`)
      setInternships(response.data)
    } catch (error) {
      console.error('Error fetching internships:', error)
    }
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (internships.length === 0) return null

  const visibleInternships = internships.slice(currentIndex, currentIndex + 3)
  if (visibleInternships.length < 3) {
    visibleInternships.push(...internships.slice(0, 3 - visibleInternships.length))
  }

  return (
    <div className="slideshow-section">
      <h2 className="slideshow-title">
        🖼️ AI-Verified Safe Internships & Training Programs
      </h2>
      
      <div 
        className="slideshow-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="slides-wrapper">
          {visibleInternships.map((internship, idx) => (
            <div key={internship.id} className="slide-card">
              <div className="slide-image">
                <img src={internship.image_url} alt={internship.title} />
                <div className="safety-badge" title="Verified using AI + crowd intelligence">
                  🟢 {internship.status}
                </div>
              </div>
              
              <div className="slide-content">
                <h3>{internship.title}</h3>
                <p className="company">🏢 {internship.company}</p>
                <p className="domain">💼 {internship.domain}</p>
                
                <div className="slide-details">
                  <span>⏱️ {internship.duration}</span>
                  <span>💰 {internship.stipend}</span>
                </div>
                
                <p className="start-date">📅 Starts: {internship.start_date}</p>
                
                <a 
                  href={internship.apply_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-apply"
                >
                  Apply Now →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="slide-indicators">
          {internships.map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SafeInternshipSlideshow
