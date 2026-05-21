import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext.jsx";
import { toast } from "react-hot-toast";

const HotelReg = () => {
 const { setShowHotelReg, axios, getToken, setIsOwner, fetchUser } = useAppContext();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const token = await getToken();

      const { data } = await axios.post(
        "/api/hotels",
        { name, phone, address, city },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data && data.success) {
        toast.success(data.message || "Hotel Registered Successfully!");
        setShowHotelReg(false);
        setIsOwner(true);
      } else {
        toast.error(data?.message || "Registration failed");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg);
      console.error("Hotel Registration Error:", error);
    }
  };

  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-xl max-w-4xl w-full max-md:mx-2 overflow-hidden shadow-2xl"
      >
        <img
          src={assets?.regImage || ""}
          alt="reg-image"
          className="w-1/2 hidden md:block object-cover"
        />
        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-12">
          <img
            src={assets?.closeIcon || ""}
            alt="close-icon"
            onClick={() => setShowHotelReg(false)}
            className="absolute top-6 right-6 h-4 w-4 cursor-pointer hover:scale-110 transition-transform"
          />
          <div className="w-full">
            <h2 className="text-2xl font-semibold text-gray-800">
              Register Your Hotel
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Fill in the details to list your property.
            </p>
          </div>

          <div className="w-full mt-6">
            <label className="text-sm font-medium text-gray-500">
              Hotel Name
            </label>
            <input
              type="text"
              placeholder="e.g., Grand Plaza"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 focus:outline-indigo-500 font-light"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <input
              type="text"
              placeholder="+91 00000 00000"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 focus:outline-indigo-500 font-light"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label className="text-sm font-medium text-gray-500">Address</label>
            <input
              type="text"
              placeholder="Full street address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 focus:outline-indigo-500 font-light"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label className="text-sm font-medium text-gray-500">City</label>
            <select
              onChange={(e) => setCity(e.target.value)}
              value={city}
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 focus:outline-indigo-500 font-light bg-white"
              required
            >
              <option value="">Select City</option>
              {cities &&
                cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>

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
