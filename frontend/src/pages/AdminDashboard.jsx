import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/AdminDashboard.css'

const API_URL = 'http://localhost:5000/api'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState([])
  const [payments, setPayments] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'akhileshvyas8055') {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password! Access denied. 🚫')
    }
  }

  const fetchData = async () => {
    try {
      const [statsRes, reportsRes, paymentsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`),
        axios.get(`${API_URL}/admin/reports`),
        axios.get(`${API_URL}/admin/payments`)
      ])
      setStats(statsRes.data)
      setReports(reportsRes.data)
      setPayments(paymentsRes.data)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
  }

  const handleVerifyPayment = async (paymentId) => {
    try {
      await axios.post(`${API_URL}/admin/payment/${paymentId}/verify`)
      alert('Payment Verified! User activated.')
      fetchData()
    } catch (error) {
      console.error("Verification failed", error)
      alert('Failed to verify payment.')
    }
  }

  const handleRejectPayment = async (paymentId) => {
    const reason = prompt("Enter Rejection Reason:", "Invalid Screenshot / UTR mismatch")
    if (reason === null) return

    try {
      await axios.post(`${API_URL}/admin/payment/${paymentId}/reject`, { reason })
      alert('Payment Rejected.')
      fetchData()
    } catch (error) {
      console.error("Rejection failed", error)
      alert('Failed to reject payment.')
    }
  }

  const handleStatusChange = async (reportId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'verified' : 'pending'

    try {
      await axios.put(`${API_URL}/admin/reports/${reportId}/status`, {
        status: newStatus
      })

      // Update local state
      setReports(reports.map(report =>
        report.id === reportId
          ? { ...report, status: newStatus }
          : report
      ))

      // Refresh stats
      const statsRes = await axios.get(`${API_URL}/admin/stats`)
      setStats(statsRes.data)

    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const handleDeleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return
    }

    try {
      await axios.delete(`${API_URL}/admin/reports/${reportId}`)

      // Update local state - remove the deleted report
      setReports(reports.filter(report => report.id !== reportId))

      // Refresh stats
      const statsRes = await axios.get(`${API_URL}/admin/stats`)
      setStats(statsRes.data)

      alert('Report deleted successfully!')

    } catch (error) {
      console.error('Error deleting report:', error)
      alert('Failed to delete report. Please try again.')
    }
  }


  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>🔒 Admin Access</h2>
          <p>Please enter the password to view sensitive data.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="password-input"
            />
            <button type="submit" className="login-btn">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (!stats) return <div className="loading">Loading dashboard data...</div>

  return (
    <div className="admin-dashboard">
      <h1>📊 Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Reports</h3>
          <p className="stat-number">{stats.total_reports}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Review</h3>
          <p className="stat-number pending">{stats.pending_reports}</p>
        </div>

        <div className="stat-card">
          <h3>Action Taken</h3>
          <p className="stat-number danger">{stats.action_taken}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>🏢 Top Fake Companies</h2>
        <div className="companies-list">
          {stats.top_fake_companies.length > 0 ? (
            stats.top_fake_companies.map((company, idx) => (
              <div key={idx} className="company-item">
                <span className="company-name">{company.name}</span>
                <span className="company-count">{company.count} reports</span>
              </div>
            ))
          ) : (
            <p className="no-data">No reports yet</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>📈 Monthly Fraud Analytics</h2>
        <div className="trend-chart">
          {stats.monthly_trend.length > 0 ? (
            stats.monthly_trend.map((item, idx) => (
              <div key={idx} className="trend-item">
                <span className="trend-month">{item.month}</span>
                <div className="trend-bar">
                  <div
                    className="trend-fill"
                    style={{ width: `${(item.count / Math.max(...stats.monthly_trend.map(t => t.count))) * 100}%` }}
                  />
                </div>
                <span className="trend-count">{item.count}</span>
              </div>
            ))
          ) : (
            <p className="no-data">No trend data available</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>📋 Recent Reports</h2>
        <div className="reports-table">
          {reports.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Company</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 10).map((report) => (
                  <tr key={report.id}>
                    <td>{new Date(report.timestamp).toLocaleDateString()}</td>
                    <td>{report.company_name}</td>
                    <td>{report.description?.substring(0, 50)}...</td>
                    <td>
                      <span className={`status-badge ${report.status}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`toggle-status-btn ${report.status}`}
                        onClick={() => handleStatusChange(report.id, report.status)}
                        title={report.status === 'pending' ? 'Mark as Verified' : 'Mark as Pending'}
                      >
                        {report.status === 'pending' ? '✓ Verify' : '↺ Reopen'}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteReport(report.id)}
                        title="Delete Report"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No reports submitted yet</p>
          )}
        </div>
      </div>
      <div className="dashboard-section">
        <h2>💰 Payment Verification</h2>
        <div className="reports-table">
          {payments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>UTR / Txn ID</th>
                  <th>Screenshot</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="user-details">
                        <strong>{payment.name}</strong><br />
                        <small>{payment.email}</small><br />
                        <small>{payment.phone}</small>
                      </div>
                    </td>
                    <td>{payment.utr}</td>
                    <td>
                      <a
                        href={`${API_URL}/uploads/payment_proofs/${payment.screenshot_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="screenshot-link"
                      >
                        View Proof 📎
                      </a>
                    </td>
                    <td>
                      <span className={`status-badge ${payment.status}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      {payment.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            className="verify-btn-small"
                            onClick={() => handleVerifyPayment(payment.id)}
                            title="Verify Payment"
                          >
                            ✓ Accept
                          </button>
                          <button
                            className="reject-btn-small"
                            onClick={() => handleRejectPayment(payment.id)}
                            title="Reject Payment"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      )}
                      {payment.status !== 'pending' && (
                        <span>{payment.status === 'verified' ? 'Approved' : 'Rejected'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No pending payments</p>
          )}
        </div>
      </div>

    </div>
  )
}

export default AdminDashboard
