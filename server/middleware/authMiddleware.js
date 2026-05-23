import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.json({ success: false, message: "Token missing" });
        }

        const decoded = JSON.parse(atob(token.split('.')[1]));

        if (!decoded || !decoded.sub) {
            return res.json({ success: false, message: "Invalid token" });
        }

        let userFromDB = await User.findOne({ _id: decoded.sub });

        // ✅ Naya user hai toh MongoDB mein create karo
    if (!userFromDB) {
    userFromDB = await User.create({
        _id: decoded.sub,
        username: decoded.name || decoded.username || decoded.email?.split("@")[0] || "User",
        email: decoded.email || "",
        image: decoded.image_url || decoded.picture || "",  // ✅ fallback
        role: "user",
        recentSearchCities: []
    });
    console.log("✅ New user created:", userFromDB._id);
}

        req.user = {
            id: decoded.sub,
            _id: decoded.sub,
            email: userFromDB.email,
            username: userFromDB.username,
        };

        req.userId = decoded.sub;
        next();
    } catch (error) {
        console.log("Auth Error:", error.message);
        return res.json({ success: false, message: "Authentication Failed" });
    }
};