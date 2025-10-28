import axios from 'axios';

// Configure base URL from environment variable with fallback
const baseURL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging and potential token injection
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.status);
    }
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      console.error('[API Error]', {
        status: error.response.status,
        message: error.response.data?.error || error.response.data?.message || 'An error occurred',
        url: error.config?.url
      });
      
      // Enhance error object with user-friendly message
      error.userMessage = error.response.data?.error || error.response.data?.message || 'An error occurred';
    } else if (error.request) {
      // Request made but no response received
      console.error('[API Network Error]', error.message);
      error.userMessage = 'Network error. Please check your connection and try again.';
    } else {
      // Error in request setup
      console.error('[API Setup Error]', error.message);
      error.userMessage = 'An unexpected error occurred. Please try again.';
    }
    
    return Promise.reject(error);
  }
);

// API service functions with enhanced error handling
export const getProducts = async (page = 1, limit = 12) => {
  try {
    return await api.get('/products', {
      params: { page, limit }
    });
  } catch (error) {
    console.error('[API Service] getProducts failed:', error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    return await api.get('/cart');
  } catch (error) {
    console.error('[API Service] getCart failed:', error);
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    // Validate inputs before making request
    if (!productId || typeof productId !== 'string') {
      throw new Error('Invalid product ID');
    }
    if (typeof quantity !== 'number' || quantity < 1) {
      throw new Error('Quantity must be a positive number');
    }
    
    return await api.post('/cart', { productId, quantity });
  } catch (error) {
    console.error('[API Service] addToCart failed:', { productId, quantity, error });
    throw error;
  }
};

export const updateCartItem = async (id, quantity) => {
  try {
    // Validate inputs
    if (!id) {
      throw new Error('Cart item ID is required');
    }
    if (typeof quantity !== 'number' || quantity < 1) {
      throw new Error('Quantity must be a positive number');
    }
    
    return await api.post('/cart', { id, quantity });
  } catch (error) {
    console.error('[API Service] updateCartItem failed:', { id, quantity, error });
    throw error;
  }
};

export const removeFromCart = async (id) => {
  try {
    if (!id) {
      throw new Error('Cart item ID is required');
    }
    
    return await api.delete(`/cart/${id}`);
  } catch (error) {
    console.error('[API Service] removeFromCart failed:', { id, error });
    throw error;
  }
};

export const checkout = async (cartItems, customerInfo) => {
  try {
    // Validate inputs
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Cart items are required');
    }
    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      throw new Error('Customer information is required');
    }
    
    return await api.post('/checkout', { cartItems, ...customerInfo });
  } catch (error) {
    console.error('[API Service] checkout failed:', { 
      itemCount: cartItems?.length, 
      email: customerInfo?.email,
      error 
    });
    throw error;
  }
};

export default api;
