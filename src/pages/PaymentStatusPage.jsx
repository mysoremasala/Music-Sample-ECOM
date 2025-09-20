import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { sessionService } from '../services/session';

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [orderId, setOrderId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const orderIdParam = searchParams.get('order_id');
    setOrderId(orderIdParam);
    
    if (orderIdParam) {
      // Add a small delay to ensure session is available
      setTimeout(() => {
        processPaymentSuccess(orderIdParam);
      }, 100);
    } else {
      setStatus('error');
      setMessage('No order ID found in URL');
    }
  }, [searchParams]);

  const processPaymentSuccess = async (orderId) => {
    try {
      setStatus('processing');
      
      // Get user data from session service
      const user = sessionService.getCurrentUser();
      console.log('PaymentStatusPage - Retrieved user:', user);
      console.log('PaymentStatusPage - Session service authenticated:', sessionService.isAuthenticated());
      
      if (!user || !user.uid) {
        // Try to get user from localStorage directly as fallback
        const sessionData = localStorage.getItem('music_sample_pack_session');
        console.log('PaymentStatusPage - Fallback session data:', sessionData);
        
        if (sessionData) {
          try {
            const parsedSession = JSON.parse(sessionData);
            const fallbackUser = parsedSession.user;
            console.log('PaymentStatusPage - Fallback user:', fallbackUser);
            
            if (fallbackUser && fallbackUser.uid) {
              // Use fallback user
              console.log('PaymentStatusPage - Using fallback user');
              processPaymentWithUser(fallbackUser, orderId);
              return;
            }
          } catch (error) {
            console.error('PaymentStatusPage - Error parsing fallback session:', error);
          }
        }
        
        setStatus('error');
        setMessage('User session not found. Please log in again.');
        return;
      }
      
      processPaymentWithUser(user, orderId);
    } catch (error) {
      console.error('Error processing payment success:', error);
      setStatus('error');
      setMessage('Payment successful but error processing order');
    }
  };

  const processPaymentWithUser = async (user, orderId) => {
    try {
      console.log('PaymentStatusPage - Processing payment with user:', user.uid);
      
      // Call backend to process payment success and send sample packs
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/payment/success`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          user_id: user.uid
        }),
      });

      const data = await response.json();
      console.log('PaymentStatusPage - Backend response:', data);
      
      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        
        // Redirect to thank you page immediately with order details
        navigate('/thank-you', { 
          state: { 
            orderDetails: {
              orderId: orderId,
              amount: '0', // We don't have amount here, but ThankYouPage can handle it
              emailSent: data.email_sent,
              message: data.message
            }
          }
        });
      } else {
        setStatus('error');
        setMessage(data.message || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Error processing payment success:', error);
      setStatus('error');
      setMessage('Payment successful but error processing order');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Status Icon */}
        <div style={{ marginBottom: '2rem' }}>
          {status === 'loading' && (
            <div style={{
              width: '80px',
              height: '80px',
              border: '4px solid rgba(255, 255, 255, 0.1)',
              borderTop: '4px solid #4CAF50',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          )}
          {status === 'processing' && (
            <div style={{
              width: '80px',
              height: '80px',
              border: '4px solid rgba(255, 255, 255, 0.1)',
              borderTop: '4px solid #FF9800',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          )}
          {status === 'success' && (
            <div style={{
              width: '80px',
              height: '80px',
              background: '#4CAF50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontSize: '2rem',
              color: 'white'
            }}>
              ✓
            </div>
          )}
          {status === 'error' && (
            <div style={{
              width: '80px',
              height: '80px',
              background: '#f44336',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontSize: '2rem',
              color: 'white'
            }}>
              ✗
            </div>
          )}
        </div>

        {/* Status Text */}
        <h1 style={{
          color: 'white',
          fontSize: '2rem',
          fontWeight: '600',
          marginBottom: '1rem',
          margin: '0 0 1rem 0'
        }}>
          {status === 'loading' && 'Loading...'}
          {status === 'processing' && 'Processing Payment...'}
          {status === 'success' && 'Payment Successful!'}
          {status === 'error' && 'Payment Error'}
        </h1>

        {orderId && (
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1rem',
            marginBottom: '1rem'
          }}>
            Order ID: {orderId}
          </p>
        )}

        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1rem',
          lineHeight: '1.5',
          marginBottom: '2rem'
        }}>
          {message || 'Please wait while we process your payment...'}
        </p>

        {status === 'success' && (
          <p style={{
            color: '#4CAF50',
            fontSize: '0.9rem',
            marginBottom: '2rem'
          }}>
            Redirecting to confirmation page...
          </p>
        )}

        {status === 'error' && (
          <button
            onClick={handleBackToHome}
            style={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(76, 175, 80, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Back to Home
          </button>
        )}

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
