import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

export function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay keys are not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env."
    );
  }

  return new Razorpay({ key_id, key_secret });
}

// Safe fallback for startup so module import never crashes the server before env is configured
const safeKeyId = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder";
const safeKeySecret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";

const razorpay = new Razorpay({
  key_id: safeKeyId,
  key_secret: safeKeySecret,
});

export default razorpay;
