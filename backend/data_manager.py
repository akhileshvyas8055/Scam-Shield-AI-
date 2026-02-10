import json
import os
from datetime import datetime
import uuid

class DataManager:
    def __init__(self):
        self.reports_file = 'data/reports.json'
        self.internships_file = 'data/safe_internships.json'
        self._ensure_data_files()
    
    def _ensure_data_files(self):
        os.makedirs('data', exist_ok=True)
        
        if not os.path.exists(self.reports_file):
            with open(self.reports_file, 'w') as f:
                json.dump([], f)
        
        if not os.path.exists(self.internships_file):
            # Create sample safe internships
            sample_data = [
                {
                    "id": "1",
                    "title": "AI & Data Science Internship",
                    "company": "Infosys",
                    "domain": "Artificial Intelligence",
                    "duration": "3 Months",
                    "stipend": "Paid",
                    "start_date": "April 2026",
                    "image_url": "https://via.placeholder.com/400x200/0066cc/ffffff?text=Infosys+AI",
                    "safety_score": 14,
                    "status": "AI-Verified Safe",
                    "apply_url": "https://www.infosys.com/careers"
                },
                {
                    "id": "2",
                    "title": "Full Stack Development Training",
                    "company": "TCS",
                    "domain": "Web Development",
                    "duration": "6 Months",
                    "stipend": "₹15,000/month",
                    "start_date": "March 2026",
                    "image_url": "https://via.placeholder.com/400x200/009933/ffffff?text=TCS+Development",
                    "safety_score": 8,
                    "status": "AI-Verified Safe",
                    "apply_url": "https://www.tcs.com/careers"
                },
                {
                    "id": "3",
                    "title": "Cloud Computing Internship",
                    "company": "Wipro",
                    "domain": "Cloud & DevOps",
                    "duration": "4 Months",
                    "stipend": "₹12,000/month",
                    "start_date": "May 2026",
                    "image_url": "https://via.placeholder.com/400x200/ff6600/ffffff?text=Wipro+Cloud",
                    "safety_score": 12,
                    "status": "AI-Verified Safe",
                    "apply_url": "https://careers.wipro.com"
                },
                {
                    "id": "4",
                    "title": "Cybersecurity Training Program",
                    "company": "HCL Technologies",
                    "domain": "Cybersecurity",
                    "duration": "3 Months",
                    "stipend": "Free + Certificate",
                    "start_date": "April 2026",
                    "image_url": "https://via.placeholder.com/400x200/cc0000/ffffff?text=HCL+Security",
                    "safety_score": 18,
                    "status": "AI-Verified Safe",
                    "apply_url": "https://www.hcltech.com/careers"
                },
                {
                    "id": "5",
                    "title": "Machine Learning Internship",
                    "company": "Tech Mahindra",
                    "domain": "Machine Learning",
                    "duration": "5 Months",
                    "stipend": "₹18,000/month",
                    "start_date": "March 2026",
                    "image_url": "https://via.placeholder.com/400x200/9900cc/ffffff?text=Tech+Mahindra+ML",
                    "safety_score": 10,
                    "status": "AI-Verified Safe",
                    "apply_url": "https://www.techmahindra.com/careers"
                }
            ]
            with open(self.internships_file, 'w') as f:
                json.dump(sample_data, f, indent=2)
    
    def add_report(self, report_data):
        reports = self._load_json(self.reports_file)
        
        new_report = {
            'id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            'status': 'pending',
            **report_data
        }
        
        reports.append(new_report)
        self._save_json(self.reports_file, reports)
        
        return new_report
    
    def get_all_reports(self):
        return self._load_json(self.reports_file)
    
    def get_safe_internships(self):
        internships = self._load_json(self.internships_file)
        # Return only safe internships (score < 20)
        return [i for i in internships if i.get('safety_score', 100) < 20]
    
    def update_report_status(self, report_id, new_status):
        reports = self._load_json(self.reports_file)
        
        for report in reports:
            if report.get('id') == report_id:
                report['status'] = new_status
                report['updated_at'] = datetime.now().isoformat()
                self._save_json(self.reports_file, reports)
                return True
        
        return False
    
    def delete_report(self, report_id):
        reports = self._load_json(self.reports_file)
        
        for i, report in enumerate(reports):
            if report.get('id') == report_id:
                reports.pop(i)
                self._save_json(self.reports_file, reports)
                return True
        
        return False

    
    def get_statistics(self):
        reports = self._load_json(self.reports_file)
        
        total_reports = len(reports)
        pending_reports = len([r for r in reports if r.get('status') == 'pending'])
        action_taken = len([r for r in reports if r.get('status') == 'verified'])
        
        # Get top fake companies
        company_counts = {}
        for report in reports:
            company = report.get('company_name', 'Unknown')
            company_counts[company] = company_counts.get(company, 0) + 1
        
        top_companies = sorted(company_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return {
            'total_reports': total_reports,
            'pending_reports': pending_reports,
            'action_taken': action_taken,
            'top_fake_companies': [{'name': c[0], 'count': c[1]} for c in top_companies],
            'monthly_trend': self._get_monthly_trend(reports)
        }
    
    def _get_monthly_trend(self, reports):
        monthly = {}
        for report in reports:
            timestamp = report.get('timestamp', '')
            if timestamp:
                month = timestamp[:7]  # YYYY-MM
                monthly[month] = monthly.get(month, 0) + 1
        
        return [{'month': k, 'count': v} for k, v in sorted(monthly.items())]
    
    def _load_json(self, filepath):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except:
            return []
    
    def _save_json(self, filepath, data):
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
