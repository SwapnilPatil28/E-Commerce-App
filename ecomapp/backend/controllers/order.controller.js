import crypto from "crypto";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import { getRazorpay } from "../config/razorpay.js";
import { usdToPaise, paiseToInr, CURRENCY } from "../config/pricing.js";

const VALID_STATUSES = ["PENDING_PAYMENT", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

// Razorpay minimum order amount (₹1)
const MIN_ORDER_PAISE = 100;

// Adds INR price fields to an order (older orders convert the saved USD price)
function serializeOrder(order) {
  const plain = typeof order.toObject === "function" ? order.toObject() : { ...order };
  plain.items = (plain.items || []).map((item) => {
    const unitPaise =
      typeof item.priceInr === "number" ? Math.round(item.priceInr * 100) : usdToPaise(item.price);
    return {
      ...item,
      priceInr: paiseToInr(unitPaise),
      lineTotalInr: paiseToInr(unitPaise * item.quantity),
    };
  });
  return plain;
}

export async function createPaymentOrder(req, res) {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: "Shipping address is required" });
    }

    const { fullName, phone, addressLine1, city, state, pincode } = shippingAddress;

    if (
      !fullName?.trim() ||
      !phone?.trim() ||
      !addressLine1?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !pincode?.trim()
    ) {
      return res.status(400).json({ success: false, message: "All shipping address fields are required" });
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.trim().replace(/\D/g, ""))) {
      return res.status(400).json({ success: false, message: "Please provide a valid phone number" });
    }

    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(pincode.trim())) {
      return res.status(400).json({ success: false, message: "Pincode must contain 6 digits" });
    }

    const customer = await Customer.findById(req.user._id).populate("cart.product");
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer account not found" });
    }

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty. Add products before checkout." });
    }

    // Charge comes only from DB prices and the saved cart, never from the request
    const orderItems = [];
    let totalPaise = 0;

    for (const item of customer.cart) {
      const productId = item.product?._id || item.product;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "A product in your cart is no longer available. Please update your cart.",
        });
      }

      const requestedQty = Number(item.quantity) || 1;
      if (requestedQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title || product.name}. Only ${product.stock} available.`,
        });
      }

      const unitPaise = usdToPaise(product.price);
      if (!Number.isSafeInteger(unitPaise) || unitPaise <= 0) {
        return res.status(400).json({
          success: false,
          message: `Pricing is unavailable for ${product.title || product.name}. Please remove it from your cart.`,
        });
      }

      totalPaise += unitPaise * requestedQty;

      orderItems.push({
        product: product._id,
        name: product.title || product.name || "Product",
        price: Number(product.price),
        priceInr: paiseToInr(unitPaise),
        quantity: requestedQty,
        image: product.thumbnail || product.images?.[0] || "",
      });
    }

    if (totalPaise < MIN_ORDER_PAISE) {
      return res.status(400).json({ success: false, message: "Order total must be at least ₹1." });
    }

    const amountInPaise = totalPaise;
    const totalAmountInr = paiseToInr(totalPaise);

    // Clean up any previous uncompleted pending payment attempts for this user
    await Order.deleteMany({ user: customer._id, status: "PENDING_PAYMENT" });

    const newOrder = await Order.create({
      user: customer._id,
      items: orderItems,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      },
      totalAmount: totalAmountInr,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT",
    });

    const razorpayClient = getRazorpay();
    const razorpayOrder = await razorpayClient.orders.create({
      amount: amountInPaise,
      currency: CURRENCY,
      receipt: newOrder._id.toString(),
    });

    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully",
      shopKartOrderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: CURRENCY,
      key: process.env.RAZORPAY_KEY_ID,
      order: serializeOrder(newOrder),
    });
  } catch (error) {
    console.error("createPaymentOrder error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to create payment order",
    });
  }
}

export async function verifyPayment(req, res) {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!shopKartOrderId || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification parameters" });
    }

    if (!mongoose.isValidObjectId(shopKartOrderId)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access to this order" });
    }

    // Already paid: return as is (prevents double stock deduction)
    if (order.paymentStatus === "PAID") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order: serializeOrder(order),
      });
    }

    const trustedOrderId = order.razorpayOrderId || razorpay_order_id;
    const signPayload = `${trustedOrderId}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(signPayload.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = "FAILED";
      await order.save();
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Atomic PAID update so only one request deducts stock
    const paidOrder = await Order.findOneAndUpdate(
      { _id: order._id, paymentStatus: { $ne: "PAID" } },
      { $set: { paymentStatus: "PAID", status: "PLACED", razorpayPaymentId: razorpay_payment_id } },
      { new: true }
    );

    if (!paidOrder) {
      const existing = await Order.findById(order._id);
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order: serializeOrder(existing),
      });
    }

    for (const item of paidOrder.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    await Customer.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });

    return res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed",
      order: serializeOrder(paidOrder),
    });
  } catch (error) {
    console.error("verifyPayment error:", error);
    return res.status(500).json({ success: false, message: "Unable to verify payment" });
  }
}

export async function getMyOrders(req, res) {
  try {
    const filter = {
      user: req.user._id,
      paymentStatus: "PAID",
    };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      orders: orders.map(serializeOrder),
    });
  } catch (error) {
    console.error("getMyOrders error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch orders" });
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to access this order" });
    }

    return res.status(200).json({
      success: true,
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("getOrderById error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch order details" });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Only the owner can advance a paid order, one step at a time
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this order" });
    }

    if (order.paymentStatus !== "PAID") {
      return res.status(400).json({ success: false, message: "Only paid orders can change status" });
    }

    const currentIndex = VALID_STATUSES.indexOf(order.status);
    if (VALID_STATUSES.indexOf(status) !== currentIndex + 1) {
      return res.status(400).json({
        success: false,
        message: "Order status can only move forward one step at a time",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return res.status(500).json({ success: false, message: "Unable to update order status" });
  }
}
