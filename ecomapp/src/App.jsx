import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Products from "./pages/Products"
import Wishlist from "./pages/Wishlist"
import ProductDetails from "./pages/ProductDetails"

function App() {

  return (
    // Global Wrapper: Full height, flexbox for sticky footer, brutalist text selection
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white text-black selection:bg-pink-400 selection:text-black font-sans">
        <BrowserRouter>
          
          <Navbar/>
          
          {/* Main Content: Flex-grow ensures footer stays at the bottom */}
          <main className="flex-grow w-full max-w-7xl mx-auto p-6 md:p-12">
            <Routes>
              {/* Route Definitions for Page Navigation */}
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
        <ToastContainer />
      </div>
    </CartProvider>
  )
}

export default App