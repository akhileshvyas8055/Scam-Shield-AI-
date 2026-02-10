from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS
from scam_detector import ScamDetector
from data_manager import DataManager
from resume_analyzer import ResumeAnalyzer
from user_manager import UserManager
from payment_manager import PaymentManager
import os
import uuid

app = Flask(__name__)
CORS(app)

detector = ScamDetector()
data_manager = DataManager()
resume_analyzer = ResumeAnalyzer()
user_manager = UserManager()
payment_manager = PaymentManager()
app.config['UPLOAD_FOLDER'] = payment_manager.uploads_dir

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "Scam Shield AI Backend is Running Securely",
        "version": "1.0.0"
    })

@app.route('/api/user/<user_id>/status', methods=['GET'])
def get_user_status(user_id):
    user = user_manager.get_user(user_id)
    return jsonify(user)

@app.route('/api/user/<user_id>/upgrade', methods=['POST'])
def upgrade_user(user_id):
    # Simulate payment success
    user = user_manager.activate_premium(user_id)
    return jsonify({'success': True, 'user': user})

@app.route('/api/user/<user_id>/payments', methods=['GET'])
def get_user_payments_route(user_id):
    payments = payment_manager.get_user_payments(user_id)
    return jsonify(payments)

@app.route('/api/analyze', methods=['POST'])
def analyze_offer():
    data = request.json
    user_id = data.get('user_id', 'guest')
    
    # Check credits
    has_credit = user_manager.use_scam_credit(user_id)
    
    offer_text = data.get('offer_text', '')
    email = data.get('email', '')
    website = data.get('website', '')
    stipend = data.get('stipend', '')
    fees_required = data.get('fees_required', False)
    
    result = detector.analyze({
        'offer_text': offer_text,
        'email': email,
        'website': website,
        'stipend': stipend,
        'fees_required': fees_required
    })
    
    # If no credit, lock the detailed report
    if not has_credit:
        result['is_locked'] = True
        # Mask/Limit detailed breakdown
        # Frontend uses 'reasons'
        if 'reasons' in result:
             result['reasons'] = result['reasons'][:1] # Show only 1 reason as preview
        elif 'risk_reasons' in result:
             result['risk_reasons'] = result['risk_reasons'][:1]
             
        result['explanation'] = "Upgrade to Student Safety Pass to view full detailed analysis."
        result['recommendation'] = result['explanation']
        
    return jsonify(result)

@app.route('/api/resume/analyze', methods=['POST'])
def analyze_resume():
    data = request.json
    user_id = data.get('user_id', 'guest')
    resume_text = data.get('resume_text', '')
    
    if not resume_text:
        return jsonify({'error': 'No resume text provided'}), 400
    
    # Check credits
    has_credit = user_manager.use_resume_credit(user_id)
        
    result = resume_analyzer.analyze(resume_text)
    
    # If no credit, lock the report
    if not has_credit:
        result['is_locked'] = True
        result['resume_score'] = '??'
        result['ats_score'] = '??'
        result['final_summary'] = "Upgrade to Student Safety Pass to unlock your full ATS score and detailed feedback."
        result['strengths'] = result['strengths'][:2] # Preview
        result['weaknesses'] = ["(Hidden in Free Version)"]
        result['recommended_changes'] = ["(Hidden in Free Version)"]
        result['missing_skills'] = ["(Hidden)"]
        result['scam_warnings'] = []
    
    return jsonify(result)

@app.route('/api/resume/upload', methods=['POST'])
def upload_resume_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        from PIL import Image
        import pytesseract
        import io
        
        # Set Tesseract path for Windows - Common default location
        # If not found, it will try default PATH
        import os
        if os.path.exists(r'C:\Program Files\Tesseract-OCR\tesseract.exe'):
            pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
            
        image = Image.open(io.BytesIO(file.read()))
        extracted_text = pytesseract.image_to_string(image)
        
        if not extracted_text.strip():
            return jsonify({'error': 'Could not extract text from image. Make sure the image is clear.'}), 400
            
        result = resume_analyzer.analyze(extracted_text)
        return jsonify({**result, 'extracted_text': extracted_text})
        
    except ImportError:
        return jsonify({'error': 'OCR library missing. Please install pytesseract and Pillow.'}), 500
    except Exception as e:
        if "tesseract is not installed" in str(e).lower() or "command not found" in str(e).lower():
             return jsonify({'error': 'Tesseract OCR engine not found. Please install Tesseract-OCR on your system to use this feature.'}), 500
        return jsonify({'error': str(e)}), 500

@app.route('/api/report', methods=['POST'])
def report_scam():
    data = request.json
    report = data_manager.add_report(data)
    return jsonify({'success': True, 'report_id': report['id']})

@app.route('/api/safe-internships', methods=['GET'])
def get_safe_internships():
    internships = data_manager.get_safe_internships()
    return jsonify(internships)

@app.route('/api/admin/stats', methods=['GET'])
def get_admin_stats():
    stats = data_manager.get_statistics()
    return jsonify(stats)

@app.route('/api/admin/reports', methods=['GET'])
def get_reports():
    reports = data_manager.get_all_reports()
    return jsonify(reports)

@app.route('/api/admin/reports/<report_id>/status', methods=['PUT'])
def update_report_status(report_id):
    data = request.json
    new_status = data.get('status')
    success = data_manager.update_report_status(report_id, new_status)
    if success:
        return jsonify({'success': True, 'message': 'Status updated successfully'})
    else:
        return jsonify({'success': False, 'message': 'Report not found'}), 404

@app.route('/api/admin/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    success = data_manager.delete_report(report_id)
    if success:
        return jsonify({'success': True, 'message': 'Report deleted successfully'})
    else:
        return jsonify({'success': False, 'message': 'Report not found'}), 404

@app.route('/api/payment/submit', methods=['POST'])
def submit_payment():
    if 'screenshot' not in request.files:
        return jsonify({'error': 'No screenshot uploaded'}), 400
        
    file = request.files['screenshot']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    user_id = request.form.get('user_id')
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    utr = request.form.get('utr')

    if not all([user_id, name, email, phone, utr]):
        return jsonify({'error': 'Missing required fields'}), 400
        
    if file:
        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{ext}"
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(save_path)
        
        details = {
            'name': name,
            'email': email,
            'phone': phone,
            'utr': utr
        }
        
        try:
            payment = payment_manager.create_payment(user_id, details, unique_filename)
            return jsonify({'success': True, 'payment': payment})
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
    
    return jsonify({'error': 'File upload failed'}), 500

@app.route('/api/admin/payments', methods=['GET'])
def get_payments():
    payments = payment_manager.get_all_payments()
    return jsonify(payments)

@app.route('/api/admin/payment/<payment_id>/verify', methods=['POST'])
def verify_payment_endpoint(payment_id):
    payment, verified = payment_manager.verify_payment(payment_id)
    if payment:
        if verified:
            # Activate user
            user_manager.activate_premium(payment['user_id'])
            return jsonify({'success': True, 'payment': payment, 'message': 'Payment verified and user activated'})
        else:
             return jsonify({'success': True, 'payment': payment, 'message': 'Payment already verified'})
    return jsonify({'error': 'Payment not found'}), 404

@app.route('/api/admin/payment/<payment_id>/reject', methods=['POST'])
def reject_payment_endpoint(payment_id):
    data = request.json or {}
    reason = data.get('reason', 'Rejected by admin')
    payment = payment_manager.reject_payment(payment_id, reason)
    if payment:
        return jsonify({'success': True, 'payment': payment})
    return jsonify({'error': 'Payment not found'}), 404

@app.route('/api/uploads/payment_proofs/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
