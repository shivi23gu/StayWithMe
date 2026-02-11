import React, { useState } from "react";
import Title from "../../Components/Title";
import { assets } from "../../assets/assets";

const AddRoom = () => {

  // Images
  const [images, setImages] = useState([null, null, null, null]);

  // Form Inputs
  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: "",
    amenities: {
      "Free Wifi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Pool Access": false,
    },
  });

  // Image Handler
  const handleImageChange = (index, file) => {
    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...inputs,
      images,
    };

    console.log("ROOM DATA:", data);
  };

  return (
    <form onSubmit={handleSubmit} className="pb-10">

      {/* Title */}
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Fill in the details carefully and provide accurate room details, pricing, and amenities to enhance the user booking experience."
      />

      {/* Images */}
      <p className="text-gray-800 mt-10">Images</p>

      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {images.map((img, index) => (
          <label
            key={index}
            htmlFor={`roomImage${index}`}
            className="cursor-pointer"
          >
            <img
              src={img ? URL.createObjectURL(img) : assets.uploadArea}
              alt="upload"
              className="w-24 h-24 object-cover border rounded"
            />

            <input
              type="file"
              accept="image/*"
              hidden
              id={`roomImage${index}`}
              onChange={(e) =>
                handleImageChange(index, e.target.files[0])
              }
            />
          </label>
        ))}
      </div>

      {/* Room Type & Price */}
      <div className="w-full flex gap-6 mt-4">

        {/* Room Type */}
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>

          <select
            value={inputs.roomType}
            onChange={(e) =>
              setInputs({ ...inputs, roomType: e.target.value })
            }
            className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <p className="mt-4 text-gray-800">
            Price <span className="text-xs">/night</span>
          </p>

          <input
            type="number"
            placeholder="0"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={inputs.pricePerNight}
            onChange={(e) =>
              setInputs({ ...inputs, pricePerNight: e.target.value })
            }
          />
        </div>
      </div>

      {/* Amenities */}
      <p className="text-gray-800 mt-6">Amenities</p>

      <div className="flex flex-col flex-wrap mt-2 text-gray-600 max-w-sm gap-2">

        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index} className="flex items-center gap-2">

            <input
              type="checkbox"
              id={`amenity${index}`}
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity],
                  },
                })
              }
            />

            <label htmlFor={`amenity${index}`}>
              {amenity}
            </label>

          </div>
        ))}

      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded mt-8"
      >
        Add Room
      </button>

    </form>
  );
};

export default AddRoom;
