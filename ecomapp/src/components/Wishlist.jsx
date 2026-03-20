import React from 'react'

function Wishlist() {
  return (
    <section className="w-full max-w-4xl bg-lime-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h1 className="inline-block bg-white border-4 border-black px-4 py-2 font-black text-3xl uppercase tracking-tight shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
        Wishlist
      </h1>
      <p className="mt-6 bg-white border-4 border-black p-4 font-bold text-base leading-relaxed shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
        Save products here and manage your favorites with a bold visual style.
      </p>
    </section>
  )
}

export default Wishlist