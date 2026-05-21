import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities, images } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.json({ success: false, message: "User Authentication Failed" });
        }

        const hotel = await Hotel.findOne({ owner: userId });
        if (!hotel) {
            return res.json({ success: false, message: "No Hotel found for this owner account" });
        }

        if (!images || images.length === 0) {
            return res.json({ success: false, message: "Please upload at least one room image" });
        }

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