import React, { useEffect, useState } from 'react';
import '../assets/styles/orderSummary.css';
import { Link } from "react-router-dom";
import api from '../apis/api';

const OrderSummaryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('get_orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        console.log(response.data.orders)
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="order-summary-loading">Loading orders...</div>;
  if (error) return <div className="order-summary-error">{error}</div>;

  return (
    <div className="order-summary-container">
      <h1 className="order-summary-title">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="order-summary-empty">You have no orders at the moment.</p>
      ) : (
        <div className="order-summary-list">
          {orders.map((order) => (
            <div key={order.id} className="order-summary-card">
              <div className="order-header">
                <h2 className="order-code">Order: {order.order_code}</h2>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <p><strong>Transaction ID:</strong> {order.transaction_id}</p>
              <p><strong>Total Amount:</strong> Ksh {order.total_amount}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              <div className="order-items">
                <h3>Items:</h3>
                <ul>
                  {order.cart.items.map((item) => (
                    <li key={item.id} className="order-item">
                      {item.product.name} (x{item.quantity}) - Ksh {item.total}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="back-to-products">
        <Link to="/products" className="back-to-products-btn">
          Back to Products
        </Link>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
