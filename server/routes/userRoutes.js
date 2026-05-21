import express from "express";
import { getUserData, storeRecentSearchedCities } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // Middleware ko import kiya

const userRouter = express.Router();

// FIX: Yahan getUserData se PEHLE 'protect' middleware lagana zaroori hai
userRouter.get('/', protect, getUserData);

// Ispe bhi protect laga do taaki safe rahe
userRouter.post('/recent-search', protect, storeRecentSearchedCities);

export default userRouter;