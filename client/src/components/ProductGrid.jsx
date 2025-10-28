import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import Hero from './Hero';
import { getProducts, addToCart, getCart } from '../services/api';
import './ProductGrid.css';

function ProductGrid({ onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Ref for throttling scroll events
  const lastScrollTime = useRef(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Scroll event handler with throttling
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      
      // Throttle: only execute once per 300ms
      if (now - lastScrollTime.current < 300) {
        return;
      }
      
      lastScrollTime.current = now;
      
      // Calculate distance from bottom
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const distanceFromBottom = scrollHeight - innerHeight - scrollY;
      
      // Trigger load more when within 200px of bottom
      if (distanceFromBottom < 200 && hasMore && !isLoadingMore && !loading) {
        console.log('[ProductGrid] Near bottom, loading more products...');
        loadMoreProducts();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, isLoadingMore, loading, page]);

  const loadMoreProducts = async () => {
    // Prevent duplicate requests
    if (isLoadingMore || !hasMore) {
      return;
    }
    
    setIsLoadingMore(true);
    
    try {
      const nextPage = page + 1;
      console.log('[ProductGrid] Loading page', nextPage);
      
      const response = await getProducts(nextPage, 12);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      const productData = response.data.products || response.data;
      
      if (!Array.isArray(productData)) {
        throw new Error('Invalid product data format');
      }
      
      console.log('[ProductGrid] Successfully loaded', productData.length, 'more products');
      
      // Append new products to existing array
      setProducts(prev => [...prev, ...productData]);
      setPage(nextPage);
      
      // Update hasMore state from pagination metadata
      if (response.data.pagination) {
        setHasMore(response.data.pagination.hasMore);
        console.log('[ProductGrid] Updated pagination:', response.data.pagination);
      }
    } catch (err) {
      console.error('[ProductGrid] Error loading more products:', {
        message: err.message,
        userMessage: err.userMessage,
        timestamp: new Date().toISOString()
      });
      
      const errorMessage = err.userMessage || 
                          err.response?.data?.error || 
                          'Failed to load more products. Please try again.';
      
      // Show error notification with retry option
      setNotification(errorMessage);
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[ProductGrid] Fetching products...');
      const response = await getProducts(1, 12);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      const productData = response.data.products || response.data;
      
      if (!Array.isArray(productData)) {
        throw new Error('Invalid product data format');
      }
      
      console.log('[ProductGrid] Successfully loaded', productData.length, 'products');
      setProducts(productData);
      
      // Update pagination state from response
      if (response.data.pagination) {
        setHasMore(response.data.pagination.hasMore);
        console.log('[ProductGrid] Pagination metadata:', response.data.pagination);
      }
    } catch (err) {
      console.error('[ProductGrid] Error fetching products:', {
        message: err.message,
        userMessage: err.userMessage,
        timestamp: new Date().toISOString()
      });
      
      const errorMessage = err.userMessage || 
                          err.response?.data?.error || 
                          'Failed to load products. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      console.log('[ProductGrid] Adding to cart:', { productId, quantity });
      
      await addToCart(productId, quantity);
      
      // Show success notification
      setNotification('Item added to cart!');
      setTimeout(() => setNotification(null), 3000);

      // Update cart count
      try {
        const cartResponse = await getCart();
        const totalItems = cartResponse.data.items.reduce((sum, item) => sum + item.quantity, 0);
        onCartUpdate(totalItems);
      } catch (cartErr) {
        console.error('[ProductGrid] Failed to update cart count:', cartErr);
        // Don't show error to user since item was added successfully
      }
    } catch (err) {
      console.error('[ProductGrid] Error adding to cart:', {
        productId,
        message: err.message,
        userMessage: err.userMessage,
        timestamp: new Date().toISOString()
      });
      
      const errorMessage = err.userMessage || 
                          err.response?.data?.error || 
                          'Failed to add item to cart. Please try again.';
      setNotification(errorMessage);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="product-grid-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-grid-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchProducts} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <div className="product-grid-container">
        {notification && (
          <div className={`notification ${notification.includes('Failed') ? 'error' : 'success'}`}>
            {notification}
          </div>
        )}
        
        <h1 className="page-title">Products</h1>
        
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      
      {/* Loading indicator for infinite scroll */}
      {isLoadingMore && (
        <div className="load-more-indicator" role="status" aria-live="polite">
          <div className="spinner"></div>
          <p>Loading more products...</p>
        </div>
      )}
      
      {/* End of catalog message */}
      {!hasMore && !loading && products.length > 0 && (
        <div className="end-of-catalog">
          <p>You've reached the end of our catalog</p>
        </div>
      )}

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      </div>
    </>
  );
}

ProductGrid.propTypes = {
  onCartUpdate: PropTypes.func.isRequired
};

export default ProductGrid;
