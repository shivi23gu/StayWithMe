import User from "../models/User.js";
import Hotel from "../models/Hotel.js";

export const getUserData = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });

        if (!user) {
            return res.json({ 
                success: true, 
                role: "user",
                recentSearchedCities: [] 
            });
        }

        // Check karo hotel exist karta hai ya nahi
        const hotel = await Hotel.findOne({ owner: req.userId });
        
        // Agar hotel hai but role update nahi hua toh fix karo
        if (hotel && user.role !== "hotelOwner") {
            user.role = "hotelOwner";
            await user.save();
        }

        res.json({ 
            success: true, 
            role: user.role || "user", 
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

        if (!user.recentSearchCities) {
            user.recentSearchCities = [];
        }

        if (user.recentSearchCities.length < 3) {
            user.recentSearchCities.push(recentSearchedCity);
        } else {
            user.recentSearchCities.shift();
            user.recentSearchCities.push(recentSearchedCity);
        }
        
        await user.save();
        res.json({ success: true, message: "City added" });
    } catch (error) {
        console.error("Store City Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};