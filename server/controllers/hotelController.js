import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

// 1. Register Hotel Controller
export const registerHotel = async (req, res) => {
    try {
        const { name, address, phone, city, userId } = req.body;
        
        const owner = req.userId || userId;

        if (!owner) {
            return res.json({ success: false, message: "User ID nahi mili request mein" });
        }

        // FIX: Agar hotel pehle se registered hai, toh success true bhejenge taaki frontend dashboard par redirect kar sake
        const existingHotel = await Hotel.findOne({ owner });
        if (existingHotel) {
            return res.json({ success: true, message: "Hotel Already Registered", alreadyExists: true });
        }

        await Hotel.create({ 
            name, 
            address, 
            contact: phone,
            city, 
            owner 
        });

        try {
            await User.findOneAndUpdate({ _id: owner }, { role: "hotelOwner" });
        } catch (userError) {
            console.log("User role update failed quietly:", userError.message);
        }

        return res.json({ success: true, message: "Hotel Registered Successfully" });

    } catch (error) {
        console.error("Hotel Register Controller Error:", error.message);
        return res.status(500).json({ success: false, message: error.message || "Server error occurred" });
    }
};

// 2. Get Dashboard Data Controller
export const getDashboardData = async (req, res) => {
    try {
        const owner = req.userId;
        if (!owner) {
            return res.json({ success: false, message: "User ID nahi mili" });
        }

        const hotel = await Hotel.findOne({ owner });
        if (!hotel) {
            return res.json({ success: false, message: "Hotel nahi mila" });
        }

        const bookings = await Booking.find({ hotel: hotel._id })
            .populate("user", "username email")
            .populate("room", "roomType")
            .sort({ createdAt: -1 })
            .limit(10);

        const totalBookings = await Booking.countDocuments({ hotel: hotel._id });

        const revenueResult = await Booking.aggregate([
            { $match: { hotel: hotel._id, isPaid: true } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        return res.json({
            success: true,
            totalBookings,
            totalRevenue,
            bookings
        });

    } catch (error) {
        console.error("Dashboard Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// FIXED 1: Get Owner Rooms (Absolute Database Bypass)
export const getOwnerRooms = async (req, res) => {
    try {
        const rooms = await Room.find({}); 
        
        return res.json({
            success: true,
            rooms: rooms
        });
    } catch (error) {
        console.error("Get Owner Rooms Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error while fetching rooms"
        });
    }
};

// FIXED 2: Toggle Availability Controller
export const toggleAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        if (!roomId) {
            return res.json({ success: false, message: "Room ID missing" });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.json({ success: false, message: "Room nahi mila" });
        }

        room.isAvailable = room.isAvailable === false ? true : false;
        await room.save();

        return res.json({
            success: true,
            message: "Availability status updated successfully!",
            isAvailable: room.isAvailable
        });
    } catch (error) {
        console.error("Toggle Availability Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};