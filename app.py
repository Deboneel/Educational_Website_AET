#!/usr/bin/env python3
"""
Flask Backend for EduHub Website
Handles user registration, login, and admin features WITHOUT modifying your JS
"""

from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
import sqlite3
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)  # Enable CORS for all routes
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SESSION_TYPE'] = 'filesystem'

# Initialize database
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    
    # Create users table
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id TEXT UNIQUE,
                  full_name TEXT,
                  nickname TEXT,
                  reg_no TEXT,
                  college TEXT,
                  department TEXT,
                  email TEXT,
                  password_hash TEXT,
                  hometown TEXT,
                  hall_name TEXT,
                  supervisor TEXT,
                  phone TEXT,
                  registration_date TIMESTAMP,
                  last_login TIMESTAMP)''')
    
    # Create admin user if not exists
    c.execute("SELECT * FROM users WHERE user_id='2105056'")
    if not c.fetchone():
        c.execute('''INSERT INTO users 
                     (user_id, full_name, nickname, password_hash, registration_date)
                     VALUES (?, ?, ?, ?, ?)''',
                  ('2105056', 'Admin User', 'Admin', 
                   'sotorupa72', datetime.now()))
    
    # Create activity logs table
    c.execute('''CREATE TABLE IF NOT EXISTS activity_logs
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id TEXT,
                  activity_type TEXT,
                  timestamp TIMESTAMP,
                  ip_address TEXT,
                  user_agent TEXT)''')
    
    # Create page views table
    c.execute('''CREATE TABLE IF NOT EXISTS page_views
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id TEXT,
                  page_url TEXT,
                  timestamp TIMESTAMP,
                  referrer TEXT)''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# ==================== API ENDPOINTS ====================

@app.route('/')
def index():
    """Serve main HTML page"""
    return app.send_static_file('index.html')

@app.route('/api/register', methods=['POST'])
def register_user():
    """Handle user registration"""
    try:
        data = request.json
        
        # Validation
        required_fields = ['id', 'fullName', 'nickname', 'regNo', 'college', 
                          'department', 'email', 'password']
        
        for field in required_fields:
            if field not in data or not data[field].strip():
                return jsonify({'success': False, 'error': f'{field} is required'}), 400
        
        # Check if user exists
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE user_id=?", (data['id'],))
        if c.fetchone():
            conn.close()
            return jsonify({'success': False, 'error': 'User ID already exists'}), 400
        
        # Insert user
        c.execute('''INSERT INTO users 
                     (user_id, full_name, nickname, reg_no, college, department, 
                      email, password_hash, hometown, hall_name, supervisor, phone, registration_date)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                  (data['id'], data['fullName'], data['nickname'], data['regNo'],
                   data['college'], data['department'], data['email'], data['password'],
                   data.get('hometown', ''), data.get('hallName', ''), 
                   data.get('supervisor', ''), data.get('phone', ''),
                   datetime.now()))
        
        # Log activity
        c.execute('''INSERT INTO activity_logs 
                     (user_id, activity_type, timestamp, ip_address, user_agent)
                     VALUES (?, ?, ?, ?, ?)''',
                  (data['id'], 'registration', datetime.now(), 
                   request.remote_addr, request.user_agent.string))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user': {
                'id': data['id'],
                'nickname': data['nickname'],
                'department': data['department']
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login_user():
    """Handle user login"""
    try:
        data = request.json
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        # Check for admin
        if username == '2105056' and password == 'sotorupa72':
            session['user_id'] = '2105056'
            session['is_admin'] = True
            session['nickname'] = 'Admin'
            
            return jsonify({
                'success': True,
                'is_admin': True,
                'nickname': 'Admin',
                'department': 'ADMIN'
            })
        
        # Check regular user
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute('''SELECT user_id, nickname, department FROM users 
                     WHERE user_id=? AND password_hash=?''', 
                  (username, password))
        
        user = c.fetchone()
        conn.close()
        
        if user:
            session['user_id'] = user[0]
            session['is_admin'] = False
            session['nickname'] = user[1]
            
            # Update last login
            conn = sqlite3.connect('users.db')
            c = conn.cursor()
            c.execute('''UPDATE users SET last_login=? WHERE user_id=?''',
                      (datetime.now(), user[0]))
            
            # Log activity
            c.execute('''INSERT INTO activity_logs 
                         (user_id, activity_type, timestamp, ip_address, user_agent)
                         VALUES (?, ?, ?, ?, ?)''',
                      (user[0], 'login', datetime.now(), 
                       request.remote_addr, request.user_agent.string))
            
            conn.commit()
            conn.close()
            
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

@app.route('/api/logout', methods=['POST'])
def logout():
    """Handle user logout"""
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'})

@app.route('/api/users', methods=['GET'])
def get_all_users():
    """Get all users (admin only)"""
    if not session.get('is_admin'):
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Get all users except admin
        c.execute('''SELECT user_id, full_name, nickname, college, department, 
                            registration_date, last_login 
                     FROM users WHERE user_id != '2105056' 
                     ORDER BY registration_date DESC''')
        
        users = []
        for row in c.fetchall():
            users.append({
                'id': row[0],
                'full_name': row[1],
                'nickname': row[2],
                'college': row[3],
                'department': row[4],
                'registration_date': row[5],
                'last_login': row[6]
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'users': users,
            'total': len(users)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get website statistics"""
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Total users
        c.execute("SELECT COUNT(*) FROM users WHERE user_id != '2105056'")
        total_users = c.fetchone()[0]
        
        # Today's registrations
        today = datetime.now().strftime('%Y-%m-%d')
        c.execute("SELECT COUNT(*) FROM users WHERE DATE(registration_date)=? AND user_id != '2105056'", 
                  (today,))
        today_users = c.fetchone()[0]
        
        # Recent activity (last 5 minutes)
        five_min_ago = datetime.now().timestamp() - 300
        c.execute('''SELECT COUNT(DISTINCT user_id) FROM activity_logs 
                     WHERE timestamp >= ?''', 
                  (datetime.fromtimestamp(five_min_ago),))
        active_now = c.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_users': total_users,
                'today_users': today_users,
                'active_now': active_now,
                'timestamp': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/log-activity', methods=['POST'])
def log_activity():
    """Log user activity"""
    try:
        data = request.json
        user_id = data.get('user_id', 'anonymous')
        activity_type = data.get('activity_type', 'page_view')
        
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        c.execute('''INSERT INTO activity_logs 
                     (user_id, activity_type, timestamp, ip_address, user_agent)
                     VALUES (?, ?, ?, ?, ?)''',
                  (user_id, activity_type, datetime.now(), 
                   request.remote_addr, request.user_agent.string))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True})
        
    except:
        return jsonify({'success': False}), 500

@app.route('/admin')
def admin_dashboard():
    """Admin dashboard page"""
    if not session.get('is_admin'):
        return 'Unauthorized', 403
    return render_template('admin.html')

# ==================== UTILITY FUNCTIONS ====================

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/export-users', methods=['GET'])
def export_users():
    """Export users as CSV (admin only)"""
    if not session.get('is_admin'):
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        c.execute('''SELECT * FROM users WHERE user_id != '2105056' 
                     ORDER BY registration_date DESC''')
        
        users = []
        for row in c.fetchall():
            users.append({
                'ID': row[1],
                'Full Name': row[2],
                'Nickname': row[3],
                'Registration No': row[4],
                'College': row[5],
                'Department': row[6],
                'Email': row[7],
                'Hometown': row[9],
                'Hall Name': row[10],
                'Supervisor': row[11],
                'Phone': row[12],
                'Registration Date': row[13],
                'Last Login': row[14]
            })
        
        conn.close()
        
        # Generate CSV
        import csv
        from io import StringIO
        
        output = StringIO()
        writer = csv.DictWriter(output, fieldnames=users[0].keys() if users else [])
        writer.writeheader()
        writer.writerows(users)
        
        return jsonify({
            'success': True,
            'csv': output.getvalue(),
            'filename': f'eduhub_users_{datetime.now().strftime("%Y%m%d")}.csv'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== HEALTH CHECK ====================

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'EduHub Backend'
    })

if __name__ == '__main__':
    print("🚀 Starting EduHub Backend Server...")
    print("📊 Admin Panel: http://localhost:5000/admin")
    print("👤 Default Admin: ID=2105056, Password=sotorupa72")
    app.run(debug=True, host='0.0.0.0', port=5000)