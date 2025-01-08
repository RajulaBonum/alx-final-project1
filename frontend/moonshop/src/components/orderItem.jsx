import React from 'react'

const OrderItem = ({item}) => {
    const baseurl = "http://127.0.0.1:8000"

  return (
    <div className="cart-container">
        <div className="cart-item">
            <img
            src={`${baseurl}${item.product.image}`}
            alt={item.name}
            className="cart-item-image"
            />
            <div className="cart-item-details">
            <h2 className="cart-item-title">{item.name}</h2>
            <p className="cart-item-price">
                Ksh {item.product.price}
            </p>
            <p>{item.quantity}</p>
            </div>
        </div>
    </div>
  )
}

export default OrderItem