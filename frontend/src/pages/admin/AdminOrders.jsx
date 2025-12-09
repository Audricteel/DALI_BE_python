import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getOrders(query);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchOrders, 200);
    return () => clearTimeout(timeoutId);
  }, [fetchOrders]);

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return `₱${price.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusClass = (status) => {
    const statusMap = {
      PROCESSING: 'processing',
      SHIPPED: 'shipped',
      DELIVERED: 'delivered',
      CANCELLED: 'cancelled',
    };
    return statusMap[status] || 'processing';
  };

  return (
    <main className="container admin-orders-page-container">
      <div className="admin-orders-header">
        <h1 className="page-title">Track Orders</h1>
        <div className="search-bar-container">
          <input
            type="search"
            name="query"
            className="admin-order-search"
            placeholder="Search by Order ID or Customer Name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div id="order-grid-results">
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="no-orders-found">No orders found.</div>
        ) : (
          <div className="admin-order-grid">
            {orders.map((order) => (
              <div key={order.order_id} className="admin-order-card">
                <div className="order-card-icon">
                  <img src="/images/order-icon.png" alt="Order Icon" />
                </div>
                <div className="order-card-details">
                  <h3>Order #{order.order_id}</h3>
                  <p className="order-card-meta">
                    <span>{formatDate(order.created_at)}</span> •{' '}
                    <span>
                      {order.total_item_count || order.order_items?.length} items
                    </span>{' '}
                    • <span>{order.payment_method}</span>
                  </p>
                  {order.customer && (
                    <p className="order-card-meta">
                      Customer: {order.customer.first_name} {order.customer.last_name}
                    </p>
                  )}
                  <p className="order-card-price">{formatPrice(order.total_price)}</p>
                </div>
                <div className="order-card-footer">
                  <div className="order-card-status">
                    <span
                      className={`status-dot ${getStatusClass(order.shipping_status)}`}
                    ></span>
                    <span>
                      {order.shipping_status_description || order.shipping_status}
                    </span>
                  </div>
                  <div className="order-card-actions">
                    <button
                      onClick={() => handleViewOrder(order.order_id)}
                      className="btn btn-secondary btn-small"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminOrders;
