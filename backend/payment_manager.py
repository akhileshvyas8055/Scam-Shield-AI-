import json
import os
import uuid
from datetime import datetime

class PaymentManager:
    def __init__(self, data_dir='data', uploads_dir='uploads/payment_proofs'):
        self.data_dir = data_dir
        self.uploads_dir = uploads_dir
        self.payments_file = os.path.join(data_dir, 'payments.json')
        self._ensure_data_dir()
        
    def _ensure_data_dir(self):
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
        if not os.path.exists(self.payments_file):
            with open(self.payments_file, 'w') as f:
                json.dump([], f)
        if not os.path.exists(self.uploads_dir):
            os.makedirs(self.uploads_dir)

    def _load_payments(self):
        try:
            with open(self.payments_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def _save_payments(self, payments):
        with open(self.payments_file, 'w') as f:
            json.dump(payments, f, indent=4)

    def create_payment(self, user_id, details, screenshot_filename):
        payments = self._load_payments()
        
        # Check if UTR already exists
        for p in payments:
            if p.get('utr') == details.get('utr') and p.get('status') != 'rejected':
                raise ValueError("UTR already used")

        payment = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'name': details.get('name'),
            'email': details.get('email'),
            'phone': details.get('phone'),
            'utr': details.get('utr'),
            'screenshot_path': screenshot_filename,
            'amount': 50,
            'status': 'pending',
            'created_at': datetime.now().isoformat(),
            'processed_at': None,
            'rejection_reason': None
        }
        
        payments.append(payment)
        self._save_payments(payments)
        return payment

    def get_all_payments(self):
        return self._load_payments()

    def get_user_payments(self, user_id):
        payments = self._load_payments()
        return [p for p in payments if p['user_id'] == user_id]

    def get_payment_by_id(self, payment_id):
        payments = self._load_payments()
        for p in payments:
            if p['id'] == payment_id:
                return p
        return None

    def verify_payment(self, payment_id):
        payments = self._load_payments()
        for p in payments:
            if p['id'] == payment_id:
                if p['status'] == 'verified':
                    return p, False # Already verified
                
                p['status'] = 'verified'
                p['processed_at'] = datetime.now().isoformat()
                self._save_payments(payments)
                return p, True
        return None, False

    def reject_payment(self, payment_id, reason):
        payments = self._load_payments()
        for p in payments:
            if p['id'] == payment_id:
                p['status'] = 'rejected'
                p['rejection_reason'] = reason
                p['processed_at'] = datetime.now().isoformat()
                self._save_payments(payments)
                return p
        return None
