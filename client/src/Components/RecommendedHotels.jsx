import React, { useEffect, useState } from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useAppContext } from '../context/AppContext'

const RecommendedHotels = () => {
  const { rooms, searchedCities } = useAppContext()
  const [recommended, setRecommended] = useState([])

  useEffect(() => {
    if (!rooms || rooms.length === 0) return;

    // Koi search nahi ki → saare rooms dikhao
    if (!searchedCities || searchedCities.length === 0) {
      setRecommended(rooms);
      return;
    }

    // Search ki city ke rooms filter karo
    const filtered = rooms.filter(room =>
      room.hotel?.city && searchedCities.includes(room.hotel.city)
    );

    // FIX: Searched city ke rooms nahi hain → section HIDE karo
    setRecommended(filtered);

  }, [rooms, searchedCities])

  // Empty → section bilkul nahi dikhega
  if (recommended.length === 0) return null;

  return (
    <div className="flex flex-col items-center bg-slate-50 py-20 px-4 md:px-16 lg:px-24">
      <Title
        title="Recommended Hotels"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16 w-full max-w-[1440px] justify-center">
        {recommended.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id || index} room={room} index={index} />
        ))}
      </div>
    </div>
  )
}

export default RecommendedHotels
