import React from "react";
import { assets } from "../../assets/assets";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-9 invert opacity-80" />
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Register Hotel Button */}
        <Link
          to="/register-hotel"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
        >
          Register Hotel
        </Link>

        {/* User Profile */}
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
