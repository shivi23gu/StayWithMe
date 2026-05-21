import React from "react";

const NewaLetter = () => {
  return (
    <div className="w-full flex justify-center px-4 py-24">

      {/* Card */}
      <div className="
        flex flex-col items-center text-center
        w-full max-w-5xl
        rounded-2xl
        px-6 md:px-20
        py-16
        bg-gray-900
        text-white
      ">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-serif tracking-wide mb-4">
          Stay Inspired
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-base md:text-lg font-light max-w-2xl mb-10">
          Join our newsletter and be the first to discover new destinations,
          exclusive offers, and travel inspiration.
        </p>

        {/* Input + Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">

          <input
            type="email"
            placeholder="Enter your email"
            className="
              w-full sm:w-80
              px-5 py-3
              rounded-lg
              bg-[#1b2232]
              text-gray-300
              placeholder-gray-500
              outline-none
              border border-gray-700
              focus:border-gray-400
            "
          />

          <button
            className="
              bg-black
              text-white
              px-8 py-3
              rounded-lg
              flex items-center gap-2
              hover:bg-gray-800
              transition
            "
          >
            Subscribe
            <span className="text-xl">→</span>
          </button>

        </div>

        {/* Privacy */}
        <p className="text-gray-500 text-sm mt-6 font-light">
          By subscribing, you agree to our Privacy Policy and consent to receive updates.
        </p>

      </div>
    </div>
  );
};

export default NewaLetter;