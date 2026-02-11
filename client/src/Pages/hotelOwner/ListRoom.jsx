import React, { useState } from "react";
import { roomsDummyData } from "../../assets/assets";
import Title from "../../Components/Title";

const ListRoom = () => {
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

      <p className="text-gray-500 mt-8">All Rooms</p>

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
};

export default ListRoom;
