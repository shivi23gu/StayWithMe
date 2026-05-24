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
import Loader from "./Components/Loader.jsx";
import VerifyPayment from "./Pages/VerifyPayment.jsx";

import OwnerDashboard from "./Pages/hotelOwner/Dashboard";
import AddRoom from "./Pages/hotelOwner/AddRoom";
import ListRoom from "./Pages/hotelOwner/ListRoom";



const ProtectedUserRoute = ({ children }) => {
  const { user, userLoading } = useAppContext();
  
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const ProtectedOwnerRoute = ({ children }) => {
  const { user, userLoading, isOwner } = useAppContext();
  
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }
  if (!user || !isOwner) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  const location = useLocation();
  const isOwnerPath = location.pathname.includes("owner");
  const { showHotelReg, isOwner } = useAppContext();

  return (
    <div>
      <Toaster />
      
      {!isOwnerPath && <Navbar />}
      
      {showHotelReg && location.pathname !== "/register-hotel" && <HotelReg />}

      <div className="min-h-[70vh]">
        <Routes>
 
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/loader/:nextUrl" element={<Loader />} />

          <Route
            path="/verify-payment"
            element={
              <ProtectedUserRoute>
                <VerifyPayment />
              </ProtectedUserRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedUserRoute>
                <MyBookings />
              </ProtectedUserRoute>
            }
          />


          <Route
            path="/register-hotel"
            element={isOwner ? <Navigate to="/owner" replace /> : <HotelReg />}
          />

          <Route
            path="/owner"
            element={
              <ProtectedOwnerRoute>
                <Layout />
              </ProtectedOwnerRoute>
            }
          >
            <Route index element={<OwnerDashboard />} />
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>

          <Route path="*" element={<div className="pt-40 text-center text-gray-500 font-medium">Page Not Found</div>} />
        </Routes>
      </div>

      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;
