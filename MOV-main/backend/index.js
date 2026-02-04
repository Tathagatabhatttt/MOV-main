import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import ridesRouter from "./routes/rides.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ---- TEMP DB (replace with Mongo later) ----
const USERS = {}; // { userId: { email, paid, orderId } }

// ---- Razorpay client ----
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==================== PAYMENT ROUTES ====================

// Create Order (per user)
app.post("/api/create-order", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });

  const order = await razorpay.orders.create({
    amount: 100, // ₹1
    currency: "INR",
    receipt: `movzz_${Date.now()}`,
  });

  USERS[email] = { email, paid: false, orderId: order.id };
  res.json({ order });
});

// Verify Payment (server-side)
app.post("/api/verify-payment", (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, email } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return res.status(400).json({ success: false });
  }

  if (USERS[email]?.orderId === razorpay_order_id) {
    USERS[email].paid = true;
  }

  res.json({ success: true });
});

// Gate check
app.get("/api/status", (req, res) => {
  const { email } = req.query;
  res.json({ paid: !!USERS[email]?.paid });
});

// ==================== RIDE BOOKING ROUTES ====================

// Mount ride booking routes
app.use("/api/rides", ridesRouter);

// ==================== HEALTH CHECK ====================

app.get("/", (req, res) => {
  res.json({
    status: "MOVZZ Backend Running",
    version: "1.0.0",
    endpoints: {
      payment: ["/api/create-order", "/api/verify-payment", "/api/status"],
      rides: [
        "/api/rides/auth/send-otp",
        "/api/rides/auth/verify-otp",
        "/api/rides/search",
        "/api/rides/estimates/:searchId",
        "/api/rides/book",
        "/api/rides/status/:bookingId",
        "/api/rides/cancel",
        "/api/rides/book-complete",
      ],
    },
  });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 MOVZZ Backend running on port ${PORT}`)
);
