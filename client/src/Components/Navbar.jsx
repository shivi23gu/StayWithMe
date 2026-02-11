import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useEffect, useState } from "react";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

/* ---------------- ICON ---------------- */

const BookIcon = () => (
  <svg
    className="w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
    />
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
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  /* -------- SCROLL EFFECT -------- */
  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }
    setIsScrolled((prev) => (location.pathname !== "/" ? true : prev));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between 
      px-8 md:px-16 lg:px-24 xl:px-32 z-50 transition-all duration-500
      ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3"
          : "bg-transparent text-white py-5"
      }`}
    >
      {/* -------- LOGO -------- */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-8 md:h-10 ${isScrolled ? "" : "invert"}`}
        />
      </Link>

      {/* -------- DESKTOP LINKS -------- */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {link.name}
            <span
              className={`h-0.5 w-0 group-hover:w-full transition-all duration-300
              ${isScrolled ? "bg-gray-700" : "bg-white"}`}
            />
          </Link>
        ))}

        {user && (
          <button
            onClick={() => navigate("/owner")}
            className="border px-4 py-1 rounded-full text-sm"
          >
            Dashboard
          </button>
        )}
      </div>

      {/* -------- DESKTOP RIGHT -------- */}
      <div className="hidden md:flex items-center gap-4">
        <img
          src={assets.searchIcon}
          alt="search"
          className={`${isScrolled ? "invert" : ""} h-7`}
        />

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<BookIcon />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className={`px-8 py-2.5 rounded-full
            ${isScrolled ? "bg-black text-white" : "bg-white text-black"}`}
          >
            Login
          </button>
        )}
      </div>

      {/* -------- MOBILE MENU BUTTON -------- */}
      <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
        <img
          src={assets.menuIcon}
          alt="menu"
          className={`${isScrolled ? "invert" : ""} h-5`}
        />
      </button>

      {/* -------- MOBILE MENU -------- */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white flex flex-col
        items-center justify-center gap-6 md:hidden transition-transform duration-500
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close */}
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="close" className="h-6" />
        </button>

        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className="text-gray-800 text-xl font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {user && (
          <button
            className="border px-4 py-1 rounded-full"
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/owner");
            }}
          >
            Dashboard
          </button>
        )}

        {!user && (
          <button
            onClick={openSignIn}
            className="bg-black text-white px-8 py-2.5 rounded-full"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
