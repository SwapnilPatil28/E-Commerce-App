import React from "react";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import { formatPrice } from "../utils/helpers";

function ProductCard({ data }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  return (
    <div className="w-full max-w-sm bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 flex flex-col gap-4 transition-all h-full">
      {/* Image Container with Floating Rating */}
      <div className="w-full h-52 bg-yellow-300 border-4 border-black relative shrink-0">
        {data.thumbnail ? (
          <img
            src={data.thumbnail}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-black text-xl uppercase">
            No Image
          </div>
        )}
        {/* Harsh, boxed-out rating badge */}
        <div className="absolute -top-3 -right-3 bg-white border-4 border-black px-2 py-1 font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {data.rating} ⭐
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-2 flex-grow">
        <h2 className="font-black text-2xl uppercase leading-tight line-clamp-2">
          {data.title}
        </h2>

        {/* High-Contrast Tags */}
        <div className="flex gap-2 flex-wrap mt-1">
          {data.brand && (
            <span className="bg-pink-400 border-2 border-black px-2 py-1 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {data.brand}
            </span>
          )}
          <span className="bg-cyan-400 border-2 border-black px-2 py-1 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {data.category}
          </span>
        </div>

        {/* Thick divider and description */}
        <p className="font-bold text-sm border-t-4 border-black mt-2 pt-3 line-clamp-3">
          {data.description}
        </p>
      </div>

      {/* Footer: Price & Actions */}
      <div className="mt-4 pt-2 flex flex-col gap-3">
        <div className="font-black text-4xl tracking-tighter self-end">{formatPrice(data.price)}</div>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => addToCart({ id: data.id, title: data.title, price: data.price, thumbnail: data.thumbnail })}
            className="w-full bg-white hover:bg-black hover:text-white border-4 border-black px-4 py-3 font-black uppercase text-center transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
            Add to Cart
          </button>
          <Link to={"/product/" + data.id} className="w-full inline-flex items-center justify-center bg-white hover:bg-black hover:text-white border-4 border-black px-4 py-3 font-black uppercase text-center transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
              View Details
          </Link>
        </div>
        <button 
          onClick={() => addToWishlist({ id: data.id, title: data.title, price: data.price, thumbnail: data.thumbnail })}
          className="w-full bg-lime-300 hover:bg-yellow-300 border-4 border-black px-4 py-3 font-black uppercase text-center transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
          ❤️ Add to Wishlist
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
