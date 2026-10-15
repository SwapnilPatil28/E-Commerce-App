import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/customers$/, "")
  : "http://localhost:5000";

const orderClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const createPaymentOrder = async (shippingAddress) => {
  const { data } = await orderClient.post("/orders/create-payment-order", { shippingAddress });
  return data;
};

export const verifyPayment = async (paymentData) => {
  const { data } = await orderClient.post("/orders/verify-payment", paymentData);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await orderClient.get("/orders");
  return data;
};

export const getOrderById = async (orderId) => {
  const { data } = await orderClient.get(`/orders/${orderId}`);
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await orderClient.patch(`/orders/${orderId}/status`, { status });
  return data;
};

export default orderClient;
