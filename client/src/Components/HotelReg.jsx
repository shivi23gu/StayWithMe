import React from "react";
import { assets, cities } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const HotelReg = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <form className="flex bg-white rounded-xl max-w-4xl w-full max-md:mx-2 overflow-hidden shadow-2xl">
        {/* Image - Left Side */}
        <img
          src={assets.regImage}
          alt="reg-image"
          className="w-1/2 hidden md:block object-cover"
        />

        {/* Form Section - Right Side */}
        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-12">
          {/* Close Icon */}
          <img
            src={assets.closeIcon}
            alt="close-icon"
            onClick={() => navigate("/")}
            className="absolute top-6 right-6 h-4 w-4 cursor-pointer hover:scale-110 transition-transform"
          />

          <div className="w-full">
            <h2 className="text-2xl font-semibold text-gray-800">Register Your Hotel</h2>
            <p className="text-gray-500 text-sm mt-1">Fill in the details to list your property.</p>
          </div>

          {/* Hotel Name */}
          <div className="w-full mt-6">
            <label htmlFor="name" className="text-sm font-medium text-gray-500">
              Hotel Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Grand Plaza"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 focus:outline-indigo-500 font-light"
              required
            />
          </div>

          {/* Phone */}
          <div className="w-full mt-4">
            <label htmlFor="contact" className="text-sm font-medium text-gray-500">
              Phone
            </label>
            <input
              id="contact"
              type="text"
              placeholder="+91 00000 00000"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 focus:outline-indigo-500 font-light"
              required
            />
          </div>

          {/* Address */}
          <div className="w-full mt-4">
            <label htmlFor="address" className="text-sm font-medium text-gray-500">
              Address
            </label>
            <input
              id="address"
              type="text"
              placeholder="Full street address"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 focus:outline-indigo-500 font-light"
              required
            />
          </div>

          {/* City Dropdown */}
          <div className="w-full mt-4">
            <label htmlFor="city" className="text-sm font-medium text-gray-500">
              City
            </label>
            <select
              id="city"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 focus:outline-indigo-500 font-light bg-white"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all text-white px-6 py-3 rounded-lg font-medium mt-8 shadow-md active:scale-95"
          >
            Register Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;