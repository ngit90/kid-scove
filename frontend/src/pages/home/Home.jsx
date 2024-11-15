import React from 'react'
import Banner from './Banner'
import Categories from './Categories'
import TrendingProducts from '../shop/TrendingProducts'
import DealsSection from './DealsSection'
import PromoBanner from './PromoBanner'

const Home = () => {
  return (
    <>
    <Banner/>
    <Categories/>
    <TrendingProducts/>
    <DealsSection/>
    <PromoBanner/>
    </>
  )
}

export default Home