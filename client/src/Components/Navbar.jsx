import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext.jsx";

const BookIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
  </svg>
);

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "About", path: "/" },
  ];

  const { user, navigate, isOwner, setShowHotelReg, userLoading } = useAppContext();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { openSignIn } = useClerk();
  const location = useLocation();

  useEffect(() => {
    const checkState = () => {
      if (location.pathname !== "/" && location.pathname !== "/owner") {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 50 || location.pathname === "/owner");
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isWhiteBg = isScrolled || location.pathname === "/owner";

  const handleHotelButton = () => {
    if (userLoading) return;
    if (isOwner) {
      navigate("/owner");
    } else {
      setShowHotelReg(true);
    }
  };

  const handleDashboardButton = () => {
    if (userLoading) return;
    if (isOwner) {
      navigate("/owner");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between 
      px-6 md:px-16 lg:px-24 xl:px-32 z-50 transition-all duration-500
      ${isWhiteBg
        ? "bg-white/95 shadow-md text-gray-700 backdrop-blur-lg py-2"
        : "bg-transparent text-white py-4"}`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-8 md:h-10 w-auto object-contain transition-all duration-300 ${
            isWhiteBg ? "brightness-0" : "brightness-0 invert"
          }`}
        />
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col font-medium ${isWhiteBg ? "text-gray-700" : "text-white"}`}
          >
            {link.name}
            <span className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${isWhiteBg ? "bg-gray-700" : "bg-white"}`} />
          </Link>
        ))}

        {user && (
          <>
            {/* Dashboard button - owner ke liye owner panel, user ke liye user dashboard */}
            <button
              onClick={handleDashboardButton}
              className={`border px-4 py-1 rounded-full text-sm transition-all ${
                isWhiteBg ? "border-gray-700 text-gray-700 hover:bg-gray-100" : "border-white text-white hover:bg-white/10"
              }`}
            >
              {userLoading ? "..." : "Dashboard"}
            </button>

            {/* List Your Hotel - sirf non-owner ke liye */}
            {!isOwner && !userLoading && (
              <button
                onClick={() => setShowHotelReg(true)}
                className={`border px-4 py-1 rounded-full text-sm transition-all ${
                  isWhiteBg ? "border-gray-700 text-gray-700 hover:bg-gray-100" : "border-white text-white hover:bg-white/10"
                }`}
              >
                List Your Hotel
              </button>
            )}
          </>
        )}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        <img
          src={assets.searchIcon}
          alt="search"
          className={`h-5 cursor-pointer ${isWhiteBg ? "" : "invert"}`}
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
              isWhiteBg ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button className="md:hidden p-1" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
        <img src={assets.menuIcon} alt="menu" className={`h-6 ${isWhiteBg ? "" : "invert"}`} />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-6 md:hidden transition-transform duration-500 z-[60]
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button className="absolute top-6 right-6 p-2" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
          <img src={assets.closeIcon} alt="close" className="h-7 brightness-0" />
        </button>

        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className="text-black text-2xl font-bold hover:text-indigo-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {user && (
          <>
            <button
              className="border-2 border-black px-6 py-2 rounded-full font-bold text-black hover:bg-gray-50 transition"
              onClick={() => { setIsMenuOpen(false); handleDashboardButton(); }}
            >
              {userLoading ? "..." : "Dashboard"}
            </button>

            {!isOwner && !userLoading && (
              <button
                className="border-2 border-black px-6 py-2 rounded-full font-bold text-black hover:bg-gray-50 transition"
                onClick={() => { setIsMenuOpen(false); setShowHotelReg(true); }}
              >
                List Your Hotel
              </button>
            )}
          </>
        )}

        {!user && (
          <button
            onClick={() => { setIsMenuOpen(false); openSignIn(); }}
            className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gray-800 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;