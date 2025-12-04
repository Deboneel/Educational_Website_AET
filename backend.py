#!/usr/bin/env python3
"""
EduHub Python Backend - Separate File
Save this as backend.py in the same folder
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
import string
import sys
import os
from datetime import datetime
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS

print("=" * 60)
print("🚀 EduHub Python Backend Starting...")
print("=" * 60)

try:
    app = Flask(__name__)
    CORS(app)
    print("✅ Flask app created")
except ImportError as e:
    print(f"❌ Import Error: {e}")
    print("Run: pip install flask flask-cors")
    sys.exit(1)

# Initialize database
def init_db():
    try:
        conn = sqlite3.connect('eduhub_users.db', check_same_thread=False)
        c = conn.cursor()
        
        c.execute('''CREATE TABLE IF NOT EXISTS users
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      user_id TEXT UNIQUE NOT NULL,
                      full_name TEXT,
                      nickname TEXT NOT NULL,
                      reg_no TEXT,
                      college TEXT,
                      department TEXT,
                      email TEXT,
                      password_hash TEXT NOT NULL,
                      hometown TEXT,
                      hall_name TEXT,
                      supervisor TEXT,
                      phone TEXT,
                      registration_date TIMESTAMP NOT NULL)''')
        
        # Add admin user
        c.execute("SELECT * FROM users WHERE user_id='2105056'")
        if not c.fetchone():
            c.execute('''INSERT INTO users 
                         (user_id, full_name, nickname, reg_no, college, department, 
                          password_hash, registration_date)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                      ('2105056', 'Admin User', 'Admin', 'ADMIN001',
                       'System Administration', 'ADMIN', 'sotorupa72', datetime.now()))
        
        conn.commit()
        conn.close()
        print("✅ Database initialized")
    except Exception as e:
        print(f"❌ Database error: {e}")

init_db()

@app.route('/')
def home():
    return jsonify({"message": "EduHub Backend is running", "status": "healthy"})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'EduHub Backend',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        conn = sqlite3.connect('eduhub_users.db', check_same_thread=False)
        c = conn.cursor()
        c.execute("SELECT COUNT(*) FROM users WHERE user_id != '2105056'")
        total_users = c.fetchone()[0]
        
        today = datetime.now().strftime('%Y-%m-%d')
        c.execute("SELECT COUNT(*) FROM users WHERE DATE(registration_date) = ? AND user_id != '2105056'", 
                  (today,))
        today_users = c.fetchone()[0]
        conn.close()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_users': total_users,
                'today_users': today_users,
                'active_now': max(1, total_users // 10),
                'timestamp': datetime.now().isoformat()
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        user_id = str(data.get('id', '')).strip()
        
        if not user_id or not data.get('password'):
            return jsonify({'success': False, 'error': 'ID and password required'}), 400
        
        conn = sqlite3.connect('eduhub_users.db', check_same_thread=False)
        c = conn.cursor()
        
        c.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        if c.fetchone():
            conn.close()
            return jsonify({'success': False, 'error': 'User ID already exists'}), 400
        
        department = data.get('department', '')
        if department == 'Others':
            department = data.get('otherDepartment', 'Unknown')
        
        c.execute('''INSERT INTO users 
                     (user_id, full_name, nickname, reg_no, college, department, 
                      email, password_hash, hometown, hall_name, supervisor, phone, registration_date)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                  (user_id,
                   data.get('fullName', '').strip(),
                   data.get('nickname', 'User').strip(),
                   data.get('regNo', '').strip(),
                   data.get('college', '').strip(),
                   department.strip(),
                   data.get('email', '').strip(),
                   data['password'],
                   data.get('hometown', '').strip(),
                   data.get('hallName', '').strip(),
                   data.get('supervisor', '').strip(),
                   data.get('phone', '').strip(),
                   datetime.now()))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user': {'id': user_id, 'nickname': data.get('nickname', 'User'), 'department': department}
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        username = str(data.get('username', '')).strip()
        password = str(data.get('password', '')).strip()
        
        if username == '2105056' and password == 'sotorupa72':
            return jsonify({
                'success': True,
                'is_admin': True,
                'nickname': 'Admin',
                'department': 'ADMIN'
            })
        
        conn = sqlite3.connect('eduhub_users.db', check_same_thread=False)
        c = conn.cursor()
        c.execute('''SELECT user_id, nickname, department FROM users 
                     WHERE user_id=? AND password_hash=?''', (username, password))
        
        user = c.fetchone()
        conn.close()
        
        if user:
            return jsonify({
                'success': True,
                'is_admin': False,
                'nickname': user[1],
                'department': user[2]
            })
        else:
            return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        conn = sqlite3.connect('eduhub_users.db', check_same_thread=False)
        c = conn.cursor()
        c.execute('''SELECT user_id, full_name, nickname, college, department, 
                            registration_date FROM users 
                     WHERE user_id != '2105056' ORDER BY registration_date DESC''')
        
        users = []
        for row in c.fetchall():
            users.append({
                'id': row[0],
                'full_name': row[1] or 'Not provided',
                'nickname': row[2] or 'User',
                'college': row[3] or 'Not provided',
                'department': row[4] or 'Not specified',
                'registration_date': row[5].isoformat() if hasattr(row[5], 'isoformat') else str(row[5])
            })
        
        conn.close()
        return jsonify({'success': True, 'users': users, 'total': len(users)})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/export-users', methods=['GET'])
def export_users():
    try:
        conn = sqlite3.connect('eduhub_users.db', check_same_thread=False)
        c = conn.cursor()
        c.execute('''SELECT user_id, full_name, nickname, reg_no, college, department, 
                            email, hometown, hall_name, supervisor, phone, registration_date 
                     FROM users WHERE user_id != '2105056' ORDER BY registration_date DESC''')
        
        import csv
        from io import StringIO
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Full Name', 'Nickname', 'Registration No', 'College', 
                         'Department', 'Email', 'Hometown', 'Hall Name', 'Supervisor', 
                         'Phone', 'Registration Date'])
        
        for row in c.fetchall():
            writer.writerow([str(cell) if cell is not None else '' for cell in row])
        
        conn.close()
        
        return jsonify({
            'success': True,
            'csv': output.getvalue(),
            'filename': f'eduhub_users_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🌐 Starting server on http://localhost:5000")
    print("👤 Admin: ID=2105056, Password=sotorupa72")
    print("=" * 60 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000) 
def generate_temp_password():
    """Generate a temporary password"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(8))

class EmailService:
    def __init__(self):
        self.sender_email = "deboneel1998@gmail.com"  # Your email
        self.sender_password = "your_app_password"  # Your app password
    
    def send_recovery_email(self, to_email, user_id, temp_password):
        """Send password recovery email"""
        try:
            msg = MIMEMultipart()
            msg['Subject'] = '🔑 EduHub Password Recovery'
            msg['From'] = f'EduHub Support <{self.sender_email}>'
            msg['To'] = to_email
            
            html = f"""
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #ff7eb3;">EduHub Password Recovery</h2>
                <p>Your account recovery request has been processed.</p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>User ID:</strong> {user_id}</p>
                    <p><strong>Temporary Password:</strong> <code style="background: #e0e0e0; padding: 5px; border-radius: 3px;">{temp_password}</code></p>
                </div>
                <p>Please login with these credentials and change your password immediately.</p>
                <p style="color: #666; font-size: 12px;">This is an automated message. Do not reply.</p>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(html, 'html'))
            
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(msg)
            
            return True
        except Exception as e:
            print(f"Email error: {e}")
            return False

# Initialize email service
email_service = EmailService()