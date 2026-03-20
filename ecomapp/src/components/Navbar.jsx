import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes } from 'react-icons/fa'
import useCart from '../hooks/useCart'
import useWishlist from '../hooks/useWishlist'

function Navbar() {
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="w-full bg-pink-400 border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:-translate-y-[2px] hover:-translate-x-[2px] transition-transform z-50" onClick={closeMenu}>
            <div className="w-10 h-10 bg-yellow-300 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-black text-xl leading-none">⚡</span>
            </div>
            <span className="font-black text-2xl sm:text-3xl uppercase tracking-tighter">
                NEO MART
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="bg-white hover:bg-black hover:text-white border-4 border-black px-6 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              Home
            </Link>
            <Link to="/products" className="bg-white hover:bg-black hover:text-white border-4 border-black px-6 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              Products
            </Link>
            
            <div className="flex items-center gap-4 border-l-4 border-black pl-6 ml-2">
                <Link to="/wishlist" className="relative group bg-white hover:bg-black hover:text-white border-4 border-black px-6 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    <span>Wishlist</span>
                    {wishlistItems.length > 0 && (
                        <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs border-2 border-black font-black px-1.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform">
                            {wishlistItems.length}
                        </span>
                    )}
                </Link>
                <Link to="/cart" className="relative group bg-yellow-300 hover:bg-black hover:text-white border-4 border-black px-6 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    <span>Cart</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-3 -right-3 bg-white text-black text-xs border-2 border-black font-black px-1.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform">
                            {cartCount}
                        </span>
                    )}
                </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden z-50">
            <button 
                onClick={toggleMenu}
                className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all cursor-pointer"
            >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-pink-400 border-t-4 border-black flex flex-col p-6 gap-4 overflow-hidden shadow-[0px_8px_0px_0px_rgba(0,0,0,1)]"
            >
                <Link to="/" onClick={closeMenu} className="w-full bg-white border-4 border-black p-4 font-black uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all text-center">
                  Home
                </Link>
                <Link to="/products" onClick={closeMenu} className="w-full bg-white border-4 border-black p-4 font-black uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all text-center">
                  Products
                </Link>
                <Link to="/wishlist" onClick={closeMenu} className="w-full bg-white border-4 border-black p-4 font-black uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all text-center flex justify-center items-center gap-2">
                  Wishlist
                  {wishlistItems.length > 0 && (
                    <span className="bg-red-500 text-white text-sm px-2 py-0.5 border-2 border-black">{wishlistItems.length}</span>
                  )}
                </Link>
                <Link to="/cart" onClick={closeMenu} className="w-full bg-cyan-400 border-4 border-black p-4 font-black uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all text-center flex justify-center items-center gap-2">
                  Cart
                  {cartCount > 0 && (
                     <span className="bg-yellow-300 text-black text-sm px-2 py-0.5 border-2 border-black">{cartCount}</span>
                  )}
                </Link>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar