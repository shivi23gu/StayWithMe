import React, { useState } from "react";
import Title from "../Components/Title";
import { assets} from "../assets/assets";
import { userBookingsDummyData } from '../assets/assets'


const MyBookings = () => {
  // State to manage the custom "StayWithMe" payment modal
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Function to handle the custom modal trigger
  const handlePaymentClick = (bookingId) => {
    setSelectedBooking(bookingId);
    setShowModal(true);
  };

  return (
    <div className="py-28 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 relative">
      
      {/* --- CUSTOM STAYWITHME MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <img src={assets.logo} alt="StayWithMe" className="w-10" />
            </div>
            <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">StayWithMe</h2>
            <p className="text-gray-600 mb-6">
              Proceeding to our secure payment gateway for booking ID:{" "}
              <span className="font-mono text-xs">{selectedBooking}</span>
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all active:scale-95"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks."
        align="left"
      />

      <div className="max-w-6xl mt-10 w-full text-gray-800">
        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-[3fr_2fr_1fr] border-b border-gray-300 font-medium text-base py-3 text-gray-500">
          <div>Hotels</div>
          <div>Date and Timings</div>
          <div>Payment</div>
        </div>

        {/* BOOKINGS LIST */}
        <div className="flex flex-col gap-4 mt-4">
          {userBookingsDummyData.map((booking) => (
            <div
              key={booking._id}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t gap-6 items-center"
            >
              {/* Hotel Details Column */}
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={booking.room.images[0]}
                  alt="hotel"
                  className="w-full sm:w-44 h-32 rounded-xl shadow-sm object-cover"
                />
                <div className="flex flex-col justify-center">
                  <h3 className="font-playfair text-2xl font-semibold text-gray-900">
                    {booking.hotel.name}
                    <span className="font-sans text-sm text-gray-500 ml-2 font-normal">
                      ({booking.room.roomType})
                    </span>
                  </h3>
                  
                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <img src={assets.locationIcon} className="w-3" alt="location" />
                    <span>{booking.hotel.address}</span>
                  </div>
                  
                  {/* Guests */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <img src={assets.guestsIcon} className="w-3" alt="guests" />
                    <span>Guests: {booking.guests}</span>
                  </div>
                  
                  <p className="font-bold text-lg mt-2 text-gray-900">
                    Total: ₹{(booking.totalPrice * 80).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Dates and Timings Column */}
              <div className="flex flex-row md:items-center md:gap-12 gap-8">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Check-In</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(booking.checkInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Check-Out</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(booking.checkOutDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Payment Section Column */}
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <p className={`text-sm font-semibold ${booking.isPaid ? "text-green-600" : "text-red-600"}`}>
                    {booking.isPaid ? "Paid" : "Unpaid"}
                  </p>
                </div>

                {!booking.isPaid && (
                  <button 
                    onClick={() => handlePaymentClick(booking._id)}
                    className="px-6 py-2 border border-gray-200 rounded-full text-xs font-bold hover:bg-gray-50 active:scale-95 transition-all shadow-sm bg-white"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
