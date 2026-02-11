import React, { useState } from "react";
import Title from "../../Components/Title";
import { assets, dashboardDummyData } from "../../assets/assets";

const Dashboard = () => {
  // Initialize state with default structure to avoid undefined errors
  const [dashboardData, setDashBoardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    bookings: [],
    ...dashboardDummyData, // merge dummy data if available
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* --- TITLE --- */}
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Monitor your room listings, track bookings and analyse revenue—all in one place. Stay updated with real-time insights to ensure smooth operations"
      />

      {/* --- CARDS --- */}
      <div className="flex flex-wrap gap-4 my-8">
        {/* Total Bookings Card */}
        <div className="bg-primary/5 border border-primary/10 rounded-lg flex items-center p-4 pr-12 min-w-[200px]">
          <img
            src={assets.totalBookingIcon}
            alt="total-booking"
            className="max-sm:hidden h-12 w-12"
          />
          <div className="ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Bookings</p>
            <p className="text-neutral-600 text-xl font-bold">
              {dashboardData.totalBookings || 0}
            </p>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-primary/5 border border-primary/10 rounded-lg flex items-center p-4 pr-12 min-w-[200px]">
          <img
            src={assets.totalRevenueIcon}
            alt="total-revenue"
            className="max-sm:hidden h-12 w-12"
          />
          <div className="ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Revenue</p>
            <p className="text-neutral-600 text-xl font-bold">
              ${dashboardData.totalRevenue || 0}
            </p>
          </div>
        </div>
      </div>

      {/* --- RECENT BOOKINGS TABLE --- */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Room Name</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dashboardData?.bookings?.length > 0 ? (
                dashboardData.bookings.map((booking, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      {booking.user?.username || "-"}
                    </td>
                    <td className="px-6 py-4">{booking.room?.roomType || "-"}</td>
                    <td className="px-6 py-4 font-semibold">
                      ${booking.totalPrice || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border ${
                          booking.isPaid
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-yellow-50 text-yellow-600 border-yellow-200"
                        }`}
                      >
                        {booking.isPaid ? "Completed" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">
                    No bookings yet
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
