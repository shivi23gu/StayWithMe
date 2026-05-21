import express from "express";
import "dotenv/config";
import cors from "cors";

import connectDB from "./configs/db.js";
import "./configs/cloudinary.js";

import { clerkMiddleware } from "@clerk/express";

import clerkWebhooks from "./controllers/clerkWebhooks.js";

import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";


// ============================
// DATABASE CONNECTION
// ============================
connectDB();

const app = express();

// ============================
// ENV CHECK (remove after fixing)
// ============================
console.log("Cloudinary ENV check:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET?.slice(0, 5) + "...",
});

// ============================
// CORS (Fixed for withCredentials)
// ============================
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-clerk-user-id", "userid"]
  })
);

// ============================
// MIDDLEWARES
// ============================
app.use(express.json());

app.use(clerkMiddleware());


// ============================
// TEST ROUTE
// ============================
app.get("/", (req, res) => {
  res.send("API is working fine");
});


// ============================
// CLERK WEBHOOK
// ============================
app.use("/api/clerk", clerkWebhooks);


// ============================
// API ROUTES
// ============================
app.use("/api/user", userRouter);

app.use("/api/hotels", hotelRouter);

app.use("/api/rooms", roomRouter);

app.use("/api/bookings", bookingRouter);


// ============================
// SERVER
// ============================
const PORT = process.env.PORT || 3000;

console.log("NEW SERVER FILE RUNNING");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});