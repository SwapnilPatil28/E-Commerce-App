import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import useCart from '../hooks/useCart'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

// 1. Define Validation Schema using Yup
// This ensures all fields meet specific criteria before submission
const schema = yup.object({
  fullName: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  zip: yup.string().required('Zip Code is required'),
  cardNumber: yup.string().matches(/^[0-9]{16}$/, 'Card number must be 16 digits').required('Card number is required'),
}).required();

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  // 2. Initialize React Hook Form
  // We pass the Yup resolver to handle validation automatically
  const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(schema)
  });

  const tax = cartTotal * 0.1;
  const total = cartTotal + tax;

  // 3. Form Submission Handler
  const onSubmit = () => {
      toast.success("Order Placed Successfully! 🎉", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      clearCart();
      navigate('/');
  };

  if (cartItems.length === 0) {
      return (
        <div className="w-full h-96 flex items-center justify-center">
            <div className="bg-yellow-300 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                <h2 className="font-black text-3xl uppercase mb-4">Your cart is empty!</h2>
                <button onClick={() => navigate('/')} className="bg-white border-4 border-black px-6 py-2 font-black uppercase hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    Go Shopping
                </button>
            </div>
        </div>
      );
  }

  return (
    <section className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Checkout Form */}
      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="bg-yellow-300 border-4 border-black px-4 py-2 font-black text-3xl uppercase tracking-tight shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-8 inline-block">
          Checkout
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
                <label className="font-black uppercase mb-1 block">Full Name</label>
                <input {...register("fullName")} className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="JOHN DOE" />
                <p className="text-red-600 font-bold text-sm mt-1">{errors.fullName?.message}</p>
            </div>

            <div>
                <label className="font-black uppercase mb-1 block">Email</label>
                <input {...register("email")} className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="JOHN@EXAMPLE.COM" />
                <p className="text-red-600 font-bold text-sm mt-1">{errors.email?.message}</p>
            </div>

            <div>
                <label className="font-black uppercase mb-1 block">Address</label>
                <input {...register("address")} className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="123 STREET" />
                <p className="text-red-600 font-bold text-sm mt-1">{errors.address?.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="font-black uppercase mb-1 block">City</label>
                    <input {...register("city")} className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="NEW YORK" />
                    <p className="text-red-600 font-bold text-sm mt-1">{errors.city?.message}</p>
                </div>
                <div>
                    <label className="font-black uppercase mb-1 block">Zip Code</label>
                    <input {...register("zip")} className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="10001" />
                    <p className="text-red-600 font-bold text-sm mt-1">{errors.zip?.message}</p>
                </div>
            </div>

            <div>
                <label className="font-black uppercase mb-1 block">Card Number (16 digits)</label>
                <input {...register("cardNumber")} className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="0000000000000000" />
                <p className="text-red-600 font-bold text-sm mt-1">{errors.cardNumber?.message}</p>
            </div>

            <button type="submit" className="mt-4 bg-lime-400 hover:bg-black hover:text-white border-4 border-black px-6 py-4 font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
                Place Order
            </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="h-fit bg-pink-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-24">
        <h2 className="bg-white border-4 border-black px-4 py-2 font-black text-2xl uppercase tracking-tight shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-6 inline-block">
            Order Summary
        </h2>
        
        <div className="flex flex-col gap-4 mb-6 max-h-96 overflow-y-auto border-4 border-black bg-white p-4">
            {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b-2 border-dashed border-black pb-2 last:border-0">
                    <div>
                        <div className="font-bold text-sm uppercase line-clamp-1 w-40">{item.title}</div>
                        <div className="text-xs">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-black">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            ))}
        </div>

        <div className="bg-white border-4 border-black p-4 flex flex-col gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t-4 border-black my-2"></div>
            <div className="flex justify-between text-3xl font-black text-pink-500">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>
      </div>

    </section>
  )
}

export default Checkout