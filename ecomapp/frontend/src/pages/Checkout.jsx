import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useCart from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { createPaymentOrder, verifyPayment } from '../services/orderApi';
import { formatInr } from '../utils/helpers';

const schema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required('Full Name is required')
    .min(2, 'Name must be at least 2 characters'),
  phone: yup
    .string()
    .trim()
    .required('Phone Number is required')
    .matches(/^[0-9]{10,15}$/, 'Phone number must be at least 10 digits'),
  addressLine1: yup
    .string()
    .trim()
    .required('Address line is required')
    .min(5, 'Please provide a detailed address'),
  city: yup
    .string()
    .trim()
    .required('City is required'),
  state: yup
    .string()
    .trim()
    .required('State is required'),
  pincode: yup
    .string()
    .trim()
    .required('Pincode is required')
    .matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits'),
}).required();

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Checkout() {
  const { cartItems, cartTotal, cartSummary, refreshCart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: customer?.fullName || '',
      phone: customer?.phone || '',
      addressLine1: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const onSubmit = async (shippingData) => {
    setCheckoutError('');
    setIsProcessing(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay payment gateway. Please check your internet connection.');
      }

      const orderData = await createPaymentOrder({
        fullName: shippingData.fullName.trim(),
        phone: shippingData.phone.trim(),
        addressLine1: shippingData.addressLine1.trim(),
        city: shippingData.city.trim(),
        state: shippingData.state.trim(),
        pincode: shippingData.pincode.trim(),
      });

      // Stop if the server's amount differs from the total on screen
      if (orderData.amount !== cartSummary.totalPaise) {
        await refreshCart();
        const msg = 'Prices were updated. Please review your order total and try again.';
        setCheckoutError(msg);
        toast.warning(msg);
        setIsProcessing(false);
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Neo Mart',
        description: 'Neo Mart Order Checkout',
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              shopKartOrderId: orderData.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            await refreshCart();
            toast.success('Order placed successfully! 🎉');
            navigate(`/order-success/${orderData.shopKartOrderId}`, {
              state: { order: verifyRes.order },
            });
          } catch (err) {
            console.error('Payment verification failed:', err);
            const msg = err.response?.data?.message || 'Payment signature verification failed';
            setCheckoutError(msg);
            toast.error(msg);
            setIsProcessing(false);
          }
        },
        prefill: {
          name: shippingData.fullName,
          contact: shippingData.phone,
          email: customer?.email || '',
        },
        theme: {
          color: '#FACC15',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info('Payment window closed. Your cart is preserved.');
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', function (failureResponse) {
        console.error('Razorpay payment failed:', failureResponse);
        const reason = failureResponse.error?.description || 'Payment failed';
        setCheckoutError(reason);
        toast.error(`Payment Failed: ${reason}`);
        setIsProcessing(false);
      });

      razorpayInstance.open();
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.message || err.message || 'Unable to initiate checkout';
      setCheckoutError(msg);
      toast.error(msg);
      setIsProcessing(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <section className="w-full max-w-4xl mx-auto bg-pink-300 border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center gap-6">
        <h1 className="bg-white border-4 border-black px-6 py-3 font-black text-3xl md:text-4xl uppercase tracking-tight shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          Your Cart is Empty 🛒
        </h1>
        <p className="font-bold text-xl max-w-md">
          You don't have any items in your cart to checkout. Add some awesome products first!
        </p>
        <Link
          to="/products"
          className="bg-yellow-300 hover:bg-black hover:text-white border-4 border-black px-8 py-4 font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      <div className="bg-yellow-300 border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-black text-3xl uppercase tracking-tight">Checkout</h1>
          <p className="font-bold text-sm text-gray-800">
            Secure Razorpay Test Payment • Step 2 of 2
          </p>
        </div>
        <Link
          to="/cart"
          className="bg-white hover:bg-black hover:text-white border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          ← Back to Cart
        </Link>
      </div>

      {checkoutError && (
        <div className="bg-red-400 border-4 border-black p-4 font-black uppercase text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
          <span>⚠️ {checkoutError}</span>
          <button
            onClick={() => setCheckoutError('')}
            className="text-black bg-white px-2 py-0.5 border-2 border-black text-xs font-black uppercase"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Shipping Address Form */}
        <div className="lg:col-span-7 bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 border-b-4 border-black pb-4 mb-6">
            <span className="w-8 h-8 rounded-none bg-cyan-400 border-2 border-black flex items-center justify-center font-black text-lg">
              1
            </span>
            <h2 className="font-black text-2xl uppercase tracking-tight">
              Shipping Details
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="font-black uppercase text-sm mb-1 block">Full Name *</label>
              <input
                {...register('fullName')}
                disabled={isProcessing}
                placeholder="Aarav Sharma"
                className="w-full border-4 border-black p-3 font-bold bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
              {errors.fullName && (
                <p className="text-red-600 font-bold text-xs mt-1">
                  ⚠️ {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-black uppercase text-sm mb-1 block">Phone Number *</label>
              <input
                {...register('phone')}
                disabled={isProcessing}
                placeholder="9876543210"
                className="w-full border-4 border-black p-3 font-bold bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
              {errors.phone && (
                <p className="text-red-600 font-bold text-xs mt-1">
                  ⚠️ {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-black uppercase text-sm mb-1 block">Address Line *</label>
              <input
                {...register('addressLine1')}
                disabled={isProcessing}
                placeholder="22 MG Road, Flat 4B"
                className="w-full border-4 border-black p-3 font-bold bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
              {errors.addressLine1 && (
                <p className="text-red-600 font-bold text-xs mt-1">
                  ⚠️ {errors.addressLine1.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-black uppercase text-sm mb-1 block">City *</label>
                <input
                  {...register('city')}
                  disabled={isProcessing}
                  placeholder="Bengaluru"
                  className="w-full border-4 border-black p-3 font-bold bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
                {errors.city && (
                  <p className="text-red-600 font-bold text-xs mt-1">
                    ⚠️ {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-black uppercase text-sm mb-1 block">State *</label>
                <input
                  {...register('state')}
                  disabled={isProcessing}
                  placeholder="Karnataka"
                  className="w-full border-4 border-black p-3 font-bold bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
                {errors.state && (
                  <p className="text-red-600 font-bold text-xs mt-1">
                    ⚠️ {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-black uppercase text-sm mb-1 block">Pincode *</label>
                <input
                  {...register('pincode')}
                  disabled={isProcessing}
                  maxLength={6}
                  placeholder="560001"
                  className="w-full border-4 border-black p-3 font-bold bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
                {errors.pincode && (
                  <p className="text-red-600 font-bold text-xs mt-1">
                    ⚠️ {errors.pincode.message}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-yellow-100 border-2 border-black p-3 mt-2 flex items-center gap-2 text-xs font-bold text-gray-800">
              <span className="text-lg">🛡️</span>
              <span>
                Razorpay Test Mode: No real funds are deducted. Use test cards/UPI to simulate success or failure.
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="mt-4 w-full bg-lime-400 hover:bg-black hover:text-white border-4 border-black p-4 font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin inline-block">⚡</span>
                  Opening Razorpay Checkout...
                </>
              ) : (
                <>
                  <span>Pay with Razorpay</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 bg-pink-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-24 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b-4 border-black pb-4">
            <span className="w-8 h-8 bg-yellow-300 border-2 border-black flex items-center justify-center font-black text-lg">
              2
            </span>
            <h2 className="font-black text-2xl uppercase tracking-tight">Order Summary</h2>
          </div>

          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto bg-white border-4 border-black p-4">
            {cartItems.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div
                  key={itemId}
                  className="flex items-center gap-3 border-b-2 border-dashed border-black pb-3 last:border-0 last:pb-0"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-14 h-14 object-cover border-2 border-black shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <p className="font-black text-sm uppercase truncate">{item.title}</p>
                    <p className="text-xs font-bold text-gray-600">
                      Qty: {item.quantity} × {formatInr(item.priceInr)}
                    </p>
                  </div>
                  <div className="font-black text-sm text-right shrink-0">
                    {formatInr(item.lineTotalInr)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border-4 border-black p-4 flex flex-col gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between font-bold text-base">
              <span>Items Total:</span>
              <span>{formatInr(cartTotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Delivery Fee:</span>
              <span className="text-green-700 uppercase font-black">Free</span>
            </div>
            <div className="border-t-4 border-black my-1"></div>
            <div className="flex justify-between font-black text-2xl">
              <span>Grand Total:</span>
              <span className="text-pink-600">{formatInr(cartTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;