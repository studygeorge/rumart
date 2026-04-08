import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import CartComponent from '@/components/cart/Cart'
import './Cart.css'

const CartPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="cart-page">
        <CartComponent />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}

export default CartPage
