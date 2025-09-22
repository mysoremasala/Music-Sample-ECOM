import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero3DBox from './components/Hero3DBox';
import ProductGrid from './components/ProductGrid';
import CartPage from './components/CartPage';
import AllPacksPage from './components/AllPacksPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PaymentGateway from './components/PaymentGateway';
import PaymentStatusPage from './pages/PaymentStatusPage';
import ThankYouPage from './pages/ThankYouPage';
import Footer from './components/Footer';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import WorkPage from './pages/WorkPage';
import MarqueeBanner from './components/MarqueeBanner';
import { sessionService } from './services/session';


function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for existing session on app load
  useEffect(() => {
    const existingSession = sessionService.getSession();
    if (existingSession) {
      setIsLoggedIn(true);
      setUser(existingSession.user);
    }
  }, []);

  // Refresh session every 30 minutes to keep user logged in
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        sessionService.refreshSession();
      }, 30 * 60 * 1000); // 30 minutes

      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Check for session expiry every minute
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        if (sessionService.isSessionExpiringSoon()) {
          // Session is expiring soon, refresh it
          sessionService.refreshSession();
        } else if (!sessionService.isAuthenticated()) {
          // Session has expired, log out user
          handleLogout();
        }
      }, 60 * 1000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Process pending payments after user state is restored
  useEffect(() => {
    if (isLoggedIn && user && user.uid) {
      const pendingOrderId = sessionStorage.getItem('pending_payment_order_id');
      if (pendingOrderId) {
        console.log('Processing pending payment for order:', pendingOrderId);
        console.log('User state restored, processing payment success');
        
        // Remove the pending order ID from storage
        sessionStorage.removeItem('pending_payment_order_id');
        
        // Process the payment success
        handlePaymentSuccess({ orderId: pendingOrderId });
      }
    }
  }, [isLoggedIn, user]); // Run when user state changes

  // Cart functions
  const addToCart = (product) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (index, quantity) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = quantity;
    setCartItems(newCartItems);
  };

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const checkout = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate('/payment');
  };

  const handlePaymentSuccess = async (details) => {
    console.log('handlePaymentSuccess called with:', details);
    console.log('Current user state:', user);
    
    if (!user || !user.uid) {
      console.error('User not available in handlePaymentSuccess');
      setOrderDetails({
        ...details,
        emailSent: false,
        message: 'User session expired. Please log in again.'
      });
      setCartItems([]);
      setCurrentPage('thank-you');
      return;
    }
    
    try {
      const requestBody = {
        order_id: details.orderId,
        user_id: user.uid
      };
      
      console.log('Calling backend with:', requestBody);
      
      // Call backend to process payment success and send sample packs
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/payment/success`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Sample packs sent successfully:', data.message);
        setOrderDetails({
          ...details,
          emailSent: data.email_sent,
          message: data.message
        });
      } else {
        console.error('Failed to send sample packs:', data.message);
        setOrderDetails({
          ...details,
          emailSent: false,
          message: data.message
        });
      }
    } catch (error) {
      console.error('Error processing payment success:', error);
      setOrderDetails({
        ...details,
        emailSent: false,
        message: 'Payment successful but error processing order'
      });
    }
    
    setCartItems([]); // Clear the cart
    navigate('/thank-you');
  };

  const handlePaymentCancel = () => {
    navigate('/cart');
  };

  const continueShopping = () => {
    navigate('/');
  };

  // User authentication functions
  const handleLogin = (userData) => {
    const user = {
      name: userData.displayName || `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      uid: userData.uid
    };
    
    // Save session
    sessionService.saveSession(user, userData.token || '');
    
    setIsLoggedIn(true);
    setUser(user);
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleNavigateToSignup = () => {
    navigate('/signup');
  };

  const handleSignup = (userData) => {
    const user = {
      name: userData.displayName || `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      uid: userData.uid
    };
    
    // Save session
    sessionService.saveSession(user, userData.token || '');
    
    setIsLoggedIn(true);
    setUser(user);
    navigate('/');
  };

  const handleLogout = () => {
    // Clear session
    sessionService.clearSession();
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleCartClick = () => {
    handleProtectedRoute('cart');
  };

  const handleViewAllPacks = () => {
    navigate('/all-packs');
  };

  // Protected route handler
  const handleProtectedRoute = (routeName) => {
    if (!isLoggedIn) {
      navigate('/login');
      return false;
    }
    navigate(routeName);
    return true;
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Check if current route is a protected route
  const isProtectedRoute = (pathname) => {
    return ['/cart', '/payment', '/all-packs'].includes(pathname);
  };

  // Redirect to login if accessing protected route without authentication
  useEffect(() => {
    if (isProtectedRoute(location.pathname) && !isLoggedIn) {
      navigate('/login');
    }
  }, [location.pathname, isLoggedIn, navigate]);

  return (
    <div className="App">
      <MarqueeBanner text="NEW LAUNCH DISCOUNT - LIMITED TIME OFFER" />
      <Navbar 
        cartItemCount={cartItemCount}
        onCartClick={handleCartClick}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigateToLogin={handleNavigateToLogin}
        onNavigateToSignup={handleNavigateToSignup}
      />
      
      <Routes>
        <Route path="/" element={
          <>
            <Hero3DBox />
            <ProductGrid onAddToCart={addToCart} isLoggedIn={isLoggedIn} />
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <LoginPage
            onLogin={handleLogin}
            onNavigateToSignup={handleNavigateToSignup}
            onBackToHome={handleBackToHome}
          />
        } />
        <Route path="/signup" element={
          <SignupPage
            onSignup={handleSignup}
            onNavigateToLogin={handleNavigateToLogin}
            onBackToHome={handleBackToHome}
          />
        } />
        <Route path="/cart" element={
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={checkout}
            onContinueShopping={continueShopping}
          />
        } />
        <Route path="/payment" element={
          <PaymentGateway
            cartItems={cartItems}
            totalAmount={cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}
            onPaymentSuccess={handlePaymentSuccess} 
            onPaymentCancel={handlePaymentCancel}
            user={user}
          />
        } />
        <Route path="/payment/status" element={<PaymentStatusPage />} />
        <Route path="/thank-you" element={
          <ThankYouPage
            onBackToHome={handleBackToHome}
            orderDetails={orderDetails}
          />
        } />
        <Route path="/all-packs" element={
          <AllPacksPage
            onAddToCart={addToCart}
            isLoggedIn={isLoggedIn}
          />
        } />
        <Route path="/contact" element={
          <ContactPage 
            onBackToHome={handleBackToHome} 
            />
          } />
          <Route path="/about" element={<AboutPage onBackToHome={handleBackToHome} />} />
          <Route path="/work" element={<WorkPage onBackToHome={handleBackToHome} />} />
      </Routes>
    </div>
  );
}

export default App;
