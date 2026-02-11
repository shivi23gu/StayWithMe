import React, { useState } from 'react'
import { roomsDummyData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const AllRooms = () => {
  const navigate = useNavigate();

  // State for filters
  const [category, setCategory] = useState([]);
  const [sortOrder, setSortOrder] = useState('relevant');

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  // ✅ Navigate safely
  const handleNavigate = (id) => {
    if (id) {
      navigate(`/room/${id}`);
      window.scrollTo(0, 0);
    } else {
      console.error("Room ID is undefined. Cannot navigate.", id);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 gap-10'>
      
      {/* --- FILTER SIDEBAR --- */}
      <div className='min-w-60 flex-col gap-6 p-6 border border-gray-100 rounded-lg shadow-sm hidden lg:flex'>
        {/* Category Filter */}
        <div>
          <p className='mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wider'>Category</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-600'>
            {['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'].map((type) => (
              <p key={type} className='flex gap-2 items-center'>
                <input
                  className='w-4 h-4 accent-black'
                  type="checkbox"
                  value={type}
                  onChange={toggleCategory}
                />
                {type}
              </p>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className='mt-4'>
          <p className='mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wider'>Price Range</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-600'>
            {['$ 0 to 500', '$ 500 to 1000', '$ 1000 to 2000', '$ 2000 to 3000'].map((range) => (
              <p key={range} className='flex gap-2 items-center'>
                <input className='w-4 h-4 accent-black' type="checkbox" value={range} />
                {range}
              </p>
            ))}
          </div>
        </div>

        {/* Sort By Filter */}
        <div className='mt-4'>
          <p className='mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wider'>Sort By</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-600'>
            <p className='flex gap-2 items-center'>
              <input className='w-4 h-4 accent-black' type="radio" name="sort" value="lowHigh" />
              Price Low to High
            </p>
            <p className='flex gap-2 items-center'>
              <input className='w-4 h-4 accent-black' type="radio" name="sort" value="highLow" />
              Price High to Low
            </p>
            <p className='flex gap-2 items-center'>
              <input className='w-4 h-4 accent-black' type="radio" name="sort" value="newest" />
              Newest First
            </p>
          </div>
        </div>
      </div>

      {/* --- ROOMS LIST --- */}
      <div className='flex-1'>
        <div className='mb-10'>
          <h1 className='font-playfair text-4xl md:text-[40px] text-gray-900'>Hotel Rooms</h1>
          <p className='text-sm md:text-base text-gray-500 mt-2'>
            Take advantage of our limited-time offers and special packages to enhance your stay.
          </p>
        </div>

        <div className='flex flex-col gap-12'>
          {roomsDummyData.map((room, index) => (
            <div key={index} className='flex flex-col md:flex-row gap-8 items-center border-b pb-12 border-gray-50'>
              
              {/* Room Image */}
              <div className='w-full md:w-[45%] h-64 overflow-hidden rounded-2xl'>
                {room.images?.[0] ? (
                  <img
                    onClick={() => handleNavigate(room._id)}
                    src={room.images[0]}
                    className='w-full h-full object-cover cursor-pointer hover:scale-110 transition-all duration-500'
                    alt={room.hotel?.name || "Room Image"}
                  />
                ) : (
                  <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                    No Image
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div className='w-full md:w-[55%] flex flex-col gap-2'>
                <p className='text-gray-400 text-sm'>{room.hotel?.city || "Unknown City"}</p>

                <h2
                  className='text-2xl md:text-3xl font-playfair text-gray-800 cursor-pointer'
                  onClick={() => handleNavigate(room._id)}
                >
                  {room.hotel?.name || "Unknown Hotel"}
                </h2>

                <div className='flex items-center gap-1 text-orange-400 text-sm'>
                  <p>★★★★☆</p>
                  <span className='text-gray-400 ml-2'>200+ reviews</span>
                </div>

                <div className='flex gap-3 mt-2'>
                  <span className='bg-gray-100 px-3 py-1 rounded text-xs text-gray-600'>Room Service</span>
                  <span className='bg-gray-100 px-3 py-1 rounded text-xs text-gray-600'>Mountain View</span>
                </div>

                <p className='text-xl font-medium text-gray-900 mt-4'>
                  ${room.price || "N/A"}
                  <span className='text-sm text-gray-500 font-normal'> /night</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllRooms
