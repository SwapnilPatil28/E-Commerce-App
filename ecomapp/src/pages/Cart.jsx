import React from 'react'
import { Link } from 'react-router-dom'
import useCart from '../hooks/useCart'

function Cart() {
  // 1. Access cart methods and state from our custom hook
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  // 2. Conditional rendering for empty state
  if (cartItems.length === 0) {
    return (
      <section className="w-full max-w-4xl bg-pink-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-auto flex flex-col items-center justify-center gap-6">
        <h1 className="bg-white border-4 border-black px-4 py-2 font-black text-3xl uppercase tracking-tight shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center">
          Your Cart is Empty
        </h1>
        <Link to="/" className="bg-white hover:bg-black hover:text-white border-4 border-black px-6 py-3 font-black uppercase text-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none text-center">
          Start Shopping
        </Link>
      </section>
    )
  }

  return (
    <section className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* 3. Items List Section */}
      <div className="bg-pink-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-center mb-6">
            <h1 className="bg-white border-4 border-black px-4 py-2 font-black text-3xl uppercase tracking-tight shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                Shopping Cart
            </h1>
            <button onClick={clearCart} className="bg-red-500 text-white border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                Clear Cart
            </button>
        </div>

        <div className="flex flex-col gap-4">
            {cartItems.map(item => (
                <div key={item.id} className="bg-white border-4 border-black p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-4">
                    <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-cover border-2 border-black" />
                    
                    <div className="flex-grow text-center md:text-left">
                        <h3 className="font-black text-xl uppercase leading-tight">{item.title}</h3>
                        <div className="font-bold text-lg text-gray-700">${item.price}</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center bg-yellow-300 border-2 border-black font-black hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed">
                            -
                        </button>
                        <span className="w-8 text-center font-black text-xl">{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-yellow-300 border-2 border-black font-black hover:bg-yellow-400">
                            +
                        </button>
                    </div>

                    <div className="font-black text-xl w-24 text-center">
                        ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button 
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-500 text-white border-2 border-black p-2 font-bold uppercase hover:bg-red-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                        Remove
                    </button>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-cyan-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center md:items-end gap-4">
          <div className="flex justify-between w-full md:w-1/2 text-xl font-bold border-b-4 border-black pb-2">
              <span>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full md:w-1/2 text-3xl font-black">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="inline-block w-full md:w-auto bg-white hover:bg-black hover:text-white border-4 border-black px-8 py-4 font-black uppercase text-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none mt-4 text-center">
              Proceed to Checkout
          </Link>
      </div>

    </section>
  )
}

export default Cart