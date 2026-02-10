import React, { useState, useRef, useEffect } from 'react'
import '../styles/DoremonChatbot.css'

function DoremonChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'doremon',
            text: "Hi! I'm Doremon! 🤖 I can help you spot fake internships. Ask me anything!"
        }
    ])
    const [inputText, setInputText] = useState('')
    const messagesEndRef = useRef(null)

    // Dragging state removed
    const chatbotRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const faqs = [
        { question: "What is this platform?", answer: "This is an AI-based platform that helps students identify fake or risky internship and training offers." },
        { question: "Who can use this app?", answer: "Students, freshers, and anyone looking for internships or training opportunities." },
        { question: "Is this platform free to use?", answer: "Yes, basic scam detection and verification features are free." },
        { question: "How does this app work?", answer: "The app uses AI to analyze company details, websites, emails, offer patterns, and user reports." },
        { question: "How can I check if an internship is fake or real?", answer: "Enter the company name, website, email, or offer details and run the scam check." },
        { question: "How does AI detect fake internships?", answer: "It analyzes past scam data, suspicious keywords, fake domains, payment requests, and user reports." },
        { question: "Are all internships verified?", answer: "No, only trusted and manually reviewed opportunities are marked as verified." },
        { question: "Is a verified company completely safe?", answer: "Verified companies are generally safe, but students should always stay cautious." },
        { question: "What are common signs of fake internships?", answer: "Requests for fees, personal emails, guaranteed placement claims, no official website, and urgency messages." },
        { question: "Can new or unknown companies be checked?", answer: "Yes, new companies can also be analyzed using AI risk assessment." },
        { question: "Is the AI 100% accurate?", answer: "AI provides high accuracy, but final judgment should always be made by the user." },
        { question: "What should I do if I find a suspicious internship?", answer: "You can report the company using the report feature." },
        { question: "What happens after I report a company?", answer: "The report appears on the admin dashboard for review and action." },
        { question: "Is my identity safe when I report a company?", answer: "Yes, all reports are confidential and secure." },
        { question: "Can multiple users report the same company?", answer: "Yes, multiple reports increase the risk level of the company." },
        { question: "How are verified companies selected?", answer: "They are selected through admin verification, trusted sources, and user feedback." },
        { question: "Can I apply directly to verified companies?", answer: "Yes, verified companies provide direct application links." },
        { question: "Is the verified companies list updated regularly?", answer: "Yes, the list is updated frequently." },
        { question: "Do I need to create an account to use this app?", answer: "Account creation is optional, but required for reporting companies." },
        { question: "Is technical knowledge required to use this app?", answer: "No, the app is designed to be simple and user-friendly." },
        { question: "Is this a government-approved platform?", answer: "This is a student-focused innovation created to improve awareness and safety." },
        { question: "Does the app store my personal data?", answer: "Only necessary data is stored, and it is kept secure." },
        { question: "How can I give feedback or suggestions?", answer: "You can share feedback using the feedback or report section." },
        { question: "Will new features be added in the future?", answer: "Yes, features like real-time alerts, company ratings, and reviews are planned." },
        { question: "How does this app help students?", answer: "It protects students from scams and provides trusted internship opportunities." }
    ]

    const handleSend = (text = inputText) => {
        if (!text.trim()) return

        // Add user message
        const userMsg = { id: Date.now(), sender: 'user', text }
        setMessages(prev => [...prev, userMsg])
        setInputText('')

        // Simulate bot response
        setTimeout(() => {
            let botResponse = "I'm not sure about that... try asking one of the questions below! 🤔"

            const lowerText = text.toLowerCase()

            // Greetings
            if (lowerText.match(/^(hi|hello|hey|greetings)/)) {
                botResponse = "Hello! 👋 I'm Doremon, your scam detection assistant. Type 'help' to see questions!"
            }
            // Gratitude
            else if (lowerText.match(/(thank|thanks|good|great)/)) {
                botResponse = "You’re welcome! Stay safe and choose verified opportunities. ✨"
            }
            // Help
            else if (lowerText.includes('help')) {
                botResponse = "Sure! Please share the internship or training details or pick a question below."
            }
            // Direct FAQ Matching
            else {
                // Try to find a matching FAQ based on keyword overlap
                const found = faqs.find(f => {
                    const qWords = f.question.toLowerCase().split(' ').filter(w => w.length > 3)
                    const userWords = lowerText.split(' ')
                    // Check if significant words overlap
                    return qWords.some(qw => lowerText.includes(qw)) || lowerText.includes(f.question.toLowerCase())
                })

                if (found) {
                    botResponse = found.answer
                } else {
                    // Fallback keyword detection
                    if (lowerText.includes('money') || lowerText.includes('fee') || lowerText.includes('pay'))
                        botResponse = "Requests for fees are a RED FLAG! 🚩 Legitimate companies do not ask for money."
                    else if (lowerText.includes('scam') || lowerText.includes('fake'))
                        botResponse = "Common signs include requests for fees, personal emails (@gmail), and guaranteed placement claims."
                    else if (lowerText.includes('report'))
                        botResponse = "You can report the company using the report feature below the analysis results."
                }
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'doremon', text: botResponse }])
        }, 600)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend()
    }

    const handleToggleClick = (e) => {
        setIsOpen(true)
    }

    return (
        <div
            ref={chatbotRef}
            className={`chatbot-container ${isOpen ? 'open' : ''}`}
        >
            {!isOpen && (
                <button
                    className="chatbot-toggle"
                    onClick={handleToggleClick}
                >
                    <div className="doremon-face">
                        <div className="doremon-eyes">
                            {/* Simple CSS/SVG eyes */}
                            <div className="eye left"><div className="pupil"></div></div>
                            <div className="eye right"><div className="pupil"></div></div>
                        </div>
                        <div className="doremon-nose"></div>
                        <div className="doremon-whiskers">
                            <span></span><span></span><span></span>
                        </div>
                        <div className="doremon-mouth"></div>
                    </div>
                    <div className="chat-bubble-text">Chat with me!</div>
                    <span className="tooltip">Help?</span>
                </button>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="header-info">
                            <span className="bot-avatar">🤖</span>
                            <h3>Doremon Helper</h3>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.sender}`}>
                                <div className="message-content">{msg.text}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-suggestions">
                        {faqs.map((faq, idx) => (
                            <button key={idx} onClick={() => handleSend(faq.question)}>
                                {faq.question}
                            </button>
                        ))}
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                        />
                        <button onClick={() => handleSend()}>➤</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DoremonChatbot
