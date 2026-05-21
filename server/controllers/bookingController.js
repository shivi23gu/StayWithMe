import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Helper Function to Check Availability of Room (Internal use)
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error("Availability Check Error:", error.message);
        return false;
    }
}

// API to check availability of room
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to create a new booking
export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        const roomData = await Room.findById(room).populate("hotel");
        if (!roomData) {
            return res.json({ success: false, message: "Room not found" });
        }

        const hotel = roomData.hotel._id;

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = roomData.pricePerNight * nights;

        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        if (!isAvailable) {
            return res.json({ success: false, message: "Room is already booked for these dates" });
        }

        const newBooking = await Booking.create({
            user,
            room,
            hotel,
            checkInDate,
            checkOutDate,
            totalPrice,
            guests,
        });

        // BUG FIX: email ab authMiddleware se seedha req.user.email mein aata hai
        const recipientEmail = req.user?.email;
        const displayUsername = req.user?.username || "Valued Guest";

        if (!recipientEmail) {
            console.error("No email found for user:", req.user?.id);
            // BUG FIX: Email na mile toh bhi booking success return karo, sirf email skip karo
            return res.json({ success: true, message: "Booking successful", booking: newBooking });
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: recipientEmail,
            subject: 'Hotel Booking Details',
            html: `
            <h2>Your Booking Details</h2>
            <p>Dear ${displayUsername},</p>
            <p>Thank you for your booking! Here are your details:</p>
            <ul>
                <li><strong>Booking ID:</strong> ${newBooking._id}</li>
                <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                <li><strong>Check-In:</strong> ${new Date(newBooking.checkInDate).toDateString()}</li>
                <li><strong>Check-Out:</strong> ${new Date(newBooking.checkOutDate).toDateString()}</li>
                <li><strong>Nights:</strong> ${nights}</li>
                <li><strong>Booking Amount:</strong> ₹${newBooking.totalPrice}</li>
            </ul>
            <p>We look forward to welcoming you!</p>
            <p>If you need to make any changes, feel free to contact us.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Booking successful", booking: newBooking });

    } catch (error) {
        console.error("Booking Error:", error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to get all bookings for a logged-in user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user })
            .populate("room hotel")
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
}

// API to get bookings for a specific hotel (For Owner)
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.user.id });

        if (hotel) {
            const bookings = await Booking.find({ hotel: hotel._id })
                .populate("room user")
                .sort({ createdAt: -1 });
            return res.json({ success: true, bookings });
        }

        res.json({ success: false, message: "No hotel found" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const stripePayment = async(req, res)=>{
    try{
     const {bookingId} = req.body;
     const booking = await Booking.findById(bookingId);
     const roomData = await Room.findById(booking.room).populate('hotel');
     const totalPrice = booking.totalPrice;
     const {origin} = req.headers;

    

    }catch(error){

    }
}
