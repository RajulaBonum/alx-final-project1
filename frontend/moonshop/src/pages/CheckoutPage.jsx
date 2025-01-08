import React, { useState, useEffect } from "react";
import "../assets/styles/checkout.css";
import useCartData from "../hooks/useCartData";
import OrderItem from "../components/orderItem";
import { Link, useNavigate } from "react-router-dom";
import api from "../apis/api";
import { toast } from "react-toastify";
import useUserData from "../hooks/useUserData";

const CheckoutPage = ({ setNumItems }) => {
  const { cartItems, cartTotal, cart_code, clearCart } = useCartData();
  const {userInfo} = useUserData();
  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentOption, setPaymentOption] = useState("stk");
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("get_shipping_locations")
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch shipping locations:", error);
      });

    if (cartItems.quantity === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const calculateGrandTotal = () => {
    return Number(cartTotal || 0) + Number(shippingPrice || 0);
  };

  const handleLocationChange = (e) => {
    const selected = locations.find(
      (location) => location.id === parseInt(e.target.value)
    );
    setSelectedLocation(selected);
    setShippingPrice(selected?.shipping_price || 0);
  };

  const handleConfirmPayment = async (txnId) => {
    const idToUse = txnId || transactionId;
    if (!idToUse) {
      alert("No transaction ID found. Please try initiating payment again.");
      return;
    }

    try {
      const total = calculateGrandTotal();
      const res = await api.post("mpesa/check-online/", { transaction_id: idToUse, user_email: userInfo.email, user_name: userInfo.username, total_amount: total });
      const data = res.data;

      if (data?.status) {
        const fullTotal = calculateGrandTotal();

        const orderData = {
          transaction_id: `TXN_${Date.now()}`,
          cart_code,
          shipping_location: selectedLocation?.id,
          total_amount: fullTotal,
        };

        const orderResponse = await api.post("create_order/", orderData);
        const orderCode = orderResponse?.data?.order_code;

        if (!orderCode) {
          alert("Failed to create order. Please try again.");
          return;
        }

        clearCart(setNumItems);

        navigate("/payment-summary", {
          state: {
            transaction_id: idToUse,
            order_code: orderCode,
            total_amount: fullTotal,
            selected_location: selectedLocation?.county_name,
          },
        });
      } else {
        alert("Payment verification failed. Please try again.");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      toast.error("Failed to verify payment. Please wait and try again");
      navigate("/cart");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSTKPush = async () => {
    if (!/^(7|1)\d{8}$/.test(mobileNumber)) {
      alert("Please enter a valid Kenyan phone number.");
      return;
    }

    setIsProcessing(true);
    const fullMobileNumber = `254${mobileNumber}`;
    const paymentInfo = { mobileNumber: fullMobileNumber, cartTotal, cart_code };

    try {
      const response = await api.post("mpesa/submit/", paymentInfo);
      const data = response.data || {};
      console.log(data);

      if (data.status === "ok" && data.transaction_id) {
        toast.success("STK Push initiated! Please check your phone to complete payment.")
        await new Promise((resolve) => setTimeout(resolve, 10000));
        await handleConfirmPayment(data.transaction_id);
      } else {
        alert(data.message || "Failed to initiate STK Push. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating STK Push:", error);
      toast.error("An unexpected error occurred. Please try again.");
      navigate("/cart");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualPayment = () => {
    alert(
      `Please pay Ksh ${calculateGrandTotal()} to the following details:\n\nPaybill Number: 123456\nAccount Number: Your Order ID`
    );
  };

  const isConfirmDisabled =
    isProcessing ||
    !selectedLocation ||
    (paymentOption === "stk" && mobileNumber.length < 9);

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <div className="cart-summary">
          <h2>Your Cart Summary</h2>
          {cartItems.length === 0 ? (
            <p>
              Your cart is empty. <Link to="/products">Go back to Products</Link>
            </p>
          ) : (
            cartItems.map((item) => <OrderItem key={item.id} item={item} />)
          )}
          <h3>Total: Ksh {cartTotal}</h3>
        </div>

        <div className="shipping-details">
          <h2>Shipping Details</h2>
          <select
            onChange={handleLocationChange}
            className="shipping-dropdown"
            value={selectedLocation?.id || ""}
          >
            <option value="">Select your location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.county_name} (Ksh {location.shipping_price})
              </option>
            ))}
          </select>
          <h3>Shipping Fee: Ksh {shippingPrice}</h3>
          <h3>Grand Total: Ksh {calculateGrandTotal()}</h3>
        </div>
      </div>

      <div className="payment-section">
        <h3>Payment Method</h3>
        <label>
          <input
            type="radio"
            name="paymentOption"
            value="stk"
            checked={paymentOption === "stk"}
            onChange={() => setPaymentOption("stk")}
          />
          Pay via M-Pesa (STK Push)
        </label>
        <label>
          <input
            type="radio"
            name="paymentOption"
            value="manual"
            checked={paymentOption === "manual"}
            onChange={() => setPaymentOption("manual")}
          />
          Pay Manually
        </label>
        {paymentOption === "stk" && (
          <div className="stk-details">
            <label>Enter your M-Pesa Number</label>
            <div className="num-input">
              <p>+254</p>
              <input
                type="text"
                placeholder="712345678"
                value={mobileNumber}
                onChange={(e) =>
                  setMobileNumber(e.target.value.replace(/\D/g, ""))
                }
                maxLength="9"
              />
            </div>
          </div>
        )}
        <button
          className="checkout-button"
          onClick={paymentOption === "stk" ? handleSTKPush : handleManualPayment}
          disabled={isConfirmDisabled}
        >
          {isProcessing ? "Processing..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
