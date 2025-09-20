#!/usr/bin/env python3
"""
Test script to verify email functionality
Run this to test if your Gmail credentials are working
"""

import os
from dotenv import load_dotenv
from flask import Flask
from flask_mail import Mail, Message

# Load environment variables
load_dotenv()

# Create minimal Flask app for testing
app = Flask(__name__)

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('EMAIL_USERNAME')

mail = Mail(app)

def test_email():
    """Test sending a simple email"""
    try:
        print("Testing email configuration...")
        print(f"Email username: {app.config['MAIL_USERNAME']}")
        print(f"Email password: {'*' * len(app.config['MAIL_PASSWORD']) if app.config['MAIL_PASSWORD'] else 'NOT SET'}")
        
        if not app.config['MAIL_USERNAME'] or not app.config['MAIL_PASSWORD']:
            print("❌ ERROR: Email credentials not set in .env file")
            print("Please create a .env file with EMAIL_USERNAME and EMAIL_PASSWORD")
            return False
        
        # Create test message
        msg = Message(
            subject='Test Email - Sample Pack System',
            recipients=[app.config['MAIL_USERNAME']],  # Send to yourself
            body='This is a test email to verify your Gmail configuration is working.'
        )
        
        # Send email
        with app.app_context():
            mail.send(msg)
        
        print("✅ SUCCESS: Test email sent successfully!")
        print("Check your inbox for the test email")
        return True
        
    except Exception as e:
        print(f"❌ ERROR: Failed to send test email: {e}")
        print("\nCommon issues:")
        print("1. Check if .env file exists in backend/ directory")
        print("2. Verify EMAIL_USERNAME and EMAIL_PASSWORD are set")
        print("3. Make sure you're using a Gmail App Password (not regular password)")
        print("4. Check if 2-Step Verification is enabled on your Google account")
        return False

if __name__ == '__main__':
    with app.app_context():
        test_email()
