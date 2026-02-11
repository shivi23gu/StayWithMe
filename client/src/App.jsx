import React from "react";
import Navbar from "./Components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Footer from "./Components/Footer";
import AllRooms from "./Pages/AllRooms";
import RoomDetails from "./Pages/RoomDetails";
import MyBookings from "./Pages/MyBookings";
import HotelReg from "./Components/HotelReg";
import Layout from "./Pages/hotelOwner/Layout";

// OWNER PAGES
import OwnerDashboard from "./Pages/hotelOwner/Dashboard";
import AddRoom from "./Pages/hotelOwner/AddRoom";
import ListRoom from "./Pages/hotelOwner/ListRoom";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div>
      {!isOwnerPath && <Navbar />}

      <div className="min-h-[70vh]">
        <Routes>
          {/* --- USER ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />

          {/* Corrected path to /room/:id (singular) */}
          <Route path="/room/:id" element={<RoomDetails />} />

          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/register-hotel" element={<HotelReg />} />

          {/* --- OWNER ROUTES (Nested) --- */}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<OwnerDashboard />} />
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<div className="pt-40 text-center">Page Not Found</div>} />
        </Routes>
      </div>

      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;