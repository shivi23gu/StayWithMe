import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createRoom,
  getAllRooms,
  getOwnerRooms,
  toggleRoomAvailability
} from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.get('/', getAllRooms);
roomRouter.post('/', protect, createRoom); // ✅ upload middleware hata diya
roomRouter.get('/owner-rooms', protect, getOwnerRooms);
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability);

export default roomRouter;