import React, { useEffect, useState } from "react";
import Title from "../../Components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext.jsx";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const { axios, getToken, currency } = useAppContext();
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    bookings: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      // Apne updated standard routes ke sath exact call map kiya
      const { data } = await axios.get('/api/rooms/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data && data.success) {
        setDashboardData({
          totalBookings: data.totalBookings || 0,
          totalRevenue: data.totalRevenue || 0,
          bookings: data.bookings || [],
        });
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-40 text-gray-500 font-medium">Loading Dashboard Data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Title Component */}
      <Title 
        align="left" 
        font="outfit" 
        title="Dashboard" 
        subTitle="Monitor your room listings, track bookings and analyze revenue—all in one place. Stay updated with real-time insights to ensure smooth operations." 
      />

      {/* DYNAMIC METRIC CARDS BLOCK (Exactly like GreatStack Video Layout) */}
      <div className="flex flex-wrap gap-5 my-8">
        
        {/* Card 1: Total Bookings */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl flex items-center p-6 gap-5 min-w-[260px] flex-1 sm:flex-initial">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            {/* Dynamic Hotel / Booking Box Icon */}
            <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V11a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002-2v-3a2 2 0 012-2h3" />
            </svg>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-400 text-sm font-medium">Total Bookings</p>
            <p className="text-gray-800 text-2xl font-bold mt-0.5">{dashboardData?.totalBookings || 0}</p>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl flex items-center p-6 gap-5 min-w-[260px] flex-1 sm:flex-initial">
          <div className="p-3.5 bg-green-50 text-green-600 rounded-xl">
            {/* Dynamic Coin/Revenue Dollar Icon */}
            <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
            <p className="text-gray-800 text-2xl font-bold mt-0.5">
              {currency }{dashboardData?.totalRevenue || 0}
            </p>
          </div>
        </div>

      </div>

      {/* RECENT BOOKINGS TABLE LOGIC */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-10">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/70 text-gray-900 font-semibold text-sm border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Room Name</th>
                <th className="px-6 py-4 text-center">Total Amount</th>
                <th className="px-6 py-4 text-center">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {dashboardData?.bookings?.length > 0 ? (
                dashboardData.bookings.map((booking, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{booking?.user?.username || "Guest User"}</td>
                    <td className="px-6 py-4 text-gray-600">{booking?.room?.roomType || "Double Bed"}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800 text-center">
                      {currency || "$"}{booking?.totalPrice || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {/* Video Standard Pill Badges for Completed/Pending */}
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        booking?.isPaid 
                          ? "bg-green-50 text-green-600 border border-green-100" 
                          : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                      }`}>
                        {booking?.isPaid ? "Completed" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400 font-normal">
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;