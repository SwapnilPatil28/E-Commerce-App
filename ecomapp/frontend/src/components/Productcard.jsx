import React from "react";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import { formatInr } from "../utils/helpers";

function ProductCard({ data }) {
  const { addToCart, cartItems, isAdding } = useCart();
  const adding = isAdding(data);
  const { addToWishlist } = useWishlist();

  const inCart = cartItems.some((item) => {
    if (data._id && item._id) {
      return item._id === data._id;
    }
    return item.id === data.id;
  });

  return (
    <div className="w-full max-w-sm bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 flex flex-col gap-4 transition-all h-full">
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
        <div className="absolute -top-3 -right-3 bg-white border-4 border-black px-2 py-1 font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {data.rating} ⭐
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-grow">
        <h2 className="font-black text-2xl uppercase leading-tight line-clamp-2">
          {data.title}
        </h2>

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

        <p className="font-bold text-sm border-t-4 border-black mt-2 pt-3 line-clamp-3">
          {data.description}
        </p>
      </div>

      <div className="mt-4 pt-2 flex flex-col gap-3">
        <div className="font-black text-4xl tracking-tighter self-end">{formatInr(data.priceInr)}</div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => addToCart({ _id: data._id, id: data.id })}
            disabled={adding}
            aria-busy={adding}
            className="w-full disabled:opacity-60 disabled:cursor-wait bg-white hover:bg-black hover:text-white border-4 border-black px-4 py-3 font-black uppercase text-center transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            {adding ? 'Adding...' : inCart ? 'Add Another' : 'Add to Cart'}
          </button>
          <Link to={"/products/" + data.id} className="w-full inline-flex items-center justify-center bg-white hover:bg-black hover:text-white border-4 border-black px-4 py-3 font-black uppercase text-center transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
              View Details
          </Link>
        </div>
        <button
          onClick={() => addToWishlist({ ...data, _id: data._id })}
          className="w-full bg-lime-300 hover:bg-yellow-300 border-4 border-black px-4 py-3 font-black uppercase text-center transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
        >
          ❤️ Add to Wishlist
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
