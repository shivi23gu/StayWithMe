import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { 
  createRoom,
  getAllRooms,
  getOwnerRooms, 
  toggleRoomAvailability 
} from "../controllers/roomController.js";

const roomRouter = express.Router();

// BUG FIX: Public GET route add kiya - home page ke liye saare rooms
roomRouter.get('/', getAllRooms);

roomRouter.post('/', protect, upload.array("images", 4), createRoom);
roomRouter.get('/owner-rooms', protect, getOwnerRooms);
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability);

export default roomRouter;
