import User from "../models/User.js";
import Hotel from "../models/Hotel.js";

export const getUserData = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });

        if (!user) {
            return res.json({ 
                success: true, 
                role: "user",
                username: "",
                email: "",
                image: "",
                recentSearchedCities: [] 
            });
        }

        const hotel = await Hotel.findOne({ owner: req.userId });
        
        if (hotel && user.role !== "hotelOwner") {
            user.role = "hotelOwner";
            await user.save();
        }

        res.json({ 
            success: true, 
            role: user.role || "user",
            username: user.username,
            email: user.email,
            image: user.image,
            recentSearchedCities: user.recentSearchCities || [] 
        });
    } catch (error) {
        console.error("Get User Data Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        const user = await User.findOne({ _id: req.userId });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }