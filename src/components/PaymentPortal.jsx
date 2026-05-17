import { useState } from 'react';
import { getOrder, payOrder } from '../api/client';
import './PaymentPortal.css';

const PaymentPortal = ({ orderDetails, onCancel, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentError('');
    setIsProcessing(true);

    try {
      await payOrder(orderDetails.id);
      await new Promise((r) => setTimeout(r, 1000));

      const { order } = await getOrder(orderDetails.id);
      if (order.status !== 'paid') {
        throw new Error('Payment is still processing. Please try again in a moment.');
      }

      onSuccess(order);
    } catch (err) {
      setPaymentError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal glass-panel animate-fade-in">
        <button className="close-btn" onClick={onCancel}>✖</button>
        
        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Secure Checkout 🔒</h2>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Name:</span>
            <span>{orderDetails.name}</span>
          </div>
          <div className="summary-row">
            <span>Service:</span>
            <span style={{textTransform: 'capitalize'}}>{orderDetails.tier} Proofreading</span>
          </div>
          <div className="summary-row">
            <span>Words:</span>
            <span>{orderDetails.wordCount}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total-row">
            <span>Total:</span>
            <span className="text-gradient">${orderDetails.totalCost}</span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-group">
            <label className="form-label">Card Information</label>
            <div className="card-input-wrapper">
              <input 
                type="text" 
                className="form-control card-number" 
                placeholder="1234 5678 9101 1121" 
                required 
              />
              <div className="card-details">
                <input type="text" className="form-control" placeholder="MM/YY" required />
                <input type="text" className="form-control" placeholder="CVC" required />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Name on Card</label>
            <input 
              type="text" 
              className="form-control" 
              defaultValue={orderDetails.name} 
              required 
            />
          </div>

          {paymentError && (
            <p className="form-error" role="alert">{paymentError}</p>
          )}

          <button 
            type="submit" 
            className="btn btn-primary submit-payment-btn"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing... ⏳' : `Pay $${orderDetails.totalCost} Now 💳`}
          </button>
          
          <div className="payment-footer">
            <p>🔒 256-bit TLS Encryption. Payments are securely processed.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPortal;
