import React, { useState } from 'react'
import '../assets/styles/cart.css';
import Form from "react-bootstrap/Form";
import api from '../apis/api';
import { toast } from 'react-toastify';

const CartItem = ({item, setCartTotal, cartItems, setNumItems, setCart}) => {
    const baseurl = "http://127.0.0.1:8000"
    const [quantity, setQuantity] = useState(item.quantity)
    const [loading, setLoading] = useState(false)
    console.log(item)
    const itemData = {quantity, item_id:item.id}
    const itemId = {item_id:item.id}
    console.log(itemId)

    function updateCartItem(){
        setLoading(true)
        api.patch("update_quantity/", itemData)
        .then(res => {
            setLoading(false)
            toast.success("CartItem updated successfully!")
            console.log(res.data)
            setCartTotal(cartItems.map((cartitem) => cartitem.id === item.id ? res.data.data : cartitem)
            .reduce((acc, curr) => acc + curr.total, 0))

            setNumItems(cartItems.map((cartitem) => cartitem.id === item.id ? res.data.data : cartitem)
            .reduce((acc, curr) => acc + curr.quantity, 0))
    })
        .catch(err => {
            console.log(err.message)
            setLoading(false)
        }
        )
    }


    //Function to delete an item from the cart
    function deleteCartItem(){
      const confirmDelete = window.confirm("Are you sure you want to delete this cart item")

      if(confirmDelete) {
        api.post("delete_cartitem/", itemId)
        .then(res => {
          console.log(res.data)
          toast.success("Cartitem sucessfully removed from cart!")
          setCart(cartItems.filter(cartitem => cartitem.id != item.id))
          setCartTotal(cartItems.filter(cartitem => cartitem.id != item.id)
          .reduce((acc, curr) => acc + curr.total, 0))

          setNumItems(cartItems.filter(cartitem => cartitem.id != item.id)
          .reduce((acc, curr) => acc + curr.quantity, 0))
        }).catch(err => {
          console.log(err.message)
        })
      }
    }


  return (
    <div>
        <div className="cart-container">
            <div className="cart-item">
              <img
                src={`${baseurl}${item.product.image}`}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h2 className="cart-item-title">{}</h2>
                <p className="cart-item-price">
                  Ksh {item.product.price}
                </p>
              </div>
              <Form>
                <Form.Group controlId="quantity" className="mt-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                  />
                </Form.Group>
              </Form>
              <button
                className="update-btn"
                onClick={updateCartItem}
                disabled={loading}
              >
                {loading ? "Updatin" : "Update"}
              </button>
              <button
                className="remove-btn"
                onClick={deleteCartItem}
              >
                Remove
              </button>
            </div>
        </div>
    </div>
  )
}

export default CartItem