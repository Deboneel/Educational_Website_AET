#!/usr/bin/env python3
"""
EduHub Email Service for Password Recovery
Save as: email_service.py
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        """Initialize email service with Gmail credentials"""
        self.sender_email = os.getenv('EMAIL_USER', 'your_email@gmail.com')
        self.sender_password = os.getenv('EMAIL_PASSWORD', 'your_app_password')
        self.smtp_server = 'smtp.gmail.com'
        self.smtp_port = 587
        
    def send_account_recovery(self, to_email, user_id, password):
        """Send account recovery email with credentials"""
        try:
            # Create message
            subject = "🔑 EduHub Account Recovery"
            
            # HTML Email Content
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(45deg, #ff7eb3, #ff758c); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .credentials {{ background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ff7eb3; margin: 20px 0; }}
                    .warning {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 30px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎓 EduHub Account Recovery</h1>
                    </div>
                    <div class="content">
                        <h2>Dear User,</h2>
                        <p>We received a request to recover your EduHub account. Here are your credentials:</p>
                        
                        <div class="credentials">
                            <h3>📋 Your Account Details:</h3>
                            <p><strong>User ID:</strong> {user_id}</p>
                            <p><strong>Password:</strong> {password}</p>
                        </div>
                        
                        <div class="warning">
                            <h4>⚠️ Security Notice:</h4>
                            <p>For your security, please:</p>
                            <ul>
                                <li>Change your password after login</li>
                                <li>Do not share your credentials</li>
                                <li>Delete this email after recovering your account</li>
                            </ul>
                        </div>
                        
                        <p><strong>🔗 Login Link:</strong> <a href="http://localhost:5000">http://localhost:5000</a></p>
                        
                        <p>If you didn't request this recovery, please contact us immediately.</p>
                        
                        <p>Best regards,<br>
                        <strong>EduHub Team</strong><br>
                        Developed by Deboneel Partho</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message. Please do not reply to this email.</p>
                        <p>© 2024 EduHub - All rights reserved</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Plain text version
            text_content = f"""
            EduHub Account Recovery
            
            Dear User,
            
            We received a request to recover your EduHub account.
            
            Your Account Details:
            User ID: {user_id}
            Password: {password}
            
            Security Notice:
            - Change your password after login
            - Do not share your credentials
            - Delete this email after use
            
            Login Link: http://localhost:5000
            
            If you didn't request this, please contact us.
            
            Best regards,
            EduHub Team
            Developed by Deboneel Partho
            """
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f'EduHub Support <{self.sender_email}>'
            msg['To'] = to_email
            
            # Attach both HTML and plain text versions
            msg.attach(MIMEText(text_content, 'plain'))
            msg.attach(MIMEText(html_content, 'html'))
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(msg)
            
            logger.info(f"Recovery email sent to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send recovery email: {e}")
            return False
    
    def send_welcome_email(self, to_email, user_name, user_id):
        """Send welcome email to new users"""
        try:
            subject = "🎉 Welcome to EduHub!"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                    .header {{ background: linear-gradient(45deg, #00ffc8, #00b894); color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 30px; }}
                    .features {{ margin: 20px 0; }}
                    .feature-item {{ background: #e8f6f3; padding: 10px; margin: 5px 0; border-radius: 5px; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Welcome to EduHub, {user_name}! 🎓</h1>
                </div>
                <div class="content">
                    <h2>Your account has been created successfully!</h2>
                    <p><strong>User ID:</strong> {user_id}</p>
                    
                    <div class="features">
                        <h3>🌟 Available Features:</h3>
                        <div class="feature-item">📚 Course Selection</div>
                        <div class="feature-item">📖 Educational Articles</div>
                        <div class="feature-item">📓 Study Diary</div>
                        <div class="feature-item">🎵 Study Music Player</div>
                        <div class="feature-item">🎬 Educational Movies</div>
                    </div>
                    
                    <p><a href="http://localhost:5000">Click here to login and get started!</a></p>
                </div>
            </body>
            </html>
            """
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f'EduHub <{self.sender_email}>'
            msg['To'] = to_email
            
            msg.attach(MIMEText(html_content, 'html'))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(msg)
            
            logger.info(f"Welcome email sent to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send welcome email: {e}")
            return False
    
    def send_admin_alert(self, subject, message):
        """Send alert to admin"""
        try:
            admin_email = "deboneel1998@gmail.com"
            
            msg = MIMEMultipart()
            msg['Subject'] = f"🔔 EduHub Alert: {subject}"
            msg['From'] = self.sender_email
            msg['To'] = admin_email
            
            msg.attach(MIMEText(message, 'plain'))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(msg)
            
            logger.info(f"Admin alert sent: {subject}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send admin alert: {e}")
            return False

# Test function
def test_email_service():
    """Test the email service"""
    print("🧪 Testing Email Service...")
    
    email_service = EmailService()
    
    # Test 1: Recovery email
    print("1. Testing recovery email...")
    success = email_service.send_account_recovery(
        to_email="test@example.com",
        user_id="2105056",
        password="test123"
    )
    print(f"   Recovery email: {'✅ Success' if success else '❌ Failed'}")
    
    # Test 2: Welcome email
    print("2. Testing welcome email...")
    success = email_service.send_welcome_email(
        to_email="test@example.com",
        user_name="Test User",
        user_id="2105056"
    )
    print(f"   Welcome email: {'✅ Success' if success else '❌ Failed'}")
    
    print("\n📧 Email service test complete!")

if __name__ == "__main__":
    test_email_service()