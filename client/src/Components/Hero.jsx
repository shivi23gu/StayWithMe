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
    <div className='relative flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center min-h-screen pt-24 pb-10'>
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

        <form
          onSubmit={handleSearch}
          className="bg-white text-gray-500 rounded-lg px-4 py-4 flex flex-col md:flex-row max-md:items-start gap-3 w-full md:w-auto max-h-[70vh] overflow-y-auto md:max-h-none md:overflow-visible"
        >
          <div>
            <div className="flex items-center gap-2">
              <img src={assets.calenderIcon} alt="Calender" className="h-4" />
              <label htmlFor="destinationInput">Destination</label>
            </div>
            <input
              list="destinations"
              id="destinationInput"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full"
              placeholder="Type here"
              required
            />
            <datalist id="destinations">
              {cities.map((city, index) => (
                <option value={city} key={index} />
              ))}
            </datalist>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <img src={assets.calenderIcon} alt="Calender" className="h-4" />
              <label htmlFor="checkIn">Check in</label>
            </div>
            <input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <img src={assets.calenderIcon} alt="Calender" className="h-4" />
              <label htmlFor="checkOut">Check out</label>
            </div>
            <input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full"
            />
          </div>

          <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
            <label htmlFor="guests">Guests</label>
            <input
              min={1}
              max={4}
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
              placeholder="1"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full"
          >
            <img src={assets.searchIcon} alt="Search" className="h-7" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;