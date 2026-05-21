import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import heroImage from "../assets/heroImage.png";

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
    <div
      className="relative flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-no-repeat bg-cover bg-center min-h-screen pt-24 pb-10"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/30 -z-0"></div>

      <div className="z-10 flex flex-col items-start w-full">
        <p className="bg-blue-600/80 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          The Ultimate Hotel Experience
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold max-w-3xl leading-tight mb-4">
          Discover Your Perfect <br className="hidden md:block" /> Gateway Destination
        </h1>
        <p className="text-base md:text-lg opacity-90 max-w-xl leading-relaxed mb-6">
          Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white text-gray-500 rounded-xl px-4 py-4 flex flex-col md:flex-row gap-4 w-full md:w-auto shadow-xl"
        >
          {/* Destination */}
          <div className="flex flex-col w-full md:w-auto">
            <div className="flex items-center gap-2 mb-1">
              <img src={assets.calenderIcon} alt="location" className="h-4" />
              <label htmlFor="destinationInput" className="text-xs font-medium text-gray-500">Destination</label>
            </div>
            <input
              list="destinations"
              id="destinationInput"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none w-full md:w-44 focus:border-blue-400 transition"
              placeholder="Where to?"
              required
            />
            <datalist id="destinations">
              {cities.map((city, index) => (
                <option value={city} key={index} />
              ))}
            </datalist>
          </div>

          {/* Check In */}
          <div className="flex flex-col w-full md:w-auto">
            <div className="flex items-center gap-2 mb-1">
              <img src={assets.calenderIcon} alt="calendar" className="h-4" />
              <label htmlFor="checkIn" className="text-xs font-medium text-gray-500">Check in</label>
            </div>
            <input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none w-full focus:border-blue-400 transition"
            />
          </div>

          {/* Check Out */}
          <div className="flex flex-col w-full md:w-auto">
            <div className="flex items-center gap-2 mb-1">
              <img src={assets.calenderIcon} alt="calendar" className="h-4" />
              <label htmlFor="checkOut" className="text-xs font-medium text-gray-500">Check out</label>
            </div>
            <input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split("T")[0]}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none w-full focus:border-blue-400 transition"
            />
          </div>

          {/* Guests */}
          <div className="flex flex-col w-full md:w-auto">
            <div className="flex items-center gap-2 mb-1">
              <img src={assets.guestsIcon} alt="guests" className="h-4" />
              <label htmlFor="guests" className="text-xs font-medium text-gray-500">Guests</label>
            </div>
            <input
              min={1}
              max={4}
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none w-full md:w-20 focus:border-blue-400 transition"
              placeholder="1"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-black py-3 px-6 text-white font-medium mt-auto cursor-pointer hover:bg-gray-800 transition w-full md:w-auto"
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
