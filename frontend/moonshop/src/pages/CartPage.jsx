import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/cart.css";
import CartItem from '../components/CartItem';
import useCartData from '../hooks/useCartData';
import Spinner from '../components/Spinner';


const CartPage = ({setNumItems}) => {
  const navigate = useNavigate();
  const {cartItems, setCart, cartTotal, setCartTotal, loading, setLoading, clearCart} = useCartData()
  const cart_code = localStorage.getItem("cart_code")
  console.log(cart_code)
  console.log(cartItems.total)

  if (cart_code === null) {
    return <h1 style={{ textAlign: "center" }}>No Available Cart</h1>;
  }

function toClear(){
  clearCart(setNumItems)
}
  

if (loading) {
    return <Spinner /> 
}
                    
  
  return (
    <div className="cart-page">
      <h1 className="cart-header">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart">
          Your cart is empty.{" "}
          <Link to="/products" className="back-to-products">
            Go back to Products
          </Link>
        </p>
      ) : (<>
            {cartItems.map(item => 
              <CartItem 
              key={item.id} 
              item={item} 
              cartItems={cartItems} 
              setCartTotal={setCartTotal} 
              setNumItems={setNumItems}
              setCart={setCart}/>
            )}

            <div className="cart-summary">
              <h2>Total: Ksh {cartTotal}</h2>
              <button 
                className="clear-cart-btn"
                onClick={toClear}>
                Clear Cart
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="checkout-btn"
              >
                Checkout
              </button>
              <Link to="/products" className="back-to-products-btn">
                Back to Products
              </Link>
            </div>
            </>
      )}
    </div>
  )
}

export default CartPage