import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, updateOrderStatus } from '../services/orderApi';
import { formatInr } from '../utils/helpers';
import { toast } from 'react-toastify';

const STATUS_STEPS = ['PENDING_PAYMENT', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Unable to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleProgressStatus = async (orderId, currentStatus) => {
    const currentIndex = STATUS_STEPS.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex >= STATUS_STEPS.length - 1) {
      toast.info('Order has already reached final status (DELIVERED).');
      return;
    }

    const nextStatus = STATUS_STEPS[currentIndex + 1];
    try {
      setUpdatingId(orderId);
      const res = await updateOrderStatus(orderId, nextStatus);
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: res.order.status } : ord))
      );
      toast.success(`Order status advanced to ${nextStatus}! 🚚`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-400 text-black';
      case 'SHIPPED':
        return 'bg-blue-400 text-black';
      case 'CONFIRMED':
        return 'bg-yellow-300 text-black';
      case 'PLACED':
        return 'bg-cyan-300 text-black';
      case 'PENDING_PAYMENT':
        return 'bg-orange-300 text-black';
      default:
        return 'bg-gray-200 text-black';
    }
  };

  if (loading) {
    return (
      <section className="w-full max-w-4xl mx-auto bg-yellow-300 border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
        <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight">
          Loading your orders...
        </h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-4xl mx-auto bg-pink-300 border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-6">
        <h1 className="bg-white border-4 border-black px-6 py-2 font-black text-2xl md:text-3xl uppercase tracking-tight shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center">
          Unable to load your orders.
        </h1>
        <p className="font-bold text-gray-800">{error}</p>
        <button
          onClick={fetchOrders}
          className="bg-white hover:bg-black hover:text-white border-4 border-black px-8 py-3 font-black uppercase text-lg shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none cursor-pointer"
        >
          Try Again
        </button>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="w-full max-w-4xl mx-auto bg-pink-300 border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="bg-white border-4 border-black px-6 py-3 font-black text-2xl md:text-3xl uppercase tracking-tight shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          You have not placed any orders yet. 📦
        </h1>
        <p className="font-bold text-lg max-w-md">
          Explore our collection and order your favorite electronics today!
        </p>
        <Link
          to="/products"
          className="bg-yellow-300 hover:bg-black hover:text-white border-4 border-black px-8 py-4 font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
        >
          Start Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <div className="bg-cyan-300 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-black text-3xl uppercase tracking-tight">My Orders</h1>
          <p className="font-bold text-sm text-gray-800">
            Total Orders Placed: {orders.length}
          </p>
        </div>
        <Link
          to="/products"
          className="bg-white hover:bg-black hover:text-white border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          Browse More
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {orders.map((order) => {
          const dateStr = new Date(order.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <div
              key={order._id}
              className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-5"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-black pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-lg md:text-xl uppercase font-mono">
                      Order #{order._id.substring(order._id.length - 8)}
                    </span>
                    <span
                      className={`border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status || 'PLACED'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-600 block mt-1">
                    Placed on {dateStr}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-2xl text-pink-600">
                    {formatInr(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Items List Snapshot */}
              <div className="flex flex-col gap-3 bg-gray-50 border-2 border-black p-4">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 border-b-2 border-dashed border-gray-300 pb-2 last:border-0 last:pb-0"
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
                        <p className="font-black text-sm uppercase">{item.name}</p>
                        <p className="text-xs font-bold text-gray-500">
                          {item.quantity} unit{item.quantity > 1 ? 's' : ''} × {formatInr(item.priceInr)}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-sm">
                      {formatInr(item.lineTotalInr)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping info and actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                {order.shippingAddress && (
                  <div className="text-xs font-bold text-gray-700">
                    <span className="font-black uppercase text-black block">Ship To:</span>
                    {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1},{' '}
                    {order.shippingAddress.city} - {order.shippingAddress.pincode}
                  </div>
                )}

                <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
                  {/* Status Progression Demo Button (Bonus) */}
                  {order.status !== 'DELIVERED' && (
                    <button
                      onClick={() => handleProgressStatus(order._id, order.status)}
                      disabled={updatingId === order._id}
                      title="Advance status for demo/testing purposes"
                      className="bg-yellow-200 hover:bg-yellow-400 border-2 border-black px-3 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {updatingId === order._id ? 'Updating...' : 'Advance Status ⚡'}
                    </button>
                  )}

                  <Link
                    to={`/order-success/${order._id}`}
                    state={{ order }}
                    className="bg-lime-300 hover:bg-black hover:text-white border-2 border-black px-4 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Orders;
