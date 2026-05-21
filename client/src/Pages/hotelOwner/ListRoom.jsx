import React, { useState, useEffect } from "react";
import Title from "../../Components/Title";
import { useAppContext } from "../../context/AppContext.jsx"; 
import { toast } from "react-hot-toast";

const ListRoom = () => {
<<<<<<< HEAD
  // Global App Context se methods aur user liye
  const { axios, getToken, user, currency } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIXED: Ek hi standard function rakha hai jo Owner ke rooms fetch karega
  const fetchOwnerRooms = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      // Backend standard endpoint ko hit kiya
      const { data } = await axios.get("/api/rooms/owner-rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message || "Failed to fetch rooms");
      }
    } catch (error) {
      console.error("Fetch Rooms Error:", error.message);
      toast.error(error.response?.data?.message || "Error loading rooms from server");
    } finally {
      setLoading(false);
    }
  };

  // Room ki availability toggle karne ka function
  const toggleAvailability = async (roomId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/rooms/toggle-availability",
        { roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "Availability updated!");
        
        // Dynamic state update bina reload kiye
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room._id === roomId ? { ...room, isAvailable: data.isAvailable } : room
          )
        );
      } else {
        toast.error(data.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Toggle Error:", error.message);
      toast.error(error.response?.data?.message || "Server error while updating status");
    }
  };

  // Jab user authenticate ho jaye, tab data call ho
  useEffect(() => {
    if (user) {
      fetchOwnerRooms();
    }
  }, [user]);

  if (loading) {
    return <div className="pt-20 text-center text-xl">Loading Rooms Listing...</div>;
  }

  return (
    <div>
      {/* Title Component */}
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />
=======
  const [rooms, setRooms] = useState(roomsDummyData);

  // Toggle availability
  const toggleAvailability = (index) => {
    const updatedRooms = [...rooms];
    updatedRooms[index].isAvailable = !updatedRooms[index].isAvailable;
    setRooms(updatedRooms);
  };

  return (
    <div>
      {/* Title */}
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />
>>>>>>> 5642f55940293f1ecde63c3ce0d42ae7339f1a5e

      <p className="text-gray-500 mt-8">All Rooms</p>

<<<<<<< HEAD
      {/* Table Container */}
      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-auto mt-3">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Facilities
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Price / night
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Availability
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-sm">
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-400">
                  No rooms added yet. Go to Add Room panel.
                </td>
              </tr>
            ) : (
              rooms.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Room Type */}
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {item.roomType}
                  </td>

                  {/* Amenities */}
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                    {item.amenities && item.amenities.length > 0
                      ? item.amenities.join(", ")
                      : "No amenities"}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                    {currency }{item.pricePerNight}
                  </td>

                  {/* FIXED Toggle Switch UI alignment */}
                  <td className="py-3 px-4 border-t border-gray-300 text-center">
                    <div className="flex items-center justify-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={item.isAvailable !== false} 
                          onChange={() => toggleAvailability(item._id)} 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
=======
      {/* Table */}
      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>

              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Facilities
              </th>

              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Price / night
              </th>

              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Availability
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="text-sm">
            {rooms.map((item, index) => (
              <tr key={index}>
                {/* Room Type */}
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {item.roomType}
                </td>

                {/* Amenities */}
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {item.amenities.join(", ")}
                </td>

                {/* Price */}
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  ₹{item.pricePerNight}
                </td>

                {/* Toggle */}
                <td className="py-3 px-4 border-t border-gray-300 text-center">
                  <label className="relative inline-flex items-center cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                      onChange={() => toggleAvailability(index)}
                    />

                    <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200">
                      <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></span>
                    </div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
>>>>>>> 5642f55940293f1ecde63c3ce0d42ae7339f1a5e
};

export default ListRoom;