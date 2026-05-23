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

import { stripeWebhook } from "./controllers/bookingController.js";

connectDB();

const app = express();

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

// ✅ Stripe webhook — raw body
app.post(
  "/api/bookings/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// ✅ Clerk webhook — raw body
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("API is working fine");
});

app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;