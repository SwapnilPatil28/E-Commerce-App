import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-6 px-6 py-4 bg-pink-400 border-b-4 border-black">
        
        {/* Logo and Branding */}
        <Link to="/" className="flex items-center gap-3 hover:-translate-y-[2px] hover:-translate-x-[2px] transition-transform">
            {/* Brutalist Logo Graphic */}
            <div className="w-10 h-10 bg-yellow-300 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-black text-xl leading-none">⚡</span>
            </div>
            {/* Company Name */}
            <span className="font-black text-3xl uppercase tracking-tighter">
                NEO MART
            </span>
        </Link>
        
        {/* Web pages */}
        <div className="flex flex-wrap gap-4">
            <Link to="/" className="px-4 py-2 bg-white border-2 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              Home
            </Link>
            <Link to="/products" className="px-4 py-2 bg-white border-2 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              Products
            </Link>
            <Link to="/wishlist" className="px-4 py-2 bg-white border-2 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              Wishlist
            </Link>
            <Link to="/cart" className="px-4 py-2 bg-cyan-400 border-2 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              Cart
            </Link>
            <Link to="/checkout" className="px-4 py-2 bg-yellow-300 border-2 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              Checkout
            </Link>
        </div>
    </div>
  )
}

export default Navbar