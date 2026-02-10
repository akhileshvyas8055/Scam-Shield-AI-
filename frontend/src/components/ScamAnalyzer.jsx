import React, { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { Link } from 'react-router-dom'
import '../styles/ScamAnalyzer.css'

function ScamAnalyzer({ onAnalyze, result, showReport, onReport }) {
  // ... existing code ...

  // Insert LockedOverlay definition
  const LockedOverlay = () => (
    <div className="locked-overlay">
      <div className="locked-message">
        <h3>🔒 Premium Features Locked</h3>
        <p>Upgrade to Student Safety Pass to see full detailed reasons and verified status.</p>
        <Link to="/membership" className="upgrade-btn-small">Unlock Full Report - ₹50</Link>
      </div>
    </div>
  )



  const [formData, setFormData] = useState({
    offer_text: '',
    email: '',
    website: '',
    stipend: '',
    fees_required: false
  })

  const [reportData, setReportData] = useState({
    company_name: '',
    description: '',
    contact_info: ''
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAnalyze(formData)
  }

  const handleReportSubmit = (e) => {
    e.preventDefault()
    onReport({
      ...reportData,
      scam_score: result?.scam_score,
      original_offer: formData
    })
  }

  const getVerdictClass = (color) => {
    return `verdict-${color}`
  }

  const resultRef = useRef(null)

  const downloadReport = async (format) => {
    if (!resultRef.current) {
      alert('Please wait for the analysis to complete.')
      return
    }

    try {
      // Show loading state
      const buttons = document.querySelectorAll('.btn-download')
      buttons.forEach(btn => btn.disabled = true)
      buttons.forEach(btn => btn.textContent = '⏳ Generating...')

      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      })

      // Convert to blob for better browser compatibility
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
        link.download = `scam-analysis-report-${timestamp}.${format}`
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        // Reset button state
        buttons.forEach((btn, idx) => {
          btn.disabled = false
          btn.textContent = idx === 0 ? '📥 Download as PNG' : '📥 Download as JPG'
        })
      }, `image/${format}`)

    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to download report. Please try again.')

      // Reset button state on error
      const buttons = document.querySelectorAll('.btn-download')
      buttons.forEach((btn, idx) => {
        btn.disabled = false
        btn.textContent = idx === 0 ? '📥 Download as PNG' : '📥 Download as JPG'
      })
    }
  }


  return (
    <div className="analyzer-container">
      <div className="analyzer-card">
        <h2>🔍 Analyze Internship Offer</h2>

        <form onSubmit={handleSubmit} className="analyzer-form">
          <div className="form-group">
            <label>Offer Letter / Description *</label>
            <textarea
              name="offer_text"
              value={formData.offer_text}
              onChange={handleChange}
              placeholder="Paste the internship offer text here..."
              rows="6"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@company.com"
              />
            </div>

            <div className="form-group">
              <label>Company Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://company.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Stipend Amount</label>
              <input
                type="text"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="e.g., ₹15,000/month or Free"
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="fees_required"
                  checked={formData.fees_required}
                  onChange={handleChange}
                />
                Requires registration/certificate fees
              </label>
            </div>
          </div>

          <button type="submit" className="btn-analyze">
            Analyze Now
          </button>
        </form>
      </div>

      {result && (
        <div ref={resultRef} className={`result-card ${getVerdictClass(result.color)}`}>
          <div className="result-header">
            <h2>📊 Analysis Result</h2>
            <div className="scam-score">
              <div className="score-circle">
                <span className="score-number">{result.scam_score}%</span>
              </div>
              <div className="verdict">
                <span className={`verdict-badge ${result.color}`}>
                  {result.verdict === 'Safe' && '🟢'}
                  {result.verdict === 'Suspicious' && '🟡'}
                  {result.verdict === 'Highly Fake' && '🔴'}
                  {' '}{result.verdict}
                </span>
              </div>
            </div>
          </div>

          <div className="download-section">
            <button onClick={() => downloadReport('png')} className="btn-download">
              📥 Download as PNG
            </button>
            <button onClick={() => downloadReport('jpeg')} className="btn-download">
              📥 Download as JPG
            </button>
          </div>

          <div className="result-body">
            <div className="analyzed-details">
              <h3>📋 Analyzed Details:</h3>
              <div className="details-grid">
                {formData.email && (
                  <div className="detail-item">
                    <strong>Email:</strong>
                    <span>{formData.email}</span>
                  </div>
                )}
                {formData.website && (
                  <div className="detail-item">
                    <strong>Website:</strong>
                    <span>{formData.website}</span>
                  </div>
                )}
                {formData.stipend && (
                  <div className="detail-item">
                    <strong>Stipend:</strong>
                    <span>{formData.stipend}</span>
                  </div>
                )}
                {formData.fees_required && (
                  <div className="detail-item warning">
                    <strong>⚠️ Fees Required:</strong>
                    <span>Yes (Red Flag!)</span>
                  </div>
                )}
                {formData.offer_text && (
                  <div className="detail-item full-width">
                    <strong>Offer Description:</strong>
                    <span>{formData.offer_text}</span>
                  </div>
                )}
              </div>
            </div>

            {result.is_locked && <LockedOverlay />}

            <h3>🧠 AI Analysis Reasons:</h3>
            <ul className="reasons-list">
              {result.reasons && result.reasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>

            <div className="recommendation">
              <strong>💡 Our Recommendation:</strong>
              <p>{result.recommendation}</p>
            </div>

            {showReport && !result.is_locked && result.scam_score > 50 && (
              <div className="report-section">
                <h3>📢 Report This Scam</h3>
                <form onSubmit={handleReportSubmit} className="report-form">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={reportData.company_name}
                    onChange={(e) => setReportData({ ...reportData, company_name: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Additional details about the scam..."
                    value={reportData.description}
                    onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                    rows="3"
                  />
                  <input
                    type="text"
                    placeholder="Contact info (if any)"
                    value={reportData.contact_info}
                    onChange={(e) => setReportData({ ...reportData, contact_info: e.target.value })}
                  />
                  <button type="submit" className="btn-report">
                    Submit Report
                  </button>
                </form>
              </div>
            )}

            {showReport && result.is_locked && (
              <div className="report-section locked-report">
                <p>Unlock to report this scam to authorities.</p>
                <Link to="/membership" className="upgrade-btn-small" style={{ marginTop: '1rem' }}>Unlock Now</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ScamAnalyzer
