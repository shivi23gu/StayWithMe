import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

// ─── Utility ────────────────────────────────────────────────────────────────
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const nights = (cin, cout) =>
  Math.max(
    1,
    Math.ceil((new Date(cout) - new Date(cin)) / (1000 * 60 * 60 * 24))
  );

// ─── Status Badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ isPaid, status }) => {
  if (isPaid)
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
        Paid
      </span>
    );
  if (status === "cancelled")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
        Cancelled
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
      Unpaid
    </span>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 min-w-0">
      <div className={`p-3 rounded-xl shrink-0 ${colorMap[color]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider truncate">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const UserDashboard = () => {
  const { axios, getToken, currency, user, navigate } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // all | upcoming | past
  const [payModal, setPayModal] = useState(null); // booking id

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const { data } = await axios.get("/api/bookings/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) setBookings(data.bookings);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Derived Stats ────────────────────────────────────────────────────────
  const today = new Date();
  const upcoming = bookings.filter(
    (b) => new Date(b.checkInDate) >= today && b.status !== "cancelled"
  );
  const past = bookings.filter((b) => new Date(b.checkOutDate) < today);
  const totalSpent = bookings
    .filter((b) => b.isPaid)
    .reduce((s, b) => s + (b.totalPrice || 0), 0);

  const displayed =
    activeTab === "upcoming"
      ? upcoming
      : activeTab === "past"
      ? past
      : bookings;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Banner ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 md:px-12 lg:px-20 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-2xl font-bold shrink-0">
              {user?.firstName?.[0] || "U"}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-300 mb-0.5">Welcome back,</p>
            <h1 className="text-2xl md:text-3xl font-bold truncate">
              {user?.fullName || user?.firstName || "Traveller"}
            </h1>
            <p className="text-slate-400 text-sm mt-1 truncate">
              {user?.primaryEmailAddress?.emailAddress || ""}
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => navigate("/rooms")}
              className="px-5 py-2.5 bg-white text-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all shadow-sm active:scale-95"
            >
              🏨 Browse Rooms
            </button>
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all active:scale-95"
            >
              📋 All Bookings
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
            }
            label="Total Bookings"
            value={bookings.length}
            color="blue"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label="Upcoming Stays"
            value={upcoming.length}
            color="purple"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            label="Past Stays"
            value={past.length}
            color="orange"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Spent"
            value={`${currency || "₹"}${totalSpent.toLocaleString("en-IN")}`}
            color="green"
          />
        </div>

        {/* ── Upcoming Highlight ─────────────────────────────────────── */}
        {upcoming.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              🗓️ Next Upcoming Stay
            </h2>
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row gap-5 items-start md:items-center">
              {upcoming[0]?.room?.images?.[0] && (
                <img
                  src={upcoming[0].room.images[0]}
                  alt="room"
                  className="w-full md:w-36 h-28 object-cover rounded-xl shadow-md shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-blue-100 text-xs uppercase tracking-widest font-semibold mb-1">
                  Confirmed Booking
                </p>
                <h3 className="text-xl font-bold truncate">
                  {upcoming[0]?.hotel?.name}
                </h3>
                <p className="text-blue-200 text-sm truncate mt-0.5">
                  📍 {upcoming[0]?.hotel?.address || upcoming[0]?.hotel?.city}
                </p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <div>
                    <p className="text-[10px] uppercase text-blue-200 tracking-widest">Check-In</p>
                    <p className="text-sm font-semibold">{formatDate(upcoming[0].checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-blue-200 tracking-widest">Check-Out</p>
                    <p className="text-sm font-semibold">{formatDate(upcoming[0].checkOutDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-blue-200 tracking-widest">Nights</p>
                    <p className="text-sm font-semibold">
                      {nights(upcoming[0].checkInDate, upcoming[0].checkOutDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-blue-200 tracking-widest">Guests</p>
                    <p className="text-sm font-semibold">{upcoming[0].guests}</p>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-blue-200 text-xs mb-0.5">Total</p>
                <p className="text-2xl font-bold">
                  {currency || "₹"}{(upcoming[0].totalPrice || 0).toLocaleString("en-IN")}
                </p>
                <StatusBadge isPaid={upcoming[0].isPaid} status={upcoming[0].status} />
              </div>
            </div>
          </div>
        )}

        {/* ── Bookings Table ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header + Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex-1">My Bookings</h2>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 text-sm">
              {["all", "upcoming", "past"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg font-medium capitalize transition-all ${
                    activeTab === tab
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  <span className="ml-1.5 text-xs text-gray-400">
                    ({tab === "all" ? bookings.length : tab === "upcoming" ? upcoming.length : past.length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {displayed.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🏨</p>
              <p className="text-gray-600 font-medium">No bookings here yet</p>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === "upcoming"
                  ? "No upcoming trips planned"
                  : activeTab === "past"
                  ? "No past stays found"
                  : "Start exploring hotels!"}
              </p>
              {activeTab === "all" && (
                <button
                  onClick={() => navigate("/rooms")}
                  className="mt-5 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all active:scale-95"
                >
                  Browse Rooms
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">Hotel & Room</th>
                    <th className="px-6 py-3 text-left">Dates</th>
                    <th className="px-6 py-3 text-center">Nights</th>
                    <th className="px-6 py-3 text-center">Amount</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayed.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Hotel */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {booking.room?.images?.[0] && (
                            <img
                              src={booking.room.images[0]}
                              alt="room"
                              className="w-12 h-10 rounded-lg object-cover shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                              {booking.hotel?.name || "Hotel"}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                              {booking.room?.roomType || "Room"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-6 py-4 text-gray-600">
                        <p>{formatDate(booking.checkInDate)}</p>
                        <p className="text-xs text-gray-400">
                          → {formatDate(booking.checkOutDate)}
                        </p>
                      </td>

                      {/* Nights */}
                      <td className="px-6 py-4 text-center font-medium text-gray-700">
                        {nights(booking.checkInDate, booking.checkOutDate)}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-center font-bold text-gray-800">
                        {currency || "₹"}
                        {(booking.totalPrice || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <StatusBadge
                          isPaid={booking.isPaid}
                          status={booking.status}
                        />
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-center">
                        {!booking.isPaid && booking.status !== "cancelled" ? (
                          <button
                            onClick={() => setPayModal(booking._id)}
                            className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-all active:scale-95"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Quick Links ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            {
              title: "Find Rooms",
              desc: "Browse available hotel rooms",
              icon: "🔍",
              path: "/rooms",
              color: "from-blue-50 to-blue-100/50 border-blue-100",
            },
            {
              title: "My Bookings",
              desc: "View all your reservations",
              icon: "📋",
              path: "/my-bookings",
              color: "from-violet-50 to-violet-100/50 border-violet-100",
            },
            {
              title: "Become an Owner",
              desc: "List your hotel on StayWithMe",
              icon: "🏨",
              path: "/register-hotel",
              color: "from-emerald-50 to-emerald-100/50 border-emerald-100",
            },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`bg-gradient-to-br ${item.color} border rounded-2xl p-5 text-left hover:shadow-md transition-all active:scale-[0.98] group`}
            >
              <span className="text-3xl mb-3 block">{item.icon}</span>
              <p className="font-bold text-gray-800 group-hover:text-gray-900">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Pay Modal ──────────────────────────────────────────────────── */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Complete Payment</h3>
            <p className="text-gray-500 text-sm mb-1">You'll be redirected to secure gateway.</p>
            <p className="text-xs text-gray-400 font-mono mb-6">Booking: {payModal}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setPayModal(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => setPayModal(null)}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all active:scale-95"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
