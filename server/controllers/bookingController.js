import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Stripe from "stripe";

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });
        return bookings.length === 0;
    } catch (error) {
        console.error("Availability Check Error:", error.message);
        return false;
    }
};

export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

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

        const recipientEmail = req.user?.email;
        const displayUsername = req.user?.username || "Valued Guest";

        if (recipientEmail) {
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
                `
            };

        
            try {
                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                console.error("Email send failed:", emailError.message);
            }
        }

     
        res.json({ success: true, message: "Booking confirmed! 🎉", booking: newBooking });

    } catch (error) {
        console.error("Booking Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

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
};

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
};

export const stripePayment = async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        const roomData = await Room.findById(booking.room).populate('hotel');
        const origin = process.env.FRONTEND_URL || req.headers.origin;
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: roomData.hotel.name,
                    },
                    unit_amount: booking.totalPrice * 100,
                },
                quantity: 1,
            }
        ];

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader/verify-payment?bookingId=${bookingId}&sessionId={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/loader/my-bookings`,
            metadata: { bookingId },
        });

        res.json({ success: true, url: session.url });

    } catch (error) {
        console.error("Stripe Payment Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { bookingId, sessionId } = req.body;

        if (!bookingId || !sessionId) {
            return res.json({ success: false, message: "Missing bookingId or sessionId" });
        }

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            await Booking.findByIdAndUpdate(bookingId, { isPaid: true });
            return res.json({ success: true, message: "Payment verified and booking updated" });
        } else {
            return res.json({ success: false, message: "Payment not completed" });
        }

    } catch (error) {
        console.error("Verify Payment Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

export const stripeWebhook = async (req, res) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (bookingId) {
            try {
                await Booking.findByIdAndUpdate(bookingId, { isPaid: true });
                console.log(`Booking ${bookingId} marked as paid`);
            } catch (err) {
                console.error("Failed to update booking:", err.message);
            }
        }
    }

    res.json({ received: true });
};