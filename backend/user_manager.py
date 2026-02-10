import json
import os
import uuid

class UserManager:
    def __init__(self):
        self.users_file = 'data/users.json'
        self._ensure_data_file()
    
    def _ensure_data_file(self):
        os.makedirs('data', exist_ok=True)
        if not os.path.exists(self.users_file):
            with open(self.users_file, 'w') as f:
                json.dump({}, f)
    
    def _load_users(self):
        try:
            with open(self.users_file, 'r') as f:
                return json.load(f)
        except:
            return {}
    
    def _save_users(self, users):
        with open(self.users_file, 'w') as f:
            json.dump(users, f, indent=2)
    
    def get_user(self, user_id):
        users = self._load_users()
        if user_id not in users:
            # Create new free user
            users[user_id] = {
                'id': user_id,
                'is_premium': False,
                'scam_checks_left': 0,
                'resume_checks_left': 0,
                'total_scam_checks': 0,
                'total_resume_checks': 0
            }
            self._save_users(users)
        return users[user_id]
    
    def activate_premium(self, user_id):
        users = self._load_users()
        if user_id not in users:
            self.get_user(user_id) # create if doesn't exist
            users = self._load_users() # reload
            
        users[user_id]['is_premium'] = True
        users[user_id]['scam_checks_left'] += 2
        users[user_id]['resume_checks_left'] += 2
        
        self._save_users(users)
        return users[user_id]
        
    def use_scam_credit(self, user_id):
        users = self._load_users()
        user = users.get(user_id)
        
        if not user or user['scam_checks_left'] <= 0:
            return False
            
        user['scam_checks_left'] -= 1
        user['total_scam_checks'] += 1
        self._save_users(users)
        return True

    def use_resume_credit(self, user_id):
        users = self._load_users()
        user = users.get(user_id)
        
        if not user or user['resume_checks_left'] <= 0:
            return False
            
        user['resume_checks_left'] -= 1
        user['total_resume_checks'] += 1
        self._save_users(users)
        return True
