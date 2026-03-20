import React from 'react'
import { Link } from 'react-router-dom'
import useWishlist from '../hooks/useWishlist'
import useCart from '../hooks/useCart'

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <section className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-6 bg-lime-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
        <h1 className="bg-white border-4 border-black px-4 py-2 font-black text-3xl uppercase tracking-tight shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          Your Wishlist is Empty
        </h1>
        <Link to="/" className="bg-white hover:bg-black hover:text-white border-4 border-black px-6 py-3 font-black uppercase text-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
          Browse Products
        </Link>
      </section>
    )
  }

  return (
    <section className="w-full max-w-6xl mx-auto">
      <h1 className="inline-block bg-white border-4 border-black px-6 py-3 font-black text-4xl uppercase tracking-tight shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-8 transform -rotate-2">
        Wishlist ❤️
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map(item => (
            <div key={item.id} className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-full hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="bg-yellow-300 border-4 border-black mb-4 h-48 overflow-hidden relative">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    <button 
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 flex items-center justify-center font-bold border-2 border-black hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        X
                    </button>
                </div>
                
                <h3 className="font-black text-xl uppercase leading-tight mb-2 line-clamp-1">{item.title}</h3>
                <div className="font-black text-2xl mb-4">${item.price}</div>
                
                <div className="flex flex-col gap-2 mt-auto">
                    <button 
                        onClick={() => addToCart(item)}
                        className="bg-cyan-400 border-4 border-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
                        Move to Cart
                    </button>
                </div>
            </div>
        ))}
      </div>
    </section>
  )
}

export default Wishlist