import re
from datetime import datetime
from urllib.parse import urlparse

class ScamDetector:
    def __init__(self):
        self.scam_keywords = [
            'urgent', 'limited seats', 'hurry', 'act now', 'guaranteed',
            'easy money', 'no experience', 'work from home', 'registration fee',
            'certificate fee', 'refundable', 'deposit', 'processing fee'
        ]
        
        self.suspicious_domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']
    
    def analyze(self, offer_data):
        score = 0
        reasons = []
        
        # Text analysis
        text_score, text_reasons = self._analyze_text(offer_data.get('offer_text', ''))
        score += text_score
        reasons.extend(text_reasons)
        
        # Email analysis
        email_score, email_reasons = self._analyze_email(offer_data.get('email', ''))
        score += email_score
        reasons.extend(email_reasons)
        
        # Website analysis
        website_score, website_reasons = self._analyze_website(offer_data.get('website', ''))
        score += website_score
        reasons.extend(website_reasons)
        
        # Stipend analysis
        stipend_score, stipend_reasons = self._analyze_stipend(offer_data.get('stipend', ''))
        score += stipend_score
        reasons.extend(stipend_reasons)
        
        # Fees analysis
        if offer_data.get('fees_required', False):
            score += 30
            reasons.append('Requires registration or certificate fees (major red flag)')
        
        # Cap score at 100
        score = min(score, 100)
        
        # Determine verdict
        if score < 30:
            verdict = 'Safe'
            color = 'green'
        elif score < 60:
            verdict = 'Suspicious'
            color = 'yellow'
        else:
            verdict = 'Highly Fake'
            color = 'red'
        
        return {
            'scam_score': score,
            'verdict': verdict,
            'color': color,
            'reasons': reasons,
            'recommendation': self._get_recommendation(score)
        }
    
    def _analyze_text(self, text):
        score = 0
        reasons = []
        text_lower = text.lower()
        
        found_keywords = [kw for kw in self.scam_keywords if kw in text_lower]
        if found_keywords:
            keyword_score = min(len(found_keywords) * 8, 40)
            score += keyword_score
            reasons.append(f'Contains suspicious keywords: {", ".join(found_keywords[:3])}')
        
        if len(text) < 50:
            score += 10
            reasons.append('Offer description is too brief')
        
        return score, reasons
    
    def _analyze_email(self, email):
        score = 0
        reasons = []
        
        if not email:
            return 0, []
        
        domain = email.split('@')[-1] if '@' in email else ''
        
        if domain in self.suspicious_domains:
            score += 25
            reasons.append(f'Uses free email domain ({domain}) instead of company domain')
        
        return score, reasons
    
    def _analyze_website(self, website):
        score = 0
        reasons = []
        
        if not website:
            score += 15
            reasons.append('No official website provided')
            return score, reasons
        
        # Check for suspicious patterns
        if not website.startswith(('http://', 'https://')):
            website = 'https://' + website
        
        try:
            parsed = urlparse(website)
            domain = parsed.netloc
            
            # Check for suspicious TLDs
            if any(tld in domain for tld in ['.tk', '.ml', '.ga', '.cf', '.gq']):
                score += 20
                reasons.append('Uses suspicious free domain extension')
            
            # Check for IP address
            if re.match(r'\d+\.\d+\.\d+\.\d+', domain):
                score += 25
                reasons.append('Website is an IP address (not a proper domain)')
        except:
            score += 15
            reasons.append('Invalid website URL format')
        
        return score, reasons
    
    def _analyze_stipend(self, stipend):
        score = 0
        reasons = []
        
        if not stipend:
            return 0, []
        
        # Extract numbers from stipend
        numbers = re.findall(r'\d+', stipend)
        if numbers:
            amount = int(numbers[0])
            
            # Unrealistic stipend amounts
            if amount > 50000:
                score += 20
                reasons.append(f'Unrealistic stipend amount (₹{amount:,})')
            elif amount > 30000:
                score += 10
                reasons.append(f'Suspiciously high stipend (₹{amount:,})')
        
        return score, reasons
    
    def _get_recommendation(self, score):
        if score < 30:
            return 'This offer appears legitimate. However, always verify through official channels.'
        elif score < 60:
            return 'Exercise caution. Verify company details and avoid paying any fees.'
        else:
            return 'High risk of scam. Do not proceed or share personal information.'
