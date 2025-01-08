import React, {useState, useEffect} from 'react'
import api from '../apis/api'
import { toast } from 'react-toastify'

const useCartData = () => {
  const cart_code = localStorage.getItem('cart_code')
  const [cartItems, setCart] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  if (cart_code === null) {
    return <h1 style={{ textAlign: "center" }}>No Available Cart</h1>;
  }

  function clearCart(setNumItems){
    const confirmClear = window.confirm("Are sure you want to clear cart?")

    if(confirmClear){
      setLoading(true)
      api.post("clear_cart/", { cart_code })
      .then(res => {
        console.log(res.data)
        toast.success("Cart cleared")
        setCart([])
        setCartTotal(0)
        setNumItems(0)
        setLoading(false)
      }).catch(err => {
        console.log(err.message)
        toast.error("Failed to clear cart. Please try again!")
        setLoading(false)
      })
    }
  }
  
  

  useEffect(function() {
    setLoading(true)
    api.get(`get_cart?cart_code=${cart_code}`)
    .then (res => {
      console.log(res.data)
      setCart(res.data.items)
      setCartTotal(res.data.sum_total)
      setLoading(false)
    }).catch (err => {
      console.log(err.message)
      //setLoading(false)
    })
  }, [])

  return {cartItems, setCart, cartTotal, setCartTotal, loading, setLoading, cart_code, clearCart}
}

export default useCartData