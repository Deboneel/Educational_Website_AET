#!/usr/bin/env python3
"""
EduHub Python Backend - Fixed Version
Run with: python eduhub_backend_complete.py
"""

import sys
import os

print("=" * 60)
print("🚀 EduHub Python Backend Starting...")
print("=" * 60)
print(f"Working directory: {os.getcwd()}")
print(f"Python executable: {sys.executable}")

try:
    from flask import Flask, jsonify, request
    from flask_cors import CORS
    print("✅ Flask modules imported successfully")
except ImportError as e:
    print(f"❌ Import Error: {e}")
    print("\n💡 Try installing with:")
    print('python -m pip install flask flask-cors')
    sys.exit(1)

from datetime import datetime
import sqlite3

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

print("✅ Flask app created")

# ==================== DATABASE FUNCTIONS ====================
def init_db():
    """Initialize database"""
    try:
        # Delete existing database to start fresh
        if os.path.exists('eduhub_users.db'):
            os.remove('eduhub_users.db')
            print("🗑️ Old database removed")
        
        conn = sqlite3.connect('eduhub_users.db', check_same_thread=False)
        c = conn.cursor()
        
        # Create users table (make all fields optional except ID, nickname, password)
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
        
        # Create admin user with all required fields
        from datetime import datetime
        c.execute('''INSERT INTO users 
                     (user_id, full_name, nickname, reg_no, college, department, 
                      password_hash, registration_date)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                  ('2105056', 
                   'Admin User', 
                   'Admin',
                   'ADMIN001',
                   'System Administration',
                   'ADMIN',
                   'sotorupa72', 
                   datetime.now()))
        
        conn.commit()
        conn.close()
        print("✅ Database initialized successfully")
        print("✅ Admin user created: ID=2105056, Password=sotorupa72")
        
    except Exception as e:
        print(f"❌ Database error: {e}")

# Initialize database on startup
init_db()

# ==================== API ENDPOINTS ====================
@app.route('/')
def home():
    """Home page"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>EduHub Backend</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%);
                color: white;
                padding: 40px;
                text-align: center;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.05);
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 126, 179, 0.3);
            }
            h1 {
                color: #ff7eb3;
                font-size: 2.5em;
                margin-bottom: 10px;
            }
            .status {
                color: #00ffc8;
                font-size: 1.2em;
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎓 EduHub Python Backend</h1>
            <div class="status">✅ Server is running on http://localhost:5000</div>
            <p>Your frontend is now connected to this backend!</p>
        </div>
    </body>
    </html>
    '''

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'EduHub Backend',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get website statistics"""
    try:
        conn = sqlite3.connect('eduhub_users.db', check_same_thread=False)
        c = conn.cursor()
        
        # Total users (excluding admin)
        c.execute("SELECT COUNT(*) FROM users WHERE user_id != '2105056'")
        total_users = c.fetchone()[0]
        
        # Today's registrations
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
                'active_now': 1,  # Simulated
                'timestamp': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/register', methods=['POST'])
def register_user():
    """Register new user"""
    try:
        data = request.get_json()
        print(f"📝 Registration data received for user ID: {data.get('id', 'Unknown')}")
        
        # Basic validation
        if not data.get('id') or not data.get('password'):
            return jsonify({
                'success': False,
                'error': 'ID and password are required'
            }), 400
        
        user_id = str(data['id']).strip()
        
        conn = sqlite3.connect('eduhub_users.db', check_same_thread=False)
        c = conn.cursor()
        
        # Check if user already exists
        c.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        if c.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'error': 'User ID already registered'
            }), 400
        
        # Get department
        department = data.get('department', '')
        if department == 'Others':
            department = data.get('otherDepartment', 'Unknown')
        
        # Insert new user (all fields optional except ID, nickname, password)
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
        
        print(f"✅ User registered successfully: {data.get('nickname', 'User')} ({user_id})")
        
        return jsonify({
            'success': True,
            'message': 'Registration successful!',
            'user': {
                'id': user_id,
                'nickname': data.get('nickname', 'User'),
                'department': department
            }
        })
        
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/login', methods=['POST'])
def login_user():
    """User login"""
    try:
        data = request.get_json()
        username = str(data.get('username', '')).strip()
        password = str(data.get('password', '')).strip()
        
        print(f"🔐 Login attempt: {username}")
        
        # Check admin credentials
        if username == '2105056' and password == 'sotorupa72':
            print("✅ Admin login successful")
            return jsonify({
                'success': True,
                'is_admin': True,
                'nickname': 'Admin',
                'department': 'ADMIN'
            })
        
        # Check regular user
        conn = sqlite3.connect('eduhub_users.db', check_same_thread=False)
        c = conn.cursor()
        c.execute('''SELECT user_id, nickname, department FROM users 
                     WHERE user_id=? AND password_hash=?''', 
                  (username, password))
        
        user = c.fetchone()
        conn.close()
        
        if user:
            print(f"✅ User {username} login successful")
            return jsonify({
                'success': True,
                'is_admin': False,
                'nickname': user[1],
                'department': user[2]
            })
        else:
            print(f"❌ Login failed for {username}")
            return jsonify({
                'success': False,
                'error': 'Invalid ID or password'
            }), 401
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users"""
    try:
        conn = sqlite3.connect('eduhub_users.db', check_same_thread=False)
        c = conn.cursor()
        
        c.execute('''SELECT user_id, full_name, nickname, college, department, 
                            registration_date FROM users 
                     WHERE user_id != '2105056' ORDER BY registration_date DESC''')
        
        users = []
        for row in c.fetchall():
            reg_date = row[5]
            if isinstance(reg_date, str):
                reg_date_str = reg_date
            else:
                reg_date_str = reg_date.isoformat() if hasattr(reg_date, 'isoformat') else str(reg_date)
            
            users.append({
                'id': row[0],
                'full_name': row[1] or 'Not provided',
                'nickname': row[2] or 'User',
                'college': row[3] or 'Not provided',
                'department': row[4] or 'Not specified',
                'registration_date': reg_date_str
            })
        
        conn.close()
        
        print(f"📊 Retrieved {len(users)} users from database")
        return jsonify({
            'success': True,
            'users': users,
            'total': len(users)
        })
        
    except Exception as e:
        print(f"❌ Get users error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/export-users', methods=['GET'])
def export_users():
    """Export users as CSV"""
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
        
        # Write header
        writer.writerow(['ID', 'Full Name', 'Nickname', 'Registration No', 'College', 
                         'Department', 'Email', 'Hometown', 'Hall Name', 'Supervisor', 
                         'Phone', 'Registration Date'])
        
        # Write data
        for row in c.fetchall():
            writer.writerow([str(cell) if cell is not None else '' for cell in row])
        
        conn.close()
        
        return jsonify({
            'success': True,
            'csv': output.getvalue(),
            'filename': f'eduhub_users_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        })
        
    except Exception as e:
        print(f"❌ Export error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🌐 Starting EduHub Backend Server...")
    print("📊 Admin Panel: http://localhost:5000")
    print("👤 Default Admin: ID=2105056, Password=sotorupa72")
    print("🔧 API Endpoints:")
    print("   - POST http://localhost:5000/api/register")
    print("   - POST http://localhost:5000/api/login")
    print("   - GET  http://localhost:5000/api/users")
    print("   - GET  http://localhost:5000/api/stats")
    print("   - GET  http://localhost:5000/api/export-users")
    print("=" * 60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)