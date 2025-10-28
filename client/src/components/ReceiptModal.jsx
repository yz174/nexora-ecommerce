import PropTypes from 'prop-types';
import './ReceiptModal.css';

function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null;

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">ORDER CONFIRMED</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="receipt-section">
            <div className="receipt-row">
              <span className="receipt-label">Order ID:</span>
              <span className="receipt-value">{receipt.orderId}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Date:</span>
              <span className="receipt-value">{formatDate(receipt.timestamp)}</span>
            </div>
          </div>

          <div className="receipt-section">
            <h3 className="section-title">Customer Information</h3>
            <div className="receipt-row">
              <span className="receipt-label">Name:</span>
              <span className="receipt-value">{receipt.customer.name}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Email:</span>
              <span className="receipt-value">{receipt.customer.email}</span>
            </div>
          </div>

          <div className="receipt-section">
            <h3 className="section-title">Order Items</h3>
            <div className="receipt-items">
              {receipt.items.map((item, index) => (
                <div key={index} className="receipt-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-details">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                  <span className="item-subtotal">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="receipt-total">
            <span className="total-label">TOTAL</span>
            <span className="total-amount">${receipt.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

ReceiptModal.propTypes = {
  receipt: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    timestamp: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        subtotal: PropTypes.number.isRequired
      })
    ).isRequired,
    customer: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    }).isRequired
  }),
  onClose: PropTypes.func.isRequired
};

export default ReceiptModal;
