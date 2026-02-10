# 🛡️ AI-Based Fake Internship & Training Scam Detector

An AI-powered full-stack web application that protects students from fake internship and training scams using NLP, behavioral pattern analysis, and crowd-verified data.

![Status](https://img.shields.io/badge/status-hackathon--ready-success)
![Python](https://img.shields.io/badge/python-3.8+-blue)
![React](https://img.shields.io/badge/react-18.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Problem Statement

Thousands of students fall victim every year to fake internship and training programs that promise certificates, stipends, and placements. These scams exploit students due to the lack of centralized verification, awareness, and intelligent detection systems.

## 💡 Solution

An AI-powered platform that:
- Analyzes internship and training offers using NLP and machine learning
- Predicts scam probability (0-100%) with explainable AI
- Recommends AI-verified safe opportunities
- Learns continuously from crowd-reported data

## ✨ Core Features

### 🔍 1. AI Scam Detection Engine
- Analyzes offer text, email domains, websites, stipends, and fees
- Outputs scam score (0-100%) with color-coded verdict:
  - 🟢 **Safe** (0-30%)
  - 🟡 **Suspicious** (30-60%)
  - 🔴 **Highly Fake** (60-100%)
- Provides explainable AI reasons for each verdict

### 🌐 2. Web Application + Chrome Extension
- Clean, modern, student-friendly interface
- Instant analysis in seconds
- Chrome extension for quick access
- Responsive design (mobile + desktop)

### 🧠 3. Crowd Intelligence
- Students can report fake offers
- Admin verification system
- AI model learns from new data continuously

### 🖼️ 4. AI-Verified Safe Internship Slideshow
- Auto-sliding carousel of verified opportunities
- Shows only internships with <20% scam score
- Each card includes: company, role, duration, stipend, start date
- 🟢 AI-Verified Safe badge with tooltip
- Direct "Apply Now" links

### 📊 5. Admin Dashboard
- Real-time scam trends and analytics
- Top fake companies ranking
- Monthly fraud statistics
- Report management system

## 🏗️ System Architecture

```
User (Student)
    ↓
Web App / Chrome Extension 
    ↓
AI Processing Layer
├─ NLP Text Analysis
├─ URL & Email Validation
├─ Pattern Matching Model
    ↓
Scam Probability Engine
    ↓
Result + Safe Recommendations
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router, Axios |
| **Backend** | Python Flask, Flask-CORS |
| **AI/ML** | Scikit-learn, NLTK, Pandas, NumPy |
| **Database** | JSON (MongoDB-ready) |
| **Extension** | Chrome Manifest V3 |
| **Hosting** | Render / Vercel / Firebase |

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### Chrome Extension Setup

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. Extension ready to use!

## 📖 Usage

### Analyze an Offer

1. Open the web app or click the extension icon
2. Paste internship offer text
3. Add optional details (email, website, stipend)
4. Click "Analyze Now"
5. View AI verdict with scam score and reasons

### Browse Safe Opportunities

1. Scroll to the slideshow section
2. View auto-sliding verified internships
3. Click "Apply Now" to visit official websites

### Report a Scam

1. After analysis, if score > 50%, report form appears
2. Fill in company name and details
3. Submit report for admin verification

### Admin Dashboard

1. Navigate to `/admin`
2. View statistics, trends, and reports
3. Monitor top fake companies
4. Track monthly fraud analytics

## 🧪 Testing

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive test cases and demo scenarios.

### Quick Test - Fake Internship

```
URGENT! Limited seats for AI Internship!
Stipend: ₹50,000/month GUARANTEED
Registration fee: ₹5,000 (Refundable)
Contact: hr.jobs@gmail.com
Website: http://192.168.1.1/apply
```

**Expected**: Scam Score 80-95%, Verdict: Highly Fake

### Quick Test - Legitimate Internship

```
Software Development Internship at TCS
Duration: 6 months
Stipend: ₹15,000/month
Contact: careers@tcs.com
Website: https://www.tcs.com/careers
```

**Expected**: Scam Score 0-20%, Verdict: Safe

## 📁 Project Structure

```
ai-scam-detector/
├── backend/                 # Python Flask API
│   ├── app.py              # Main application
│   ├── scam_detector.py    # AI detection logic
│   ├── data_manager.py     # Data handling
│   └── data/               # JSON storage
├── frontend/               # React application
│   └── src/
│       ├── components/     # React components
│       ├── pages/          # Page components
│       └── styles/         # CSS files
├── chrome-extension/       # Browser extension
│   ├── manifest.json
│   ├── popup.html
│   └── popup.js
└── docs/                   # Documentation
```

## 🎬 Demo Flow

1. **Paste fake offer** → AI returns 87% scam score
2. **Show reasons** → Free email, unrealistic stipend, new website
3. **Display slideshow** → 5 verified safe internships
4. **Test extension** → Quick browser analysis
5. **Admin dashboard** → Real-time analytics

## 🧠 AI Model Design

### Inputs
- Keyword frequency (urgent, limited, guaranteed)
- Email domain (gmail.com vs company.com)
- Website age and legitimacy
- Fees demanded (Yes/No)
- Unrealistic stipend claims

### Model
- Logistic Regression / Pattern Matching
- Fast, explainable, hackathon-friendly
- Weighted scoring system

### Output
- Scam Probability (0-100%)
- Human-readable explanation
- Actionable recommendations

## 📊 Dataset

- **Fake offers**: Telegram/WhatsApp messages, reported scams
- **Real offers**: Internshala, LinkedIn, company websites
- **Labels**: Fake = 1, Genuine = 0
- **Size**: 100-200 samples (sufficient for demo)

## 🎯 Impact Statement

> "Our platform not only protects students from fake internships but also proactively recommends verified and safe opportunities using AI."

## 🚀 Scalability

### Current
- JSON file storage
- Single-server architecture
- Local development

### Future Enhancements
- MongoDB/Firebase integration
- Mobile app (iOS/Android)
- WhatsApp bot integration
- Blockchain verification
- Multi-language support
- API for job platforms
- Machine learning with larger datasets

## 📈 Success Metrics

- Students protected from scams
- Scam detection accuracy (85-90%)
- User reports submitted
- Safe internships recommended
- Extension installations

## 🤝 Contributing

This is a hackathon project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed installation instructions
- [Testing Guide](TESTING_GUIDE.md) - Test cases and scenarios
- [Demo Script](DEMO_SCRIPT.md) - Hackathon presentation guide
- [Features](FEATURES.md) - Complete feature list
- [Hackathon Pitch](HACKATHON_PITCH.md) - Pitch deck content
- [Project Structure](PROJECT_STRUCTURE.md) - Architecture details

## 🏆 Hackathon Ready

✅ Fully functional prototype
✅ Clean, professional UI
✅ Working AI detection
✅ Chrome extension included
✅ Admin dashboard
✅ Demo-ready test cases
✅ Comprehensive documentation

## 📝 License

MIT License - Feel free to use for educational purposes

## 👥 Team

Built with ❤️ for protecting students from scams

## 🙏 Acknowledgments

- Inspired by real student experiences
- Built to solve a genuine problem
- Designed for maximum social impact

---

**Remember**: This platform is a tool to assist students. Always verify opportunities through official channels and trust your instincts!

## 📞 Support

For issues or questions:
- Check [TESTING_GUIDE.md](TESTING_GUIDE.md)
- Review [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Open an issue on GitHub

---

**Made for Hackathons | Ready to Deploy | Built to Scale**
