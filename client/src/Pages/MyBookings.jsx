import React, { useState, useEffect } from "react";
import Title from "../Components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const MyBookings = () => {
  const { axios, getToken, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get('/api/bookings/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId) => {
    if (isProcessingPayment) return; // Prevent double submissions
    
    try {
      setIsProcessingPayment(true);
      const token = await getToken();
      const { data } = await axios.post('/api/bookings/stripe-payment',
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const getInitialData = async () => {
      if (isMounted) {
        await fetchBookings();
      }
    };
    
    getInitialData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePaymentClick = (bookingId) => {
    setSelectedBooking(bookingId);
    setShowModal(true);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  if (loading) {
    return (
      <div className="pt-40 text-center">
        <p className="text-gray-500 text-lg">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="py-28 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 relative pb-20">

      {/* Payment Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src={assets.logo || "🏨"} alt="StayWithMe" className="w-10" />
            </div>
            <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">StayWithMe</h2>
            <p className="text-gray-600 mb-2">Proceeding to secure payment gateway.</p>
            <p className="text-xs text-gray-400 font-mono mb-6">Booking ID: {selectedBooking}</p>
            
            <div className="flex flex-col gap-2">
              <button
                disabled={isProcessingPayment}
                onClick={async () => {
                  setShowModal(false);
                  await handlePayment(selectedBooking);
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-95 disabled:bg-gray-400 disabled:scale-100"
              >
                {isProcessingPayment ? "Connecting..." : "Proceed to Pay"}
              </button>
              
              <button
                disabled={isProcessingPayment}
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks."
        align="left"
      />

      <div className="max-w-6xl mt-10 w-full text-gray-800">

        {/* Table Header — desktop only */}
        <div className="hidden md:grid grid-cols-[3fr_2fr_1fr] border-b border-gray-300 font-medium text-base py-3 text-gray-500">
          <div>Hotels</div>
          <div>Date & Timings</div>
          <div>Payment</div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🏨</p>
            <p className="text-lg font-medium text-gray-600">No bookings yet</p>
            <p className="text-sm mt-1">Book a room to see it here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-200 py-6 first:border-t gap-6 items-start"
              >

                {/* Hotel Details */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={booking.room?.images?.[0] || assets.placeholderImage}
                    alt="hotel room"
                    className="w-full sm:w-40 h-32 rounded-xl shadow-sm object-cover shrink-0 bg-gray-100"
                    onError={(e) => { e.target.src = assets.placeholderImage; }}
                  />
                  <div className="flex flex-col justify-center">
                    <h3 className="font-playfair text-xl md:text-2xl font-semibold text-gray-900">
                      {booking.hotel?.name}
                      <span className="font-sans text-sm text-gray-500 ml-2 font-normal">
                        ({booking.room?.roomType})
                      </span>
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <img src={assets.locationIcon} className="w-3" alt="location" />
                      <span>{booking.hotel?.address || booking.hotel?.city || "Address unavailable"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <img src={assets.guestsIcon} className="w-3" alt="guests" />
                      <span>Guests: {booking.guests}</span>
                    </div>
                    <p className="font-bold text-lg mt-2 text-gray-900">
                      Total: {currency || "₹"}{(booking.totalPrice || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex flex-row gap-8 md:flex-col md:gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Check-In</p>
                    <p className="text-sm font-medium text-gray-700">{formatDate(booking.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Check-Out</p>
                    <p className="text-sm font-medium text-gray-700">{formatDate(booking.checkOutDate)}</p>
                  </div>
                </div>

                {/* Payment Status & Action */}
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${booking.isPaid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <p className={`text-sm font-semibold ${booking.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                      {booking.isPaid ? 'Paid' : 'Unpaid'}
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
        )}
      </div>
    </div>
  );
};

export default MyBookings;