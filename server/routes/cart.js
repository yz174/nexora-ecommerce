import express from 'express';
import CartItem from '../models/CartItem.js';
import axios from 'axios';

const router = express.Router();

// Mock user ID for all cart operations
const MOCK_USER_ID = 'mock-user-001';

// Mock product data as fallback
const mockProducts = {
  '1': { id: '1', name: 'Classic Wool Sweater', price: 299.99, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop' },
  '2': { id: '2', name: 'Technical Jacket', price: 799.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop' },
  '3': { id: '3', name: 'Cotton T-Shirt', price: 89.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop' },
  '4': { id: '4', name: 'Cargo Pants', price: 349.99, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=400&fit=crop' },
  '5': { id: '5', name: 'Hooded Sweatshirt', price: 249.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop' },
  '6': { id: '6', name: 'Nylon Overshirt', price: 449.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop' },
  '7': { id: '7', name: 'Knit Beanie', price: 119.99, image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=300&h=400&fit=crop' },
  '8': { id: '8', name: 'Canvas Backpack', price: 399.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop' },
  '9': { id: '9', name: 'Leather Boots', price: 599.99, image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=300&h=400&fit=crop' },
  '10': { id: '10', name: 'Denim Jacket', price: 399.99, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=400&fit=crop' },
  '11': { id: '11', name: 'Wool Scarf', price: 149.99, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=400&fit=crop' },
  '12': { id: '12', name: 'Chino Pants', price: 279.99, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=400&fit=crop' },
  '13': { id: '13', name: 'Flannel Shirt', price: 189.99, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop' },
  '14': { id: '14', name: 'Running Sneakers', price: 449.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop' },
  '15': { id: '15', name: 'Leather Belt', price: 99.99, image: 'https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=300&h=400&fit=crop' },
  '16': { id: '16', name: 'Polo Shirt', price: 129.99, image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=400&fit=crop' },
  '17': { id: '17', name: 'Winter Coat', price: 899.99, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&h=400&fit=crop' },
  '18': { id: '18', name: 'Dress Shoes', price: 549.99, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=300&h=400&fit=crop' },
  '19': { id: '19', name: 'Baseball Cap', price: 79.99, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=400&fit=crop' },
  '20': { id: '20', name: 'Jogger Pants', price: 199.99, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=300&h=400&fit=crop' }
};

/**
 * Fetch product details from Fake Store API or mock data
 */
async function fetchProductDetails(productId) {
  try {
    // Try Fake Store API first
    console.log(`[fetchProductDetails] Fetching product ${productId} from Fake Store API`);
    const response = await axios.get(`https://fakestoreapi.com/products/${productId}`, {
      timeout: 3000
    });
    
    if (response.data) {
      console.log(`[fetchProductDetails] Successfully fetched product ${productId} from API`);
      return {
        id: response.data.id.toString(),
        name: response.data.title,
        price: response.data.price,
        image: response.data.image
      };
    }
  } catch (error) {
    console.log(`[fetchProductDetails] API fetch failed for product ${productId}:`, error.message);
  }
  
  // Fallback to mock data
  console.log(`[fetchProductDetails] Using mock data for product ${productId}`);
  const product = mockProducts[productId];
  
  if (!product) {
    console.error(`[fetchProductDetails] Product ${productId} not found in mock data either`);
    throw new Error('Product not found');
  }
  
  return product;
}

/**
 * Validation middleware for cart operations
 */
function validateCartRequest(req, res, next) {
  const { productId, quantity, id } = req.body;
  
  // Log validation attempt
  console.log('[Cart Validation]', { productId, quantity, id, timestamp: new Date().toISOString() });
  
  // Validate productId (required for new items)
  if (!id && (!productId || typeof productId !== 'string' || productId.trim().length === 0)) {
    console.error('[Cart Validation Error] Invalid productId:', productId);
    return res.status(400).json({ error: 'Invalid productId: must be a non-empty string' });
  }
  
  // Validate quantity
  if (quantity === undefined || quantity === null) {
    console.error('[Cart Validation Error] Missing quantity');
    return res.status(400).json({ error: 'Quantity is required' });
  }
  
  if (typeof quantity !== 'number' || !Number.isInteger(quantity)) {
    console.error('[Cart Validation Error] Invalid quantity type:', typeof quantity);
    return res.status(400).json({ error: 'Invalid quantity: must be an integer' });
  }
  
  if (quantity < 1) {
    console.error('[Cart Validation Error] Quantity too low:', quantity);
    return res.status(400).json({ error: 'Invalid quantity: must be at least 1' });
  }
  
  if (quantity > 999) {
    console.error('[Cart Validation Error] Quantity too high:', quantity);
    return res.status(400).json({ error: 'Invalid quantity: maximum is 999' });
  }
  
  next();
}

/**
 * GET /api/cart
 * Get all cart items for mock user with total
 */
router.get('/', (req, res) => {
  try {
    console.log('[GET /api/cart] Fetching cart for user:', MOCK_USER_ID);
    
    // Get all cart items for mock user
    const items = CartItem.findByUserId(MOCK_USER_ID);
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    console.log('[GET /api/cart] Success:', { itemCount: items.length, total });
    res.json({ items, total });
  } catch (error) {
    console.error('[GET /api/cart] Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ error: 'Failed to retrieve cart items. Please try again.' });
  }
});

/**
 * POST /api/cart
 * Add item to cart or update quantity if already exists
 */
router.post('/', validateCartRequest, async (req, res) => {
  const { productId, quantity, id } = req.body;
  
  try {
    console.log('[POST /api/cart] Request:', { id, productId, quantity, userId: MOCK_USER_ID });
    
    // If id is provided, this is an update to an existing cart item
    if (id) {
      console.log('[POST /api/cart] Updating existing cart item:', id);
      const existingItem = CartItem.findById(id);
      
      if (!existingItem) {
        console.error('[POST /api/cart] Cart item not found:', id);
        return res.status(404).json({ error: 'Cart item not found' });
      }
      
      // Update to the new quantity (not adding to it)
      const updatedItem = CartItem.updateQuantity(id, quantity);
      console.log('[POST /api/cart] Updated successfully:', updatedItem.id);
      
      return res.json({ cartItem: updatedItem });
    }
    
    // Check if product already exists in cart
    const existingItem = CartItem.findByUserAndProduct(MOCK_USER_ID, productId);
    
    if (existingItem) {
      console.log('[POST /api/cart] Item exists, updating quantity');
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      // Validate new quantity doesn't exceed maximum
      if (newQuantity > 999) {
        console.error('[POST /api/cart] Quantity would exceed maximum:', newQuantity);
        return res.status(400).json({ error: 'Cannot add more items. Maximum quantity is 999.' });
      }
      
      const updatedItem = CartItem.updateQuantity(existingItem.id, newQuantity);
      console.log('[POST /api/cart] Updated successfully:', updatedItem.id);
      
      return res.json({ cartItem: updatedItem });
    }
    
    // Fetch product details
    console.log('[POST /api/cart] Fetching product details for:', productId);
    const product = await fetchProductDetails(productId);
    
    if (!product) {
      console.error('[POST /api/cart] Product not found:', productId);
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Create new cart item
    const cartItem = CartItem.create({
      userId: MOCK_USER_ID,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image
    });
    
    console.log('[POST /api/cart] Created new cart item:', cartItem.id);
    res.status(201).json({ cartItem });
  } catch (error) {
    console.error('[POST /api/cart] Error:', {
      message: error.message,
      stack: error.stack,
      productId,
      timestamp: new Date().toISOString()
    });
    
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: 'Product not found. Please try another item.' });
    }
    
    if (error.message && error.message.includes('network')) {
      return res.status(503).json({ error: 'Service temporarily unavailable. Please try again.' });
    }
    
    res.status(500).json({ error: 'Failed to add item to cart. Please try again.' });
  }
});

/**
 * DELETE /api/cart/:id
 * Remove item from cart
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  console.log('[DELETE /api/cart/:id] Removing item:', id);
  
  // Validate ID parameter
  const itemId = parseInt(id, 10);
  if (isNaN(itemId) || itemId < 1) {
    console.error('[DELETE /api/cart/:id] Invalid ID:', id);
    return res.status(400).json({ error: 'Invalid cart item ID. Must be a positive number.' });
  }
  
  try {
    // Check if item exists
    const item = CartItem.findById(itemId);
    
    if (!item) {
      console.error('[DELETE /api/cart/:id] Item not found:', itemId);
      return res.status(404).json({ error: 'Cart item not found. It may have already been removed.' });
    }
    
    // Delete the item
    CartItem.delete(itemId);
    
    console.log('[DELETE /api/cart/:id] Successfully removed item:', itemId);
    res.json({ message: 'Cart item removed successfully' });
  } catch (error) {
    console.error('[DELETE /api/cart/:id] Error:', {
      message: error.message,
      stack: error.stack,
      itemId,
      timestamp: new Date().toISOString()
    });
    
    if (error.message === 'Cart item not found') {
      return res.status(404).json({ error: 'Cart item not found. It may have already been removed.' });
    }
    
    res.status(500).json({ error: 'Failed to remove cart item. Please try again.' });
  }
});

export default router;
