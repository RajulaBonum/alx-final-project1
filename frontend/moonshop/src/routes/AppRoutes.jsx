import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ProductsPage from '../pages/ProductsPage';
import LoginPage from '../pages/LoginPage';
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import NoPage from '../pages/NoPage';
import api from '../apis/api';
import ProtectedRoute from '../ui/ProtectedRoute';
import { AuthProvider } from '../ui/AuthContext';
import ProfilePage from '../pages/ProfilePage';
import PaymentSummaryPage from '../pages/PaymentSummaryPage';
import OrderSummaryPage from '../pages/OrderSummaryPage';
import ForgotPassword from '../ui/ForgotPassword';
import ResetPassword from '../ui/ResetPassword';
import ChangePassword from '../ui/ChangePassword';


const AppRoutes = () => {
  
  const [numCartItems, setNumItems] = useState(0)
  const cart_code = localStorage.getItem("cart_code")

  useEffect(function() {
    if(cart_code) {
      api.get(`get_cart_stat?cart_code=${cart_code}`)
      .then(res => {
        console.log(res.data)
        setNumItems(res.data.num_of_items)
      }) .catch (err => {
        console.log(err.message)
      })
    }
  }, [])

  return (
    <>
      <AuthProvider>
        <Header numCartItems={numCartItems}/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='*' element={<NoPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:slug" element={<ProductDetailsPage setNumItems={setNumItems}/>} />
          <Route path="/cart" element={<CartPage setNumItems={setNumItems} />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage setNumItems={setNumItems} /></ProtectedRoute>} />
          <Route path='/payment-summary' element={<PaymentSummaryPage />} />
          <Route path='/order-summary' element={<OrderSummaryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path='/change-password' element={<ChangePassword />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </>
  )
}

export default AppRoutes