import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Hero = () => {
  const { navigate, setSearchedCities } = useAppContext();

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    if (destination) {
      setSearchedCities([destination]);
    }
    navigate(`/rooms?destination=${destination}`);
  };

  return (
    <div className='relative flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="z-10 flex flex-col items-center text-center w-full max-w-4xl">
        <p className="bg-blue-600/80 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          The Ultimate Hotel Experience
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
          Discover Your Perfect Gateway Destination
        </h1>
        <p className="text-sm md:text-base opacity-90 max-w-xl leading-relaxed mb-8">
          Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white text-gray-600 rounded-xl shadow-lg p-4 w-full flex flex-col md:flex-row items-stretch md:items-end gap-3"
        >
          <div className="flex-1 flex flex-col text-left">
            <div className="flex items-center gap-2 mb-1">
              <img src={assets.calenderIcon} alt="" className="h-4" />
              <label htmlFor="destinationInput" className="text-xs font-medium text-gray-500">Destination</label>
            </div>
            <input
              list="destinations"
              id="destinationInput"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none w-full"
              placeholder="Type here"
              required
            />
            <datalist id="destinations">
              {cities.map((city, index) => (
                <option value={city} key={index} />
              ))}
            </datalist>
          </div>

          <div className="flex-1 flex flex-col text-left">
            <div className="flex items-center gap-2 mb-1">
              <img src={assets.calenderIcon} alt="" className="h-4" />
              <label htmlFor="checkIn" className="text-xs font-medium text-gray-500">Check in</label>
            </div>
            <input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none w-full"
            />
          </div>

          <div className="flex-1 flex flex-col text-left">
            <div className="flex items-center gap-2 mb-1">
              <img src={assets.calenderIcon} alt="" className="h-4" />
              <label htmlFor="checkOut" className="text-xs font-medium text-gray-500">Check out</label>
            </div>
            <input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none w-full"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="guests" className="text-xs font-medium text-gray-500 mb-1">Guests</label>
            <input
              min={1}
              max={4}
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none w-20"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-black py-2 px-6 text-white cursor-pointer whitespace-nowrap"
          >
            <img src={assets.searchIcon} alt="Search" className="h-5" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;