# Email Setup for Sample Pack Delivery

This guide explains how to set up the email functionality to automatically send sample packs to users after successful payment.

## Overview

After a user completes payment, the system will automatically:
1. Process the payment success
2. Send an email to the user's registered email address
3. Include a download link to the sample pack ZIP file
4. Store order information in the database

## Setup Requirements

### 1. Install Dependencies

The backend now requires additional Python packages. Install them by running:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```bash
# Email Configuration (Gmail)
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**Important**: For Gmail, you must use an App Password, not your regular password.

### 3. Gmail App Password Setup

To generate a Gmail App Password:

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Enable 2-Step Verification if not already enabled
3. Go to Security > App passwords
4. Select "Mail" from the dropdown
5. Click "Generate"
6. Copy the generated 16-character password
7. Use this password in your `EMAIL_PASSWORD` environment variable

### 4. Sample Pack Download Link

The system now uses a direct download link instead of file attachments:
- **Download URL**: `https://github.com/ParthG24/musicsamplepackweb/releases/download/v1.0-samples/Sample.01.zip`
- **File Type**: ZIP archive containing premium audio samples
- **Access**: Direct download link (no file storage required on server)

## How It Works

### Backend Flow

1. **Payment Success Endpoint**: `/api/payment/success`
   - Receives order ID and user ID
   - Retrieves user information from Firebase
   - Calls email function to send sample packs
   - Stores order details in database

2. **Email Function**: `send_sample_packs_email()`
   - Creates email with order details
   - Includes download link to sample pack ZIP file
   - Sends via Gmail SMTP
   - Returns success/failure status

### Frontend Flow

1. **Payment Success**: After Cashfree redirects back
2. **API Call**: Frontend calls `/api/payment/success`
3. **Email Delivery**: Backend sends sample packs via email
4. **Confirmation**: User sees success message with delivery status

## Email Template

The email includes:
- Personalized greeting with user's name
- Order details (Order ID, sample pack information)
- Professional message about royalty-free usage
- Direct download link to the sample pack ZIP file
- Download instructions and important notes

## Database Storage

Order information is stored in Firestore with:
- Order ID, user ID, email
- Status (completed)
- Sample packs sent flag
- Timestamps for creation and email sending

## Testing

### Test the Email Functionality

1. **Set up environment variables** with valid Gmail credentials
2. **Start the backend server**
3. **Complete a test payment** (use Cashfree sandbox)
4. **Check the backend logs** for email sending status
5. **Verify email delivery** in the user's inbox

### Common Issues

- **Authentication failed**: Check Gmail app password
- **File not found**: Ensure sample pack files exist in correct location
- **SMTP errors**: Verify Gmail settings and firewall rules

## Security Notes

- Gmail app passwords are more secure than regular passwords
- Email credentials are stored in environment variables
- Sample pack files are read from the server's file system
- Order information is stored securely in Firebase

## Production Considerations

- Use environment-specific email templates
- Implement email delivery retry logic
- Add email delivery monitoring
- Consider using a professional email service (SendGrid, Mailgun)
- Implement rate limiting for email sending
- Add email delivery status tracking

## Support

If you encounter issues:
1. Check backend logs for error messages
2. Verify environment variables are set correctly
3. Test Gmail credentials manually
4. Ensure sample pack files are accessible
5. Check Firebase connection and permissions
