import { Link } from 'react-router-dom'

const featureCards = [
  {
    number: '01',
    title: 'Find your next favorite',
    text: 'Browse a lively collection of everyday essentials, statement pieces, and useful upgrades.',
    color: 'bg-yellow-300',
  },
  {
    number: '02',
    title: 'Make it yours',
    text: 'Keep a personal wishlist and build a cart that is ready whenever you are.',
    color: 'bg-cyan-300',
  },
  {
    number: '03',
    title: 'Shop with confidence',
    text: 'Create an account to keep your details and shopping session close at hand.',
    color: 'bg-pink-400',
  },
]

const categoryCards = [
  { label: 'Tech & gear', detail: 'Smart picks', color: 'bg-cyan-300' },
  { label: 'Style edit', detail: 'Fresh looks', color: 'bg-pink-400' },
  { label: 'Daily goods', detail: 'Useful things', color: 'bg-yellow-300' },
]

const shoppingSteps = [
  ['01', 'Discover', 'Explore the collection and find something that feels like you.'],
  ['02', 'Save or add', 'Keep favorites close or send a sure thing straight to your cart.'],
  ['03', 'Make it yours', 'Sign in to manage your account and keep your shopping moving.'],
]

function Landing() {
  return (
    <div className="flex flex-col gap-12 py-4 md:gap-20 md:py-10">
      <section className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
        <div className="flex flex-col justify-between border-4 border-black bg-yellow-300 p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:p-10">
          <div>
            <p className="mb-5 inline-block border-4 border-black bg-white px-3 py-2 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Welcome to Neo Mart
            </p>
            <h1 className="max-w-3xl text-6xl font-black uppercase leading-[0.86] md:text-8xl">
              Shop loud.
              <span className="mt-2 block bg-pink-400 px-2">Live bright.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg font-bold leading-snug md:text-xl">
              A bold, easy-to-use shopping space for discovering products that fit your life and your style.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/products"
              className="border-4 border-black bg-black px-6 py-4 text-center font-black uppercase text-white shadow-[5px_5px_0px_0px_rgba(236,72,153,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
            >
              Explore products
            </Link>
            <Link
              to="/register"
              className="border-4 border-black bg-white px-6 py-4 text-center font-black uppercase shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
            >
              Join Neo Mart
            </Link>
          </div>
        </div>

        <div className="flex min-h-[360px] flex-col justify-between border-4 border-black bg-cyan-300 p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <p className="border-4 border-black bg-white px-3 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              The Neo Mart signal
            </p>
            <span className="flex items-center gap-2 border-4 border-black bg-pink-400 px-3 py-2 font-black uppercase">
              <span className="h-3 w-3 rounded-full border-2 border-black bg-green-400" /> Live
            </span>
          </div>
          <div>
            <p className="text-8xl font-black leading-none md:text-9xl">01</p>
            <h2 className="mt-4 max-w-sm text-4xl font-black uppercase leading-[0.9] md:text-5xl">
              Place for good finds.
            </h2>
            <div className="mt-8 grid grid-cols-3 gap-2">
              {['Curated', 'Useful', 'Yours'].map((word) => (
                <span key={word} className="border-2 border-black bg-white px-2 py-3 text-center text-xs font-black uppercase sm:text-sm">
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4 border-b-4 border-black pb-4">
          <div>
            <p className="font-black uppercase tracking-widest">Why Neo Mart?</p>
            <h2 className="mt-2 text-4xl font-black uppercase leading-none md:text-6xl">More than a cart.</h2>
          </div>
          <span className="hidden border-4 border-black bg-white px-3 py-2 font-black md:inline-block">EST. 2026</span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featureCards.map((card) => (
            <article key={card.number} className={`border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${card.color}`}>
              <p className="text-4xl font-black">{card.number}</p>
              <h3 className="mt-10 text-2xl font-black uppercase leading-none">{card.title}</h3>
              <p className="mt-4 font-bold leading-snug">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y-4 border-black py-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-black uppercase tracking-widest">Start somewhere</p>
            <h2 className="mt-2 text-4xl font-black uppercase leading-none md:text-6xl">Pick your lane.</h2>
          </div>
          <Link to="/products" className="font-black uppercase underline decoration-4 underline-offset-4">View all products</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {categoryCards.map((category) => (
            <Link key={category.label} to="/products" className={`group border-4 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${category.color}`}>
              <span className="block text-sm font-black uppercase tracking-widest">{category.detail}</span>
              <span className="mt-12 block text-2xl font-black uppercase leading-none group-hover:underline">{category.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 border-b-4 border-black pb-4">
          <p className="font-black uppercase tracking-widest">The easy part</p>
          <h2 className="mt-2 text-4xl font-black uppercase leading-none md:text-6xl">From browse to yours.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {shoppingSteps.map(([number, title, text]) => (
            <article key={number} className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-5xl font-black text-pink-500">{number}</p>
              <h3 className="mt-8 text-2xl font-black uppercase">{title}</h3>
              <p className="mt-3 font-bold leading-snug">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-start justify-between gap-6 border-4 border-black bg-black p-6 text-white shadow-[8px_8px_0px_0px_rgba(236,72,153,1)] md:flex-row md:items-center md:p-8">
        <div>
          <p className="font-black uppercase tracking-widest text-yellow-300">Ready when you are</p>
          <h2 className="mt-2 text-3xl font-black uppercase leading-none md:text-5xl">Your next find starts here.</h2>
        </div>
        <Link to="/products" className="shrink-0 border-4 border-black bg-cyan-300 px-6 py-4 font-black uppercase text-black shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
          Start shopping
        </Link>
      </section>
    </div>
  )
}

export default Landing
