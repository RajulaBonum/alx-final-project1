import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "../assets/styles/paymentSummary.css";
import { FaCheckCircle, FaHome, FaReceipt, FaBoxOpen } from "react-icons/fa";

const PaymentSummaryPage = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState("Success");
  const {
    transaction_id = "N/A",
    order_code = 0,
    total_amount = 0,
    selected_location = "N/A",
  } = location.state || {};

  const downloadReceipt = () => {
    const receiptContent = `
      Payment Receipt
      ----------------------

      Order ID: ${order_code}
      Total Amount: Ksh ${total_amount}
      Payment Status: ${paymentStatus}
      Shipping Location: ${selected_location}
    `;
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `PaymentReceipt_${transaction_id}.txt`;
    link.click();
  };

  return (
    <div className="payment-summary-container">
      <div className="payment-summary-card">
        <div className="summary-header">
          <FaCheckCircle className="success-icon" />
          <h1 className="summary-title">Payment Successful!</h1>
        </div>
        <p className="summary-text">
          Thank you for your payment. Your transaction was successful! 🎉
        </p>
        <div className="summary-details">
          <p>
            <strong>ORDER ID:</strong> {order_code}
          </p>
          <p>
            <strong>Total Amount:</strong> Ksh {total_amount}
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}
            <span
              className={`status ${
                paymentStatus === "Success" ? "success" : "failed"
              }`}
            >
              {paymentStatus}
            </span>
          </p>
          <p>
            <strong>Shipping Location:</strong> {selected_location}
          </p>
        </div>
        <div className="summary-notice">
          <p>
            Your payment is now confirmed. You will receive a confirmation
            email and SMS shortly.
          </p>
          <p>
            For any queries, contact our support team at{" "}
            <strong>+254 792 447497</strong>.
          </p>
        </div>
        <div className="summary-actions">
          <button className="action-button download-button" onClick={downloadReceipt}>
            <FaReceipt /> Download Receipt
          </button>
          <Link to="/" className="action-button home-button">
            <FaHome /> Return to Home
          </Link>
          <Link to="/order-summary" className="action-button orders-button">
            <FaBoxOpen /> View Your Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryPage;
