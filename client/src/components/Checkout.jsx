import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, checkout } from '../services/api';
import ReceiptModal from './ReceiptModal';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);

  // Fetch cart items on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[Checkout] Fetching cart data...');
      const response = await getCart();
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      const items = response.data.items || [];
      const total = response.data.total || 0;
      
      console.log('[Checkout] Successfully loaded cart:', { itemCount: items.length, total });
      setCartItems(items);
      setCartTotal(total);
    } catch (err) {
      console.error('[Checkout] Error fetching cart:', {
        message: err.message,
        userMessage: err.userMessage,
        timestamp: new Date().toISOString()
      });
      
      const errorMessage = err.userMessage || 
                          err.response?.data?.error || 
                          'Failed to load cart. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    console.log('[Checkout] Validating form:', {
      name: formData.name,
      email: formData.email
    });

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      console.log('[Checkout] Validation errors:', newErrors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('[Checkout] Form submitted');

    // Validate form
    if (!validateForm()) {
      console.log('[Checkout] Form validation failed');
      return;
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      console.error('[Checkout] Cart is empty');
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      console.log('[Checkout] Submitting checkout:', {
        itemCount: cartItems.length,
        total: cartTotal,
        email: formData.email
      });

      // Submit checkout
      const response = await checkout(cartItems, {
        name: formData.name,
        email: formData.email
      });

      if (!response.data) {
        throw new Error('No receipt data received from server');
      }

      console.log('[Checkout] Checkout successful:', {
        orderId: response.data.orderId,
        total: response.data.total
      });

      // Set receipt data and show modal
      setReceipt(response.data);
      setShowReceipt(true);

      // Clear cart items after successful checkout
      setCartItems([]);
      setCartTotal(0);
    } catch (err) {
      console.error('[Checkout] Checkout error:', {
        message: err.message,
        userMessage: err.userMessage,
        response: err.response?.data,
        timestamp: new Date().toISOString()
      });
      
      const errorMessage = err.userMessage || 
                          err.response?.data?.error || 
                          'Checkout failed. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setReceipt(null);
    // Navigate to home page after closing receipt
    navigate('/');
  };

  if (loading) {
    return <div className="checkout-container"><div className="loading">LOADING...</div></div>;
  }

  if (cartItems.length === 0 && !showReceipt) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <p>Your cart is empty</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-heading">CHECKOUT</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="checkout-content">
        <div className="checkout-form-section">
          <h2 className="section-title">Customer Information</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? 'PROCESSING...' : 'COMPLETE ORDER'}
            </button>
          </form>
        </div>

        <div className="order-summary-section">
          <h2 className="section-title">Order Summary</h2>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-info">
                  <span className="summary-item-name">{item.name}</span>
                  <span className="summary-item-quantity">Qty: {item.quantity}</span>
                </div>
                <span className="summary-item-price">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span className="summary-total-label">TOTAL</span>
            <span className="summary-total-amount">${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {showReceipt && <ReceiptModal receipt={receipt} onClose={handleCloseReceipt} />}
    </div>
  );
}

export default Checkout;
