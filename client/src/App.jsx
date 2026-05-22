import React from "react";
import Navbar from "./Components/Navbar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Footer from "./Components/Footer";
import AllRooms from "./Pages/AllRooms";
import RoomDetails from "./Pages/RoomDetails";
import MyBookings from "./Pages/MyBookings";
import HotelReg from "./Components/HotelReg";
import Layout from "./Pages/hotelOwner/Layout";
import { Toaster } from 'react-hot-toast';
import { useAppContext } from "./context/AppContext.jsx";

// OWNER PAGES
import OwnerDashboard from "./Pages/hotelOwner/Dashboard";
import AddRoom from "./Pages/hotelOwner/AddRoom";
import ListRoom from "./Pages/hotelOwner/ListRoom";

// ✅ NEW: User Dashboard
import UserDashboard from "./Pages/UserDashboard";

// ── Protected Route for logged-in users ──────────────────────────────────────
const ProtectedUserRoute = ({ children }) => {
  const { user, userLoading } = useAppContext();
  if (userLoading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  );
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg, isOwner } = useAppContext();

  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}

      <div className="min-h-[70vh]">
        <Routes>
          {/* USER ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          {/* ✅ NEW: User Dashboard — protected, login hone ke baad khulega */}
          <Route
            path="/dashboard"
            element={
              <ProtectedUserRoute>
                {isOwner ? <Navigate to="/owner" replace /> : <UserDashboard />}
              </ProtectedUserRoute>
            }
          />

          {/* /register-hotel — already owner hai toh owner dashboard */}
          <Route
            path="/register-hotel"
            element={isOwner ? <Navigate to="/owner" replace /> : <HotelReg />}
          />

          {/* OWNER ROUTES */}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<OwnerDashboard />} />
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<div className="pt-40 text-center">Page Not Found</div>} />
        </Routes>
      </div>

      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;
