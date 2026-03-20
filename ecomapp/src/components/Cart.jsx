import React from 'react'

function Cart() {
  return (
    <section className="w-full max-w-4xl bg-pink-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h1 className="inline-block bg-white border-4 border-black px-4 py-2 font-black text-3xl uppercase tracking-tight shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
        Cart
      </h1>
      <p className="mt-6 bg-white border-4 border-black p-4 font-bold text-base leading-relaxed shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
        Your cart page is styled and ready to display selected products.
      </p>
    </section>
  )
}

export default Cart