import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import CartItem from './CartItem';
import { getCart, updateCartItem, removeFromCart } from '../services/api';
import './Cart.css';

function Cart({ onCartUpdate }) {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[Cart] Fetching cart data...');
      const response = await getCart();
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      const items = response.data.items || [];
      const total = response.data.total || 0;
      
      console.log('[Cart] Successfully loaded cart:', { itemCount: items.length, total });
      setCartItems(items);
      setTotal(total);
      
      // Update cart count in parent
      if (onCartUpdate) {
        onCartUpdate(items.length);
      }
    } catch (err) {
      console.error('[Cart] Failed to fetch cart:', {
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

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (id, quantity) => {
    try {
      setError(null);
      
      console.log('[Cart] Updating quantity:', { id, quantity });
      
      // Validate quantity
      if (quantity < 1) {
        setError('Quantity must be at least 1');
        return;
      }
      
      await updateCartItem(id, quantity);
      
      // Refresh cart after update
      await fetchCart();
      console.log('[Cart] Quantity updated successfully');
    } catch (err) {
      console.error('[Cart] Failed to update quantity:', {
        id,
        quantity,
        message: err.message,
        userMessage: err.userMessage,
        timestamp: new Date().toISOString()
      });
      
      const errorMessage = err.userMessage || 
                          err.response?.data?.error || 
                          'Failed to update quantity. Please try again.';
      setError(errorMessage);
      
      // Refresh cart to restore correct state
      await fetchCart();
    }
  };

  const handleRemove = async (id) => {
    // Store original state for rollback
    const originalItems = [...cartItems];
    const originalTotal = total;
    
    try {
      setError(null);
      
      console.log('[Cart] Removing item:', id);
      
      // Optimistically update UI
      const updatedItems = cartItems.filter(item => item.id !== id);
      setCartItems(updatedItems);
      
      // Recalculate total
      const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      setTotal(newTotal);
      
      // Update cart count in parent
      if (onCartUpdate) {
        onCartUpdate(updatedItems.length);
      }
      
      // Make API call
      await removeFromCart(id);
      console.log('[Cart] Item removed successfully');
    } catch (err) {
      console.error('[Cart] Failed to remove item:', {
        id,
        message: err.message,
        userMessage: err.userMessage,
        timestamp: new Date().toISOString()
      });
      
      // Rollback UI changes
      setCartItems(originalItems);
      setTotal(originalTotal);
      if (onCartUpdate) {
        onCartUpdate(originalItems.length);
      }
      
      const errorMessage = err.userMessage || 
                          err.response?.data?.error || 
                          'Failed to remove item. Please try again.';
      setError(errorMessage);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-heading">YOUR CART</h1>
      
      {error && (
        <div className="error-message">{error}</div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate('/')}
          >
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span className="total-label">TOTAL</span>
              <span className="total-amount">${total.toFixed(2)}</span>
            </div>
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </>
      )}
    </div>
  );
}

Cart.propTypes = {
  onCartUpdate: PropTypes.func
};

export default Cart;
