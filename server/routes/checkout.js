import express from 'express';
import { randomBytes } from 'crypto';

const router = express.Router();

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate unique order ID
 */
function generateOrderId() {
  const timestamp = Date.now().toString(36);
  const randomPart = randomBytes(4).toString('hex');
  return `ORD-${timestamp}-${randomPart}`.toUpperCase();
}

/**
 * Validation middleware for checkout
 */
function validateCheckoutRequest(req, res, next) {
  const { cartItems, name, email } = req.body;
  
  console.log('[Checkout Validation]', { 
    hasCartItems: !!cartItems, 
    cartItemsLength: cartItems?.length,
    hasName: !!name,
    hasEmail: !!email,
    timestamp: new Date().toISOString()
  });
  
  // Validate cartItems
  if (!cartItems || !Array.isArray(cartItems)) {
    console.error('[Checkout Validation Error] Invalid cartItems type');
    return res.status(400).json({ error: 'Cart items must be an array' });
  }
  
  if (cartItems.length === 0) {
    console.error('[Checkout Validation Error] Empty cart');
    return res.status(400).json({ error: 'Cart is empty. Please add items before checkout.' });
  }
  
  // Validate each cart item has required fields
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    if (!item.productId || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      console.error('[Checkout Validation Error] Invalid cart item at index', i, item);
      return res.status(400).json({ error: `Invalid cart item at position ${i + 1}` });
    }
  }
  
  // Validate name
  if (!name || typeof name !== 'string') {
    console.error('[Checkout Validation Error] Invalid name type');
    return res.status(400).json({ error: 'Name is required and must be a string' });
  }
  
  if (name.trim().length === 0) {
    console.error('[Checkout Validation Error] Empty name');
    return res.status(400).json({ error: 'Name cannot be empty' });
  }
  
  if (name.trim().length > 100) {
    console.error('[Checkout Validation Error] Name too long');
    return res.status(400).json({ error: 'Name must be less than 100 characters' });
  }
  
  // Validate email
  if (!email || typeof email !== 'string') {
    console.error('[Checkout Validation Error] Invalid email type');
    return res.status(400).json({ error: 'Email is required and must be a string' });
  }
  
  if (!isValidEmail(email)) {
    console.error('[Checkout Validation Error] Invalid email format:', email);
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  
  next();
}

/**
 * POST /api/checkout
 * Process checkout and generate receipt
 */
router.post('/', validateCheckoutRequest, (req, res) => {
  const { cartItems, name, email } = req.body;
  
  try {
    console.log('[POST /api/checkout] Processing checkout for:', email);
    
    // Calculate total from cart items
    const total = cartItems.reduce((sum, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return sum + itemTotal;
    }, 0);
    
    // Validate total is reasonable
    if (total <= 0) {
      console.error('[POST /api/checkout] Invalid total:', total);
      return res.status(400).json({ error: 'Invalid cart total. Please check your items.' });
    }
    
    if (total > 1000000) {
      console.error('[POST /api/checkout] Total exceeds maximum:', total);
      return res.status(400).json({ error: 'Order total exceeds maximum allowed amount.' });
    }
    
    // Generate unique order ID
    const orderId = generateOrderId();
    
    // Create receipt object
    const receipt = {
      orderId,
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date().toISOString(),
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: parseFloat((item.price * item.quantity).toFixed(2))
      })),
      customer: {
        name: name.trim(),
        email: email.trim().toLowerCase()
      }
    };
    
    console.log('[POST /api/checkout] Checkout successful:', {
      orderId,
      total: receipt.total,
      itemCount: cartItems.length,
      timestamp: receipt.timestamp
    });
    
    res.json(receipt);
  } catch (error) {
    console.error('[POST /api/checkout] Error:', {
      message: error.message,
      stack: error.stack,
      email,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ error: 'Failed to process checkout. Please try again.' });
  }
});

export default router;
