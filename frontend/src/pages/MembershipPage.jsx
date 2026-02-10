import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { UserContext } from '../context/UserContext'
import '../styles/MembershipPage.css'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:5000/api'

function MembershipPage() {
    const { user, loading } = useContext(UserContext)
    const [paymentStep, setPaymentStep] = useState('initial') // initial, scanning, verifying, pending, success
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        utr: ''
    })
    const [screenshot, setScreenshot] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (user?.id) {
            checkPaymentStatus()
            // Pre-fill email if available
            setFormData(prev => ({ ...prev, email: user.email || '' }))
        }
    }, [user])

    const checkPaymentStatus = async () => {
        try {
            const res = await axios.get(`${API_URL}/user/${user.id}/payments`)
            const pending = res.data.find(p => p.status === 'pending')
            if (pending) {
                setPaymentStep('pending')
            }
        } catch (error) {
            console.error("Error fetching payments", error)
        }
    }

    const handleStartPayment = () => {
        setPaymentStep('scanning')
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setScreenshot(file)
        }
    }

    const handleSubmitPayment = async () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.utr || !screenshot) {
            alert('Please fill all fields and upload screenshot.')
            return
        }

        const data = new FormData()
        data.append('user_id', user.id)
        data.append('name', formData.name)
        data.append('email', formData.email)
        data.append('phone', formData.phone)
        data.append('utr', formData.utr)
        data.append('screenshot', screenshot)

        setPaymentStep('verifying')

        try {
            await axios.post(`${API_URL}/payment/submit`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setPaymentStep('pending')
            alert('Payment submitted successfully! Waiting for admin approval.')
        } catch (error) {
            console.error("Submission failed", error)
            alert(error.response?.data?.error || 'Submission failed. Please try again.')
            setPaymentStep('scanning')
        }
    }

    if (loading) return <div className="loading">Loading user status...</div>

    return (
        <div className="membership-page">
            <header className="membership-header">
                <h1>Student Safety Pass 🛡️</h1>
                <p>Protect yourself from scams and fake internships for just ₹50.</p>
            </header>

            <div className={`plan-card ${user?.is_premium ? 'active-plan' : ''}`}>
                <div className="plan-badge">Most Popular</div>
                <h2>Standard Protection</h2>
                <div className="price">₹50 <span className="period">/ one-time</span></div>

                <ul className="benefits-list">
                    <li>✅ <strong>2 Scam Analysis Checks</strong></li>
                    <li>✅ <strong>2 AI Resume Checks</strong></li>
                    <li>✅ Full Detailed Reports</li>
                    <li>✅ Manual Admin Verification</li>
                    <li>✅ No Hidden Fees</li>
                </ul>

                {user && (
                    <div className="current-status" style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#334155' }}>Your Current Credits</h3>
                        <p className="status-text" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0f172a' }}>
                            🛡️ {user.scam_checks_left} Scam Checks <br />
                            📄 {user.resume_checks_left} Resume Checks
                        </p>
                    </div>
                )}

                <div className="payment-section">
                    {paymentStep === 'initial' && (
                        <button
                            className="upgrade-btn"
                            onClick={handleStartPayment}
                        >
                            {user?.is_premium ? 'Buy More Credits - ₹50' : 'Buy Safety Pass - ₹50'}
                        </button>
                    )}

                    {paymentStep === 'pending' && (
                        <div className="pending-status" style={{ padding: '2rem', textAlign: 'center', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #10b981' }}>
                            <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>⏳ Payment Verification Pending</h3>
                            <p>We have received your payment details.</p>
                            <p>Admin will verify your payment shortly (usually within 15 mins).</p>
                            <p>Check back later!</p>
                            <button className="cancel-btn" onClick={() => checkPaymentStatus()}>Refresh Status</button>
                        </div>
                    )}

                    {paymentStep === 'scanning' && (
                        <div className="payment-details fade-in">
                            <div className="qr-container">
                                <img src="/payment-qr.jpg" alt="Scan to Pay" className="payment-qr" />
                            </div>

                            <div className="upi-details">
                                <p>Step 1: Scan & Pay <strong>₹50</strong></p>
                                <div className="upi-id-box" onClick={() => {
                                    navigator.clipboard.writeText('8949690598@ybl')
                                    alert('UPI ID Copied!')
                                }}>
                                    <span>8949690598@ybl</span>
                                    <span className="copy-icon">📋</span>
                                </div>
                            </div>

                            <div className="verification-form">
                                <p style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '1rem' }}>Step 2: Submit Verification Details</p>

                                <input
                                    name="name" placeholder="Full Name"
                                    value={formData.name} onChange={handleChange}
                                    className="txn-input"
                                />
                                <input
                                    name="email" placeholder="Email Address"
                                    value={formData.email} onChange={handleChange}
                                    className="txn-input"
                                />
                                <input
                                    name="phone" placeholder="Phone Number"
                                    value={formData.phone} onChange={handleChange}
                                    className="txn-input"
                                />
                                <input
                                    name="utr" placeholder="Transaction ID / UTR"
                                    value={formData.utr} onChange={handleChange}
                                    className="txn-input"
                                />

                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Upload Payment Screenshot:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="txn-input"
                                    style={{ padding: '0.5rem' }}
                                />

                                <button
                                    className="verify-btn"
                                    onClick={handleSubmitPayment}
                                    style={{ marginTop: '1rem' }}
                                >
                                    Submit for Verification
                                </button>
                            </div>
                            <button className="cancel-btn" onClick={() => setPaymentStep('initial')}>Cancel</button>
                        </div>
                    )}

                    {paymentStep === 'verifying' && (
                        <div className="verifying-status">
                            <div className="spinner"></div>
                            <p>Submitting Details...</p>
                            <small>Please wait...</small>
                        </div>
                    )}
                </div>


                <p className="guarantee-text">🔒 Secure Payment via UPI / Razorpay</p>
            </div>

            <div className="faq-section">
                <h3>Why do I need this?</h3>
                <p>Scammers are becoming smarter. Our AI checks thousands of data points to verify if an internship is real or fake. This small fee helps us maintain high-quality servers and AI models to keep you safe.</p>
            </div>
        </div>
    )
}

export default MembershipPage
