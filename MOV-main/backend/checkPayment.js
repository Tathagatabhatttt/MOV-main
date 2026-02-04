// backend/checkPayment.js
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get("/api/check-payment", async (req, res) => {
  const { paymentLinkId } = req.query;

  const link = await razorpay.paymentLink.fetch(paymentLinkId);

  res.json({ status: link.status }); // "paid" or "created"
});
