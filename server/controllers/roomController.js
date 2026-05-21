import { v2 as cloudinary } from "cloudinary";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.json({ success: false, message: "User Authentication Failed" });
        }

        const hotel = await Hotel.findOne({ owner: userId });
        if (!hotel) {
            return res.json({ success: false, message: "No Hotel found for this owner account" });
        }

        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, message: "Please upload at least one room image" });
        }

        // Buffer se directly Cloudinary pe upload karo (no disk needed)
        const uploadImages = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "hotel-rooms" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                stream.end(file.buffer); // file.path nahi, file.buffer use karo
            });
        });

        const images = await Promise.all(uploadImages);

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: Number(pricePerNight),
            amenities: amenities ? JSON.parse(amenities) : [],
            images,
        });

        res.json({ success: true, message: "Room created successfully" });

    } catch (error) {
        console.error("Create Room Error:", error.message);
        res.json({ success: false, message: "Server Error: " + error.message });
    }
};

// BUG FIX: getAllRooms add kiya - ye missing tha, isliye home page pe rooms nahi aa rahe the
export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).populate("hotel");
        res.json({ success: true, rooms });
    } catch (error) {
        console.error("Get All Rooms Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

export const getOwnerRooms = async (req, res) => {
    try {
        const userId = req.user?.id;
        const hotel = await Hotel.findOne({ owner: userId });

        if (!hotel) {
            return res.json({ success: false, message: "No hotel found" });
        }

        const rooms = await Room.find({ hotel: hotel._id });
        res.json({ success: true, rooms });

    } catch (error) {
        console.log("Get Owner Rooms Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const room = await Room.findById(roomId);

        if (!room) {
            return res.json({ success: false, message: "Room not found" });
        }

        room.isAvailable = !room.isAvailable;
        await room.save();

        res.json({ success: true, message: "Availability updated", isAvailable: room.isAvailable });

    } catch (error) {
        console.log("Toggle Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
