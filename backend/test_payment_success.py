#!/usr/bin/env python3
"""
Test script to verify the payment success endpoint
"""

import requests
import json

def test_payment_success():
    """Test the payment success endpoint"""
    
    # Test data
    test_data = {
        "order_id": "test_order_123",
        "user_id": "test_user_123"
    }
    
    print("Testing payment success endpoint...")
    print(f"Test data: {json.dumps(test_data, indent=2)}")
    
    try:
        # Make request to payment success endpoint
        response = requests.post(
            'http://localhost:5000/api/payment/success',
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        
        if response.status_code == 200:
            print("✅ SUCCESS: Payment success endpoint is working!")
            data = response.json()
            if data.get('email_sent'):
                print("✅ Email was sent successfully!")
            else:
                print("⚠️ Email was not sent")
        else:
            print("❌ ERROR: Payment success endpoint failed")
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Could not connect to backend server")
        print("Make sure your backend is running on http://localhost:5000")
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == '__main__':
    test_payment_success()
