import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="bg-[#F6F9FC] text-gray-500 pt-10 px-6 md:px-16 lg:px-24 xl:px-32 font-sans">

      {/* Main Grid */}
      <div className="flex flex-wrap justify-between gap-12 max-w-7xl mx-auto">

        {/* Brand Column */}
        <div className="max-w-[340px]">

          <img 
            src={assets.logo} 
            alt="logo" 
            className="mb-4 h-8 md:h-9 brightness-0" 
          />

          <p className="text-sm leading-relaxed">
            Discover the world's most extraordinary places to stay, from boutique
            hotels to luxury villas and private islands.
          </p>

          <div className="flex items-center gap-4 mt-5">
            <img src={assets.instagramIcon} alt="instagram" className="w-5 hover:opacity-70 cursor-pointer" />
            <img src={assets.facebookIcon} alt="facebook" className="w-5 hover:opacity-70 cursor-pointer" />
            <img src={assets.twitterIcon} alt="twitter" className="w-5 hover:opacity-70 cursor-pointer" />
            <img src={assets.linkendinIcon} alt="linkedin" className="w-5 hover:opacity-70 cursor-pointer" />
          </div>
        </div>

        {/* COMPANY */}
        <div className="min-w-[150px]">
          <p className="text-base font-semibold text-gray-800 tracking-wide">
            COMPANY
          </p>

          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {["About", "Careers", "Press", "Blog", "Partners"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-black transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="min-w-[170px]">
          <p className="text-base font-semibold text-gray-800 tracking-wide">
            SUPPORT
          </p>

          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {[
              "Help Center",
              "Safety Information",
              "Cancellation Options",
              "Contact Us",
              "Accessibility",
            ].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-black transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="max-w-[320px]">
          <p className="text-base font-semibold text-gray-800 tracking-wide">
            STAY UPDATED
          </p>

          <p className="mt-4 text-sm leading-relaxed">
            Subscribe to our newsletter for inspiration and special offers.
          </p>

          <div className="flex items-center mt-5 w-full">
            <input
              type="email"
              placeholder="Your email"
              className="bg-white border border-gray-300 rounded-l px-3 h-10 w-full text-sm outline-none focus:border-black"
            />

            <button className="bg-black h-10 w-10 flex items-center justify-center rounded-r hover:bg-gray-800 transition">
              <img
                src={assets.arrowIcon}
                alt="arrow"
                className="w-4 invert"
              />
            </button>
          </div>
        </div>

      </div>

      {/* Divider */}
      <hr className="border-gray-300 mt-10" />

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-6 max-w-7xl mx-auto text-sm">

        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-gray-700">
            StayWithMe
          </span>
          . All rights reserved.
        </p>

        <ul className="flex items-center gap-5">
          {["Privacy", "Terms", "Sitemap"].map((item) => (
            <li key={item}>
              <a href="#" className="hover:text-black transition">
                {item}
              </a>
            </li>
          ))}
        </ul>

      </div>

    </div>
  );
};

export default Footer;import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="bg-[#F6F9FC] text-gray-500 pt-10 px-6 md:px-16 lg:px-24 xl:px-32 font-sans">

      {/* Main Grid - fixed to proper responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">

        {/* Brand Column */}
        <div className="sm:col-span-2 lg:col-span-1">
          <img
            src={assets.logo}
            alt="logo"
            className="mb-4 h-8 md:h-9 brightness-0"
          />
          <p className="text-sm leading-relaxed max-w-xs">
            Discover the world's most extraordinary places to stay, from boutique
            hotels to luxury villas and private islands.
          </p>
          <div className="flex items-center gap-4 mt-5">
            <a href="#" aria-label="Instagram">
              <img src={assets.instagramIcon} alt="instagram" className="w-5 hover:opacity-70 transition cursor-pointer" />
            </a>
            <a href="#" aria-label="Facebook">
              <img src={assets.facebookIcon} alt="facebook" className="w-5 hover:opacity-70 transition cursor-pointer" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src={assets.twitterIcon} alt="twitter" className="w-5 hover:opacity-70 transition cursor-pointer" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src={assets.linkendinIcon} alt="linkedin" className="w-5 hover:opacity-70 transition cursor-pointer" />
            </a>
          </div>
        </div>

        {/* COMPANY */}
        <div>
          <p className="text-base font-semibold text-gray-800 tracking-wide mb-4">COMPANY</p>
          <ul className="flex flex-col gap-2 text-sm">
            {["About", "Careers", "Press", "Blog", "Partners"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-black transition">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <p className="text-base font-semibold text-gray-800 tracking-wide mb-4">SUPPORT</p>
          <ul className="flex flex-col gap-2 text-sm">
            {["Help Center", "Safety Information", "Cancellation Options", "Contact Us", "Accessibility"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-black transition">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="text-base font-semibold text-gray-800 tracking-wide mb-4">STAY UPDATED</p>
          <p className="text-sm leading-relaxed mb-5">
            Subscribe to our newsletter for inspiration and special offers.
          </p>
          <div className="flex items-center w-full max-w-xs">
            <input
              type="email"
              placeholder="Your email"
              className="bg-white border border-gray-300 rounded-l px-3 h-10 w-full text-sm outline-none focus:border-black transition"
            />
            <button className="bg-black h-10 w-10 flex items-center justify-center rounded-r hover:bg-gray-800 transition shrink-0">
              <img src={assets.arrowIcon} alt="arrow" className="w-4 invert" />
            </button>
          </div>
        </div>

      </div>

      {/* Divider */}
      <hr className="border-gray-300 mt-10" />

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-6 max-w-7xl mx-auto text-sm">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-gray-700">StayWithMe</span>. All rights reserved.
        </p>
        <ul className="flex items-center gap-5">
          {["Privacy", "Terms", "Sitemap"].map((item) => (
            <li key={item}>
              <a href="#" className="hover:text-black transition">{item}</a>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default Footer;
