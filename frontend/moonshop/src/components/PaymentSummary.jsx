import React, { useEffect } from 'react';
import api from '../apis/api';

const PaymentSummary = ({ transaction_id }) => {
  useEffect(() => {
    if (!transaction_id) {
      console.warn("No transaction ID provided.");
      return;
    }

    api.post('mpesa/check-online/', { transaction_id })
      .then(res => {
        console.log("Transaction Status:", res.data);
      })
      .catch(err => {
        console.error("Error fetching transaction status:", err.message);
      });
  }, [transaction_id]);

  return (
    <div>
      <p>Checking payment status...</p>
    </div>
  );
};

export default PaymentSummary;
