import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'

const AllRooms = () => {
  const [searchParams] = useSearchParams();
  const { rooms, navigate, currency } = useAppContext();

  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ roomType: [], priceRange: [] });
  const [selectedSort, setSelectedSort] = useState('');

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = ["0 to 500", "500 to 1000", "1000 to 2000", "2000 to 3000"];
  const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

  // URL se destination param
  const destinationParam = searchParams.get('destination') || '';

  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], value]
        : prev[type].filter((item) => item !== value),
    }));
  };

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && roomTypes.includes(typeParam)) {
      setSelectedFilters(prev => ({ ...prev, roomType: [typeParam] }));
    }
  }, [searchParams]);

  const handleNavigate = (id) => {
    if (id) { navigate(`/room/${id}`); window.scrollTo(0, 0); }
  };

  // FIX: Destination filter — city match karo URL param se
  const matchesDestination = (room) => {
    if (!destinationParam) return true;
    const city = room.hotel?.city?.toLowerCase() || '';
    return city.includes(destinationParam.toLowerCase());
  };

  const matchesRoomType = (room) =>
    selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room.roomType);

  const matchesPriceRange = (room) => {
    if (selectedFilters.priceRange.length === 0) return true;
    return selectedFilters.priceRange.some((range) => {
      const [min, max] = range.split(' to ').map(Number);
      return room.pricePerNight >= min && room.pricePerNight <= max;
    });
  };

  const sortRooms = (a, b) => {
    if (selectedSort === 'Price Low to High') return a.pricePerNight - b.pricePerNight;
    if (selectedSort === 'Price High to Low') return b.pricePerNight - a.pricePerNight;
    if (selectedSort === 'Newest First') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  };

  const filteredRooms = (rooms || [])
    .filter(matchesDestination)
    .filter(matchesRoomType)
    .filter(matchesPriceRange)
    .sort(sortRooms);

  return (
    <div className='flex flex-col lg:flex-row items-start justify-between pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32 gap-10 min-h-screen bg-white'>

      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setOpenFilters(!openFilters)}
        className='lg:hidden bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm'
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
        </svg>
        {openFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filter Sidebar */}
      <div className={`min-w-60 flex-col gap-6 p-6 border border-gray-100 rounded-xl shadow-sm lg:flex ${openFilters ? 'flex w-full' : 'hidden'}`}>
        <div>
          <p className='mb-3 text-sm font-semibold text-gray-800 uppercase tracking-wider'>Category</p>
          <div className='flex flex-col gap-2.5 text-sm font-medium text-gray-600'>
            {roomTypes.map((type) => (
              <label key={type} className='flex gap-2 items-center cursor-pointer hover:text-black'>
                <input className='w-4 h-4 accent-indigo-600 rounded cursor-pointer' type="checkbox" value={type}
                  checked={selectedFilters.roomType.includes(type)}
                  onChange={(e) => handleFilterChange(e.target.checked, type, 'roomType')} />
                {type}
              </label>
            ))}
          </div>
        </div>
        <div className='mt-4'>
          <p className='mb-3 text-sm font-semibold text-gray-800 uppercase tracking-wider'>Price Range</p>
          <div className='flex flex-col gap-2.5 text-sm font-medium text-gray-600'>
            {priceRanges.map((range) => (
              <label key={range} className='flex gap-2 items-center cursor-pointer hover:text-black'>
                <input className='w-4 h-4 accent-indigo-600 rounded cursor-pointer' type="checkbox" value={range}
                  checked={selectedFilters.priceRange.includes(range)}
                  onChange={(e) => handleFilterChange(e.target.checked, range, 'priceRange')} />
                {currency || "₹"}{range}
              </label>
            ))}
          </div>
        </div>
        <div className='mt-4'>
          <p className='mb-3 text-sm font-semibold text-gray-800 uppercase tracking-wider'>Sort By</p>
          <div className='flex flex-col gap-2.5 text-sm font-medium text-gray-600'>
            {sortOptions.map((option) => (
              <label key={option} className='flex gap-2 items-center cursor-pointer hover:text-black'>
                <input className='w-4 h-4 accent-indigo-600 cursor-pointer' type="radio" name="sort" value={option}
                  checked={selectedSort === option} onChange={() => setSelectedSort(option)} />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Rooms List */}
      <div className='flex-1 w-full'>
        <div className='mb-10'>
          <h1 className='font-playfair text-4xl md:text-[40px] font-bold text-gray-900'>Hotel Rooms</h1>
          {/* FIX: Destination search indicator */}
          {destinationParam && (
            <p className='text-indigo-600 text-sm font-medium mt-1'>
              Results for: <span className='font-bold'>"{destinationParam}"</span>
            </p>
          )}
          <p className='text-sm md:text-base text-gray-500 mt-2 font-normal max-w-2xl'>
            Take advantage of our limited-time offers and special packages to enhance your stay.
          </p>
        </div>

        <div className='flex flex-col gap-12'>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <div key={room._id || index} className='flex flex-col md:flex-row gap-8 items-center border-b pb-12 border-gray-100 last:border-b-0'>
                <div className='w-full md:w-[45%] h-64 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm'>
                  {room.images?.[0] ? (
                    <img onClick={() => handleNavigate(room._id)} src={room.images[0]}
                      className='w-full h-full object-cover cursor-pointer hover:scale-105 transition-all duration-500'
                      alt={room.roomType || "Hotel Image"} />
                  ) : (
                    <div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-medium'>No Preview Image</div>
                  )}
                </div>
                <div className='w-full md:w-[55%] flex flex-col gap-2 text-left'>
                  <p className='text-indigo-600 text-xs font-bold uppercase tracking-wider'>{room.hotel?.city || "Luxury Destination"}</p>
                  <h2 className='text-2xl md:text-3xl font-playfair font-bold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors'
                    onClick={() => handleNavigate(room._id)}>
                    {room.hotel?.name || room.roomType}
                  </h2>
                  <div className='flex items-center gap-1 text-amber-400 text-sm mt-1'>
                    <span>★★★★★</span>
                    <span className='text-gray-400 ml-2 text-xs font-medium'>4.9 (240+ reviews)</span>
                  </div>
                  <div className='flex flex-wrap gap-2 mt-3'>
                    {room.amenities?.length > 0 ? (
                      room.amenities.slice(0, 3).map((amenity, i) => (
                        <span key={i} className='bg-gray-50 border border-gray-100 px-3 py-1 rounded-md text-xs font-semibold text-gray-600'>{amenity}</span>
                      ))
                    ) : (
                      <span className='bg-gray-50 border border-gray-100 px-3 py-1 rounded-md text-xs font-semibold text-gray-600'>Room Service</span>
                    )}
                  </div>
                  <p className='text-2xl font-bold text-gray-900 mt-5 flex items-baseline gap-1'>
                    {currency || "₹"}{room.pricePerNight}
                    <span className='text-xs text-gray-400 font-medium uppercase'> / night</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            /* FIX: No results state for destination search */
            <div className='text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200'>
              <p className='text-5xl mb-4'>🏨</p>
              <p className='text-gray-800 font-semibold text-xl mb-2'>
                No hotels found {destinationParam ? `in "${destinationParam}"` : ''}
              </p>
              <p className='text-gray-400 text-sm mb-6'>
                Try searching a different city or clear your filters.
              </p>
              <button
                onClick={() => { setSelectedFilters({ roomType: [], priceRange: [] }); navigate('/rooms'); }}
                className='bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700'
              >
                View All Rooms
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllRooms
