import { useState } from 'react';
import PropTypes from 'prop-types';
import './ProductCard.css';

function ProductCard({ product, onAddToCart, onProductClick }) {
  const [imageStatus, setImageStatus] = useState('loading');

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product.id, 1);
  };

  const handleImageError = () => {
    setImageStatus('error');
  };

  const handleImageLoad = () => {
    setImageStatus('success');
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        {imageStatus === 'error' ? (
          <div className="product-image-placeholder">
            <span className="product-image-placeholder-text">{product.name}</span>
          </div>
        ) : (
          <img 
            src={product.image} 
            alt={product.name} 
            className={`product-image ${imageStatus === 'loading' ? 'product-image-loading' : ''}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">€{product.price.toFixed(2)}</p>
        <button 
          className="add-to-cart-btn" 
          onClick={handleAddToCart}
        >
          ADD TO BAG
        </button>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onProductClick: PropTypes.func
};

export default ProductCard;
