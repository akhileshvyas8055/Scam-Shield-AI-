import re

class ResumeAnalyzer:
    def __init__(self):
        self.common_skills = [
            'python', 'java', 'c++', 'javascript', 'react', 'node', 'sql', 'mysql',
            'html', 'css', 'git', 'docker', 'aws', 'cloud', 'machine learning',
            'data analysis', 'communication', 'leadership', 'teamwork'
        ]
        
        self.ats_keywords = [
            'experience', 'education', 'skills', 'projects', 'summary', 'objective',
            'certifications', 'achievements', 'technologies'
        ]

    def analyze(self, resume_text):
        text_lower = resume_text.lower()
        
        # 1. Calculate Resume Score & ATS Score
        resume_score, score_reasons = self._calculate_resume_score(text_lower)
        ats_score, ats_reasons = self._calculate_ats_score(text_lower)
        
        # 2. Identify Strengths
        strengths = self._identify_strengths(text_lower)
        
        # 3. Identify Weaknesses & Gaps
        weaknesses = self._identify_weaknesses(text_lower)
        
        # 4. Recommended Changes
        changes = self._generate_recommendations(text_lower, weaknesses)
        
        # 5. Missing Skills/Keywords
        missing_skills = self._find_missing_skills(text_lower)
        
        # 6. Safety & Scam-Risk Warnings
        scam_warnings = self._check_scam_risks(text_lower)
        
        # 7. Final Summary
        summary = self._generate_summary(resume_score, ats_score)
        
        return {
            'resume_score': resume_score,
            'ats_score': ats_score,
            'strengths': strengths,
            'weaknesses': weaknesses,
            'recommended_changes': changes,
            'missing_skills': missing_skills,
            'scam_warnings': scam_warnings,
            'final_summary': summary
        }

    def _calculate_resume_score(self, text):
        score = 50  # Base score
        reasons = []
        
        # Length check
        words = len(text.split())
        if 200 <= words <= 600:
            score += 10
        elif words < 200:
            score -= 10
            reasons.append("Resume is too short")
        else:
            score -= 5
            reasons.append("Resume might be too long")
            
        # Structure check
        sections = ['education', 'skills', 'projects']
        for section in sections:
            if section in text:
                score += 10
            else:
                score -= 5
                reasons.append(f"Missing {section} section")
                
        # Quantifiable achievements check
        if re.search(r'\d+%', text) or re.search(r'\d+\s*\+', text):
            score += 10
            
        return min(100, max(0, score)), reasons

    def _calculate_ats_score(self, text):
        score = 40
        reasons = []
        
        found_keywords = [kw for kw in self.ats_keywords if kw in text]
        score += len(found_keywords) * 5
        
        return min(100, max(0, score)), []

    def _identify_strengths(self, text):
        strengths = []
        if len(text.split()) > 200:
            strengths.append("Good content length")
        
        found_skills = [s for s in self.common_skills if s in text]
        if len(found_skills) >= 5:
            strengths.append(f"Strong technical vocabulary ({len(found_skills)}+ skills detected)")
            
        if 'project' in text:
            strengths.append("Includes project section")
            
        if re.search(r'\d+%', text):
            strengths.append("Uses quantifiable metrics (numbers/percentages)")
            
        if not strengths:
            strengths.append("Clear and readable structure")
            
        return strengths

    def _identify_weaknesses(self, text):
        weaknesses = []
        if len(text.split()) < 200:
            weaknesses.append("Content is too brief")
            
        if 'linkedin' not in text and 'github' not in text:
            weaknesses.append("Missing professional links (LinkedIn/GitHub)")
            
        if 'education' not in text:
            weaknesses.append("Education section is not clearly defined")
            
        if not re.search(r'\b(led|managed|developed|created|designed)\b', text):
            weaknesses.append("Lack of strong action verbs")
            
        return weaknesses

    def _generate_recommendations(self, text, weaknesses):
        recommendations = []
        for weak in weaknesses:
            if "brief" in weak:
                recommendations.append("Expand on your project descriptions and roles.")
            if "links" in weak:
                recommendations.append("Add links to your LinkedIn profile and GitHub portfolio.")
            if "Education" in weak:
                recommendations.append("Create a dedicated 'Education' section.")
            if "action verbs" in weak:
                recommendations.append("Use strong action verbs like 'Developed', 'Led', 'Optimized' to start bullet points.")
                
        if not recommendations:
            recommendations.append("Review formatting to ensure consistent font sizes and spacing.")
            recommendations.append("Tailor your objective to the specific job role.")
            
        return recommendations

    def _find_missing_skills(self, text):
        missing = [skill for skill in self.common_skills if skill not in text]
        # Return random 5 missing skills to suggest
        return missing[:5] if missing else ["Communication", "Leadership"]

    def _check_scam_risks(self, text):
        risks = []
        if re.search(r'\b(passport|driving license|aadhar|pan card)\b', text):
            risks.append("Remove sensitive ID numbers or details (Passport/Aadhar/PAN).")
            
        if re.search(r'\b(date of birth|dob|marital status|religion)\b', text):
            risks.append("Remove personal details like Date of Birth, Marital Status, or Religion. They are not required.")
            
        if re.search(r'\b(father|mother)\b', text):
            risks.append("Remove parents' names. This is unnecessary personal information.")
            
        if re.search(r'\b(house no|flat no)\b', text):
            risks.append("Avoid sharing your full home address. City and State are sufficient.")
            
        return risks

    def _generate_summary(self, score, ats_score):
        if score >= 80:
            return "This provides a strong foundation! Focus on tailoring the resume to specific job descriptions to maximize impact."
        elif score >= 60:
            return "Good start, but needs refinement. Focus on adding more quantifiable achievements and improving the layout."
        else:
            return "Needs significant improvement. Structure your resume with clear headings and focus on highlighting your skills and projects."
