import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext.jsx"; // Path standard rakha hai

/* ---------------- ICON ---------------- */
const BookIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
  </svg>
);

/* ---------------- NAVBAR ---------------- */
const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/" },
    { name: "About", path: "/" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { openSignIn } = useClerk();
  const location = useLocation();

  const { user, navigate, isOwner, setShowHotelReg } = useAppContext();

  /* -------- SCROLL & LOCATION EFFECT -------- */
  useEffect(() => {
    const checkState = () => {
      if (location.pathname !== "/") {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 50);
      }
    };

    checkState();

    const handleScroll = () => {
      if (location.pathname === "/") {
        setIsScrolled(window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between 
      px-8 md:px-16 lg:px-24 xl:px-32 z-50 transition-all duration-500
      ${isScrolled 
        ? "bg-white/95 shadow-md text-gray-700 backdrop-blur-lg py-2" 
        : "bg-transparent text-white py-4"}`}
    >
      {/* -------- LOGO -------- */}
      <Link to="/" className="flex items-center">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-8 md:h-10 w-auto object-contain transition-all duration-300 ${
            isScrolled ? "brightness-0" : "brightness-0 invert"
          }`}
        />
      </Link>

      {/* -------- DESKTOP LINKS -------- */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col font-medium ${isScrolled ? "text-gray-700" : "text-white"}`}
          >
            {link.name}
            <span className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${isScrolled ? "bg-gray-700" : "bg-white"}`} />
          </Link>
        ))}

{user && !location.pathname.includes("owner") && (
  <button
    onClick={() => isOwner ? navigate("/owner") : setShowHotelReg(true)}
    className={`border px-4 py-1 rounded-full text-sm transition-all ${
      isScrolled ? "border-gray-700 text-gray-700 hover:bg-gray-100" : "border-white text-white hover:bg-white/10"
    }`}
  >
    {isOwner ? 'Dashboard' : 'List Your Hotel'}
  </button>
)}
      </div>

      {/* -------- DESKTOP RIGHT -------- */}
      <div className="hidden md:flex items-center gap-4">
        <img
          src={assets.searchIcon}
          alt="search"
          className={`h-5 cursor-pointer ${isScrolled ? "" : "invert"}`}
        />

        {user ? (
          <UserButton afterSignOutUrl="/">
            <UserButton.MenuItems>
              <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => navigate("/my-bookings")} />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className={`px-8 py-2 rounded-full font-medium transition-all ${
              isScrolled ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Login
          </button>
        )}
      </div>

      {/* -------- MOBILE MENU BUTTON -------- */}
      <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
        <img src={assets.menuIcon} alt="menu" className={`h-6 ${isScrolled ? "" : "invert"}`} />
      </button>

      {/* -------- MOBILE MENU OVERLAY -------- */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-6 md:hidden transition-transform duration-500 z-[60]
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button className="absolute top-6 right-8" onClick={() => setIsMenuOpen(false)}>
          <img src={assets.closeIcon} alt="close" className="h-8 brightness-0" />
        </button>

        {navLinks.map((link, i) => (
          <Link 
            key={i} 
            to={link.path} 
            className="text-black text-2xl font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {user ? (
          <button 
            className="border-2 border-black px-6 py-2 rounded-full font-bold text-black"
            onClick={() => { setIsMenuOpen(false); navigate(isOwner ? "/owner" : "/my-bookings"); }}
          >
            {isOwner ? 'Dashboard' : 'My Bookings'}
          </button>
        ) : (
          <button 
            onClick={() => { setIsMenuOpen(false); openSignIn(); }} 
            className="bg-black text-white px-10 py-3 rounded-full font-bold"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;