import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { toast } from "react-hot-toast";

const HotelReg = () => {
  const { axios, getToken, setShowHotelReg, setIsOwner, navigate, fetchUser } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone || !form.city) {
      return toast.error("Please fill all fields");
    }
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/hotels",
        { name: form.name, address: form.address, phone: form.phone, city: form.city },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.alreadyExists ? "Hotel already registered!" : "Hotel registered successfully!");
        setIsOwner(true);
        setShowHotelReg(false);
        await fetchUser();
        navigate("/owner");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={() => setShowHotelReg(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">List Your Hotel</h2>
        <p className="text-sm text-gray-500 mb-6">Register your hotel to start accepting bookings.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Hotel Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Grand Palace Hotel"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. 12 MG Road, Lucknow"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Lucknow"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Contact Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +91 9876543210"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Registering..." : "Register Hotel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HotelReg;