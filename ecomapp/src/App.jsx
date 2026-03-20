import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./components/Home"
import Cart from "./components/Cart"
import Checkout from "./components/Checkout"
import Products from "./components/Products"
import Wishlist from "./components/Wishlist"
import ProductDetails from "./components/ProductDetails"

function App() {

  return (
    // Global Wrapper: Full height, flexbox for sticky footer, brutalist text selection
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-pink-400 selection:text-black font-sans">
      <BrowserRouter>
        
        <Navbar/>
        
        {/* Main Content Area: flex-grow pushes footer down, max-w centers the content */}
        <main className="flex-grow w-full max-w-7xl mx-auto p-6 md:p-12">
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/cart" element={<Cart/>}></Route>
            <Route path="/checkout" element={<Checkout/>}></Route>
            <Route path="/products" element={<Products/>}></Route>
            <Route path="/wishlist" element={<Wishlist/>}></Route>
            <Route path="/product/:id" element={<ProductDetails/>}></Route>
          </Routes>
        </main>

        <Footer/>

      </BrowserRouter>
    </div>
  )
}

export default App