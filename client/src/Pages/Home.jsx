import React from 'react'
import Hero from '../Components/Hero'
import FeauturedDestination from '../Components/FeauturedDestination'
import ExclusiveOffers from '../Components/ExclusiveOffers'
import Testimonial from '../Components/Testimonial'
import NewaLetter from '../Components/NewaLetter'
import Footer from '../Components/Footer'
import RecommendedHotels from '../Components/RecommendedHotels'

const Home = () => {
  return (
    <div>
      <Hero/>
      <FeauturedDestination/>
      <ExclusiveOffers/>
      <Testimonial/>
      <NewaLetter/>
    </div>
  )
}

export default Home