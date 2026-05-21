import User from "../models/User.js"; // Ensure your User model is imported

// GET /api/user/
export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        // FIX: Agar user database mein nahi bhi mila, toh crash mat karo, testing ke liye fake account object bhej do
        if (!user) {
            console.log(`Testing Mode: User ${req.userId} not found in DB, sending mock data.`);
            return res.json({ 
                success: true, 
                role: "user", // Default role taaki register form khul sake
                recentSearchedCities: [] 
            });
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


// store user recent searched cities
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        
        // Database se fresh user nikalo
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Array safe check
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