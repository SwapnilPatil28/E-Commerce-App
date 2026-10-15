import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getOrderById } from '../services/orderApi';
import { formatPrice, formatInr } from '../utils/helpers';

function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const data = await getOrderById(id);
          setOrder(data.order);
        } catch (err) {
          setError(err.response?.data?.message || 'Unable to load order details');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <section className="w-full max-w-3xl mx-auto bg-yellow-300 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
        <h1 className="font-black text-2xl uppercase">Loading your order confirmation...</h1>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="w-full max-w-3xl mx-auto bg-pink-300 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col items-center gap-6">
        <h1 className="bg-white border-4 border-black px-6 py-2 font-black text-2xl uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {error || 'Order not found'}
        </h1>
        <Link
          to="/orders"
          className="bg-white hover:bg-black hover:text-white border-4 border-black px-6 py-3 font-black uppercase text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          View My Orders
        </Link>
      </section>
    );
  }

  return (
    <section className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-lime-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center font-black text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          ✅
        </div>
        <h1 className="font-black text-3xl md:text-4xl uppercase tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="font-bold text-base text-gray-800 max-w-md">
          Your payment has been verified and your order has been saved successfully in Neo Mart.
        </p>
      </div>

      {/* Details Card */}
      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b-4 border-black pb-6">
          <div>
            <span className="font-black text-xs uppercase text-gray-500 block mb-1">
              Order ID
            </span>
            <span className="font-black text-sm uppercase break-all font-mono bg-yellow-200 border-2 border-black px-2 py-1 inline-block">
              {order._id}
            </span>
          </div>

          <div>
            <span className="font-black text-xs uppercase text-gray-500 block mb-1">
              Payment Status
            </span>
            <span className="font-black text-sm uppercase bg-lime-300 border-2 border-black px-2 py-1 inline-block">
              {order.paymentStatus || 'PAID'}
            </span>
          </div>

          <div>
            <span className="font-black text-xs uppercase text-gray-500 block mb-1">
              Order Status
            </span>
            <span className="font-black text-sm uppercase bg-cyan-300 border-2 border-black px-2 py-1 inline-block">
              {order.status || 'PLACED'}
            </span>
          </div>
        </div>

        {/* Purchased Items Snapshot */}
        <div>
          <h2 className="font-black text-xl uppercase mb-3">Purchased Items</h2>
          <div className="flex flex-col gap-3 border-2 border-black bg-gray-50 p-4">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 border-b-2 border-dashed border-black pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover border-2 border-black shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-black text-sm uppercase leading-tight">{item.name}</p>
                    <p className="text-xs font-bold text-gray-600">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
                <span className="font-black text-base shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Summary */}
        {order.shippingAddress && (
          <div className="bg-yellow-100 border-2 border-black p-4">
            <h3 className="font-black text-sm uppercase mb-1">Delivering To</h3>
            <p className="font-bold text-sm">
              {order.shippingAddress.fullName} • {order.shippingAddress.phone}
            </p>
            <p className="text-sm font-semibold text-gray-700">
              {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center bg-pink-200 border-4 border-black p-4">
          <span className="font-black text-xl uppercase">Total Amount Paid</span>
          <span className="font-black text-3xl text-pink-600">
            {formatInr(order.totalAmount)}
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <Link
            to="/orders"
            className="w-full bg-cyan-400 hover:bg-black hover:text-white border-4 border-black p-4 font-black uppercase text-center text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            className="w-full bg-yellow-300 hover:bg-black hover:text-white border-4 border-black p-4 font-black uppercase text-center text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;
