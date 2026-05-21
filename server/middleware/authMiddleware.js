
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
 
        // Clerk token decode
        const decoded = JSON.parse(atob(token.split('.')[1]));
 
        if (!decoded || !decoded.sub) {
            return res.json({ success: false, message: "Invalid token" });
        }
 
        // BUG FIX: findById ki jagah findOne({_id}) use karo
        // kyunki User model mein _id String type hai, ObjectId nahi
        const userFromDB = await User.findOne({ _id: decoded.sub });
 
        req.user = {
            id: decoded.sub,
            _id: decoded.sub,
            email: userFromDB?.email || null,
            username: userFromDB?.username || "Valued Guest",
        };
 
        req.userId = decoded.sub;
 
        next();
    } catch (error) {
        console.log("Auth Error:", error.message);
        return res.json({ success: false, message: "Authentication Failed" });
    }
};
 
