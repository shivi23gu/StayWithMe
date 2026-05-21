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
// CORS
// ============================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https:\/\/stay-with-me.*\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-clerk-user-id", "userid"],
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
// LOCAL SERVER (development only)
// ============================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;