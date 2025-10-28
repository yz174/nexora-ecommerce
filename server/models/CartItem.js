import { getDatabase } from '../config/database.js';

/**
 * CartItem Model
 * Handles all database operations for cart items
 */
class CartItem {
  /**
   * Find all cart items for a specific user
   * @param {string} userId - User identifier
   * @returns {Array} Array of cart items with calculated subtotals
   */
  static findByUserId(userId = 'mock-user-001') {
    const db = getDatabase();
    
    try {
      const stmt = db.prepare(`
        SELECT id, user_id as userId, product_id as productId, 
               name, price, quantity, image, created_at as createdAt
        FROM cart_items 
        WHERE user_id = ?
        ORDER BY created_at DESC
      `);
      
      const items = stmt.all(userId);
      
      // Add calculated subtotal to each item
      return items.map(item => ({
        ...item,
        subtotal: item.price * item.quantity
      }));
    } catch (error) {
      console.error('Error finding cart items:', error);
      throw new Error(`Failed to retrieve cart items: ${error.message}`);
    }
  }

  /**
   * Find a cart item by ID
   * @param {number} id - Cart item ID
   * @returns {Object|null} Cart item with subtotal or null if not found
   */
  static findById(id) {
    const db = getDatabase();
    
    try {
      const stmt = db.prepare(`
        SELECT id, user_id as userId, product_id as productId, 
               name, price, quantity, image, created_at as createdAt
        FROM cart_items 
        WHERE id = ?
      `);
      
      const item = stmt.get(id);
      
      if (!item) {
        return null;
      }
      
      return {
        ...item,
        subtotal: item.price * item.quantity
      };
    } catch (error) {
      console.error('Error finding cart item by ID:', error);
      throw new Error(`Failed to retrieve cart item: ${error.message}`);
    }
  }

  /**
   * Find a cart item by user ID and product ID
   * @param {string} userId - User identifier
   * @param {string} productId - Product identifier
   * @returns {Object|null} Cart item or null if not found
   */
  static findByUserAndProduct(userId, productId) {
    const db = getDatabase();
    
    try {
      const stmt = db.prepare(`
        SELECT id, user_id as userId, product_id as productId, 
               name, price, quantity, image, created_at as createdAt
        FROM cart_items 
        WHERE user_id = ? AND product_id = ?
      `);
      
      const item = stmt.get(userId, productId);
      
      if (!item) {
        return null;
      }
      
      return {
        ...item,
        subtotal: item.price * item.quantity
      };
    } catch (error) {
      console.error('Error finding cart item by user and product:', error);
      throw new Error(`Failed to retrieve cart item: ${error.message}`);
    }
  }

  /**
   * Create a new cart item
   * @param {Object} itemData - Cart item data
   * @returns {Object} Created cart item with subtotal
   */
  static create(itemData) {
    const db = getDatabase();
    const { userId = 'mock-user-001', productId, name, price, quantity, image } = itemData;
    
    // Validate required fields
    if (!productId || !name || price === undefined || !quantity) {
      throw new Error('Missing required fields: productId, name, price, and quantity are required');
    }
    
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    
    try {
      const stmt = db.prepare(`
        INSERT INTO cart_items (user_id, product_id, name, price, quantity, image)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(userId, productId, name, price, quantity, image || null);
      
      // Return the created item
      return this.findById(result.lastInsertRowid);
    } catch (error) {
      // Handle unique constraint violation
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Item already exists in cart. Use update instead.');
      }
      console.error('Error creating cart item:', error);
      throw new Error(`Failed to create cart item: ${error.message}`);
    }
  }

  /**
   * Update cart item quantity
   * @param {number} id - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Object} Updated cart item with subtotal
   */
  static updateQuantity(id, quantity) {
    const db = getDatabase();
    
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    
    try {
      const stmt = db.prepare(`
        UPDATE cart_items 
        SET quantity = ?
        WHERE id = ?
      `);
      
      const result = stmt.run(quantity, id);
      
      if (result.changes === 0) {
        throw new Error('Cart item not found');
      }
      
      return this.findById(id);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw new Error(`Failed to update cart item: ${error.message}`);
    }
  }

  /**
   * Delete a cart item
   * @param {number} id - Cart item ID
   * @returns {boolean} True if deleted successfully
   */
  static delete(id) {
    const db = getDatabase();
    
    try {
      const stmt = db.prepare(`
        DELETE FROM cart_items 
        WHERE id = ?
      `);
      
      const result = stmt.run(id);
      
      if (result.changes === 0) {
        throw new Error('Cart item not found');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting cart item:', error);
      throw new Error(`Failed to delete cart item: ${error.message}`);
    }
  }

  /**
   * Delete all cart items for a user
   * @param {string} userId - User identifier
   * @returns {number} Number of items deleted
   */
  static deleteAllByUserId(userId = 'mock-user-001') {
    const db = getDatabase();
    
    try {
      const stmt = db.prepare(`
        DELETE FROM cart_items 
        WHERE user_id = ?
      `);
      
      const result = stmt.run(userId);
      return result.changes;
    } catch (error) {
      console.error('Error deleting cart items:', error);
      throw new Error(`Failed to delete cart items: ${error.message}`);
    }
  }

  /**
   * Calculate total for all cart items for a user
   * @param {string} userId - User identifier
   * @returns {number} Total amount
   */
  static calculateTotal(userId = 'mock-user-001') {
    const items = this.findByUserId(userId);
    return items.reduce((total, item) => total + item.subtotal, 0);
  }
}

export default CartItem;
