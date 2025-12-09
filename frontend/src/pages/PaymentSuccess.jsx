import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { checkoutService } from '../services';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const transactionId = searchParams.get('transactionId');
      const orderIdParam = searchParams.get('orderId');

      if (!transactionId || !orderIdParam) {
        setError('Invalid payment confirmation link.');
        setLoading(false);
        return;
      }

      try {
        await checkoutService.confirmPayment(orderIdParam, transactionId);
        await clearCart();
        setOrderId(orderIdParam);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to confirm payment.');
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams, clearCart]);

  if (loading) {
    return (
      <div className="order-success-page">
        <div className="success-card">
          <h2>Processing Payment...</h2>
          <p>Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-success-page">
        <div className="success-card">
          <h2>Payment Error</h2>
          <div className="auth-error">{error}</div>
          <div className="success-actions" style={{ marginTop: '20px' }}>
            <Link to="/profile" className="btn btn-primary">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="success-card">
        <img src="/images/order-success.png" alt="Payment Successful" />
        <h2>Payment Successful!</h2>
        <p>
          Your payment has been confirmed. Order ID: <strong>#{orderId}</strong>
        </p>
        <p>Thank you for your purchase!</p>
        <div className="success-actions">
          <Link to="/shop" className="btn btn-secondary">
            Continue Shopping
          </Link>
          <Link to="/profile" className="btn btn-primary">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
