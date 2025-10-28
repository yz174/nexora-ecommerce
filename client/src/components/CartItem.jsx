import PropTypes from 'prop-types';
import './CartItem.css';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image-container">
        <img 
          src={item.image} 
          alt={item.name} 
          className="cart-item-image"
        />
      </div>
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-price">${item.price.toFixed(2)}</p>
      </div>
      <div className="cart-item-quantity">
        <label htmlFor={`quantity-${item.id}`} className="quantity-label">
          QTY
        </label>
        <input
          id={`quantity-${item.id}`}
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="quantity-input"
        />
      </div>
      <div className="cart-item-subtotal">
        <p className="subtotal-label">SUBTOTAL</p>
        <p className="subtotal-amount">${item.subtotal.toFixed(2)}</p>
      </div>
      <button 
        className="remove-btn" 
        onClick={handleRemove}
        aria-label="Remove item"
      >
        REMOVE
      </button>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    subtotal: PropTypes.number.isRequired,
    image: PropTypes.string
  }).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default CartItem;
