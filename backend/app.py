from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from datetime import datetime
import requests
import uuid
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('EMAIL_USERNAME')

mail = Mail(app)


try:
    firebase_creds_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH', 'firebase-service-account.json')
    cred = credentials.Certificate(firebase_creds_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase initialized successfully.")
except Exception as e:
    print(f"FATAL: Failed to initialize Firebase: {e}")
    db = None


CASHFREE_APP_ID = os.getenv('CASHFREE_APP_ID')
CASHFREE_SECRET_KEY = os.getenv('CASHFREE_SECRET_KEY')
CASHFREE_API_URL = os.getenv('CASHFREE_API_URL', 'https://sandbox.cashfree.com/pg/orders')
CASHFREE_API_VERSION = os.getenv('CASHFREE_API_VERSION', '2023-08-01')


USD_TO_INR_RATE = 83.50 




@app.route('/api/signup', methods=['POST'])
def signup():
    if not db:
        return jsonify({'error': 'Database not initialized'}), 500
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')

        if not all([email, password, first_name, last_name]):
            return jsonify({'error': 'All fields are required'}), 400

        user = auth.create_user(
            email=email,
            password=password,
            display_name=f"{first_name} {last_name}"
        )

        user_data = {
            'uid': user.uid,
            'email': email,
            'firstName': first_name,
            'lastName': last_name,
            'createdAt': datetime.now(),
            'lastLogin': datetime.now()
        }
        db.collection('users').document(user.uid).set(user_data)
        
        custom_token = auth.create_custom_token(user.uid)

        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user': {
                'uid': user.uid,
                'email': email,
                'firstName': first_name,
                'lastName': last_name,
            },
            'token': custom_token.decode('utf-8')
        }), 201

    except auth.EmailAlreadyExistsError:
        return jsonify({'error': 'Email already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---

@app.route('/api/login', methods=['POST'])
def login():
    if not db:
        return jsonify({'error': 'Database not initialized'}), 500
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password') # Note: Password is not verified here, relying on frontend Firebase auth

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = auth.get_user_by_email(email)
        
        user_ref = db.collection('users').document(user.uid)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            user_ref.update({'lastLogin': datetime.now()})
            
            custom_token = auth.create_custom_token(user.uid)
            
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'uid': user.uid,
                    'email': user.email,
                    'firstName': user_data.get('firstName', ''),
                    'lastName': user_data.get('lastName', ''),
                },
                'token': custom_token.decode('utf-8')
            }), 200
        else:
            return jsonify({'error': 'User data not found'}), 404

    except auth.UserNotFoundError:
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        # Avoid sending generic password errors to the client
        return jsonify({'error': 'Invalid credentials or server error'}), 500

# ---

@app.route('/api/user/<uid>', methods=['GET'])
def get_user(uid):
    if not db:
        return jsonify({'error': 'Database not initialized'}), 500
    try:
        user_doc = db.collection('users').document(uid).get()
        if user_doc.exists:
            return jsonify({'success': True, 'user': user_doc.to_dict()}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---

@app.route('/api/create_order', methods=['POST'])
def create_order():
    if not db:
        return jsonify({'error': 'Database not initialized'}), 500
    try:
        data = request.get_json()
        uid = data.get('uid')
        amount_usd = data.get('amount')  # This amount is expected in USD, e.g., 29

        if not uid or not amount_usd:
            return jsonify({'error': 'User ID and amount are required'}), 400

        user_doc = db.collection('users').document(uid).get()
        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404
        
        user_data = user_doc.to_dict()
        order_id = f"order_{uuid.uuid4().hex}"

        # --- CURRENCY CONVERSION ---
        # Convert the USD amount from the frontend to INR for Cashfree
        amount_inr = float(amount_usd) * USD_TO_INR_RATE
        # ---

        headers = {
            "Content-Type": "application/json",
            "x-api-version": CASHFREE_API_VERSION,
            "x-client-id": CASHFREE_APP_ID,
            "x-client-secret": CASHFREE_SECRET_KEY,
        }

        payload = {
            "order_id": order_id,
            "order_amount": round(amount_inr, 2),  # Send the converted INR amount
            "order_currency": "INR",  # Cashfree India processes in INR
            "customer_details": {
                "customer_id": uid,
                "customer_email": user_data.get('email'),
                "customer_phone": "9999999999",  # Placeholder phone number
            },
            "order_meta": {
                "return_url": f"http://localhost:5173/payment/status?order_id={{order_id}}",
                "original_usd_amount": float(amount_usd) # Store original amount for reference
            }
        }

        response = requests.post(CASHFREE_API_URL, json=payload, headers=headers)
        response.raise_for_status() # Raises an exception for bad status codes (4xx or 5xx)

        order_data_response = response.json()
        payment_session_id = order_data_response.get("payment_session_id")

        if not payment_session_id:
            return jsonify({"error": "Could not get payment session ID from Cashfree"}), 500

        # Save the pending order to Firestore for tracking
        order_payload_db = {
            'uid': uid,
            'status': 'PENDING',
            'amount_usd': float(amount_usd),
            'amount_inr': round(amount_inr, 2),
            'created_at': datetime.now()
        }
        db.collection('orders').document(order_id).set(order_payload_db)

        return jsonify({
            "success": True,
            "payment_session_id": payment_session_id
        })

    except requests.exceptions.HTTPError as err:
        print(f"Cashfree API Error: {err.response.text}")
        return jsonify({"error": "Failed to create payment order", "details": err.response.json()}), err.response.status_code
    except Exception as e:
        print(f"An unexpected error occurred in create_order: {e}")
        return jsonify({'error': str(e)}), 500

# ---

@app.route('/api/payment/success', methods=['POST'])
def payment_success():
    if not db:
        return jsonify({'error': 'Database not initialized'}), 500
    
    try:
        data = request.get_json()
        order_id = data.get('order_id')
        
        # Best practice: Get user_id from a secure source like a verified JWT, not the request body.
        # For simplicity, we'll use the body for now.
        user_id = data.get('user_id') 
        
        if not order_id or not user_id:
            return jsonify({'error': 'Order ID and User ID are required'}), 400
        
        user_doc = db.collection('users').document(user_id).get()
        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404
        
        user_data = user_doc.to_dict()
        user_email = user_data.get('email')
        user_name = f"{user_data.get('firstName', '')} {user_data.get('lastName', '')}".strip()
        
        email_sent = send_sample_packs_email(user_email, user_name, order_id)
        
        # Update order status in Firestore
        order_ref = db.collection('orders').document(order_id)
        order_update_data = {
            'status': 'COMPLETED' if email_sent else 'FAILED_DELIVERY',
            'sample_packs_sent': email_sent,
            'completed_at': datetime.now()
        }
        order_ref.update(order_update_data)
        
        if email_sent:
            return jsonify({
                'success': True,
                'message': 'Payment successful and sample packs sent',
                'order_id': order_id
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Payment successful but failed to send sample packs email',
                'order_id': order_id
            }), 500
            
    except Exception as e:
        print(f"Error processing payment success for order '{order_id}': {e}")
        return jsonify({'error': str(e)}), 500

# ---

def send_sample_packs_email(user_email, user_name, order_id):
    """Sends the sample pack download link via email."""
    try:
        download_link = "https://github.com/ParthG24/musicsamplepackweb/releases/download/v1.0-samples/Sample.01.zip"
        
        msg = Message(
            subject=f'Your Sample Packs Are Here! (Order #{order_id})',
            recipients=[user_email],
            body=f"""
Dear {user_name},

Thank you for your purchase! Your sample packs are ready for download.

Order ID: {order_id}
Download Link: {download_link}

To get your files, simply click the link above. We recommend downloading them to a secure location on your computer.

If you have any issues with the download, please contact our support team.

Happy creating!

Best regards,
The Music Sample Pack Team
"""
        )
        mail.send(msg)
        print(f"Sample packs email sent successfully to {user_email} for order {order_id}")
        return True
    except Exception as e:
        print(f"Failed to send sample packs email to {user_email}: {e}")
        return False

# ---

@app.route('/api/health', methods=['GET'])
def health_check():
    """A simple health check endpoint to verify the server is running."""
    return jsonify({'status': 'healthy', 'message': 'Backend is running'}), 200

# ---

if __name__ == '__main__':
    # Use Gunicorn or another WSGI server in production instead of app.run()
    app.run(debug=True, host='0.0.0.0', port=5000)