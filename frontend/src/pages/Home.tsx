import React from 'react'
import Header from '../components/layout/Header'
import PromoBanner from '../components/ui/PromoBanner'
import Hero from '../components/ui/Hero'
import Bestsellers from '../components/ui/Bestsellers'
import Categories from '../components/ui/Categories'
import Features from '../components/ui/Features'
import Footer from '../components/layout/Footer'
import MobileBottomNav from '../components/layout/MobileBottomNav'

const Home: React.FC = () => {
  return (
    <>
      <Header cartItemsCount={0} />
      <PromoBanner />
      <main>
        <Hero />
        <Bestsellers />
        <Categories />
        <Features />
      </main>
      <Footer />
      <MobileBottomNav cartItemsCount={0} favoritesCount={0} />
    </>
  )
}

export default Home
