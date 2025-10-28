import { useState } from 'react';
import PropTypes from 'prop-types';
import './ProductDetailModal.css';

function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [imageStatus, setImageStatus] = useState('loading');

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
    onClose();
  };

  const handleImageError = () => {
    setImageStatus('error');
  };

  const handleImageLoad = () => {
    setImageStatus('success');
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">PRODUCT DETAILS</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="product-detail-image-container">
            {imageStatus === 'error' ? (
              <div className="product-detail-image-placeholder">
                <span className="product-detail-placeholder-text">{product.name}</span>
              </div>
            ) : (
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-detail-image"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            )}
          </div>

          <div className="product-detail-info">
            <h3 className="product-detail-name">{product.name}</h3>
            <p className="product-detail-price">€{product.price.toFixed(2)}</p>
            
            {product.description && (
              <div className="product-detail-description">
                <h4 className="description-title">Description</h4>
                <p className="description-text">{product.description}</p>
              </div>
            )}

            <div className="quantity-selector">
              <label className="quantity-label">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn" 
                  onClick={decrementQuantity}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn" 
                  onClick={incrementQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="add-to-cart-modal-btn" onClick={handleAddToCart}>
            ADD TO BAG
          </button>
        </div>
      </div>
    </div>
  );
}

ProductDetailModal.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired
};

export default ProductDetailModal;
