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

  const FilterPanel = () => (
    <div className="flex flex-col gap-6 p-6 border border-gray-100 rounded-xl shadow-sm w-full">
      {/* Room Type */}
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-800 uppercase tracking-wider">Category</p>
        <div className="flex flex-col gap-2.5 text-sm font-medium text-gray-600">
          {roomTypes.map((type) => (
            <label key={type} className="flex gap-2 items-center cursor-pointer hover:text-black">
              <input
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                type="checkbox"
                value={type}
                checked={selectedFilters.roomType.includes(type)}
                onChange={(e) => handleFilterChange(e.target.checked, type, 'roomType')}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-800 uppercase tracking-wider">Price Range</p>
        <div className="flex flex-col gap-2.5 text-sm font-medium text-gray-600">
          {priceRanges.map((range) => (
            <label key={range} className="flex gap-2 items-center cursor-pointer hover:text-black">
              <input
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                type="checkbox"
                value={range}
                checked={selectedFilters.priceRange.includes(range)}
                onChange={(e) => handleFilterChange(e.target.checked, range, 'priceRange')}
              />
              {currency || "₹"}{range}
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-800 uppercase tracking-wider">Sort By</p>
        <div className="flex flex-col gap-2.5 text-sm font-medium text-gray-600">
          {sortOptions.map((option) => (
            <label key={option} className="flex gap-2 items-center cursor-pointer hover:text-black">
              <input
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
                type="radio"
                name="sort"
                value={option}
                checked={selectedSort === option}
                onChange={() => setSelectedSort(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedFilters.roomType.length > 0 || selectedFilters.priceRange.length > 0 || selectedSort) && (
        <button
          onClick={() => { setSelectedFilters({ roomType: [], priceRange: [] }); setSelectedSort(''); }}
          className="text-xs text-red-500 hover:text-red-700 font-medium text-left transition"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32 min-h-screen bg-white pb-20">

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setOpenFilters(!openFilters)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
          </svg>
          {openFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Mobile Filter Panel - slides in */}
        {openFilters && (
          <div className="mt-3 w-full">
            <FilterPanel />
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-10">

        {/* Sidebar - Desktop only */}
        <div className="hidden lg:block w-60 shrink-0 sticky top-36 self-start">
          <FilterPanel />
        </div>

        {/* Rooms List */}
        <div className="flex-1 w-full min-w-0">
          <div className="mb-10">
            <h1 className="font-playfair text-4xl md:text-[40px] font-bold text-gray-900">Hotel Rooms</h1>
            {destinationParam && (
              <p className="text-indigo-600 text-sm font-medium mt-1">
                Results for: <span className="font-bold">"{destinationParam}"</span>
              </p>
            )}
            <p className="text-sm md:text-base text-gray-500 mt-2 font-normal max-w-2xl">
              Take advantage of our limited-time offers and special packages to enhance your stay.
            </p>
          </div>

          <div className="flex flex-col gap-12">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room, index) => (
                <div key={room._id || index} className="flex flex-col md:flex-row gap-8 items-center border-b pb-12 border-gray-100 last:border-b-0">
                  <div className="w-full md:w-[45%] h-64 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm shrink-0">
                    {room.images?.[0] ? (
                      <img
                        onClick={() => handleNavigate(room._id)}
                        src={room.images[0]}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-all duration-500"
                        alt={room.roomType || "Hotel Image"}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-medium">No Preview Image</div>
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-2 text-left">
                    <p className="text-indigo-600 text-xs font-bold uppercase tracking-wider">{room.hotel?.city || "Luxury Destination"}</p>
                    <h2
                      className="text-2xl md:text-3xl font-playfair font-bold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => handleNavigate(room._id)}
                    >
                      {room.hotel?.name || room.roomType}
                    </h2>
                    <p className="text-sm text-gray-500">{room.roomType}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {room.amenities?.length > 0 ? (
                        room.amenities.slice(0, 3).map((amenity, i) => (
                          <span key={i} className="bg-gray-50 border border-gray-100 px-3 py-1 rounded-md text-xs font-semibold text-gray-600">{amenity}</span>
                        ))
                      ) : (
                        <span className="bg-gray-50 border border-gray-100 px-3 py-1 rounded-md text-xs font-semibold text-gray-600">Room Service</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                      <p className="text-2xl font-bold text-gray-900 flex items-baseline gap-1">
                        {currency || "₹"}{room.pricePerNight}
                        <span className="text-xs text-gray-400 font-medium uppercase"> / night</span>
                      </p>
                      <button
                        onClick={() => handleNavigate(room._id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-all"
                      >
                        View Room
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-5xl mb-4">🏨</p>
                <p className="text-gray-800 font-semibold text-xl mb-2">
                  No hotels found {destinationParam ? `in "${destinationParam}"` : ''}
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Try searching a different city or clear your filters.
                </p>
                <button
                  onClick={() => { setSelectedFilters({ roomType: [], priceRange: [] }); navigate('/rooms'); }}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700"
                >
                  View All Rooms
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
