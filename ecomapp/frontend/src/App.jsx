import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Landing from "./pages/Landing"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Orders from "./pages/Orders"
import OrderSuccess from "./pages/OrderSuccess"
import Products from "./pages/Products"
import Wishlist from "./pages/Wishlist"
import ProductDetails from "./pages/ProductDetails"
import Auth from "./pages/Auth"
import Account from "./pages/Account"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"
import PublicRoute from "./components/PublicRoute"

function App() {

  return (
    // Global Wrapper: Full height, flexbox for sticky footer, brutalist text selection
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-white text-black selection:bg-pink-400 selection:text-black font-sans">
          <BrowserRouter>
          
          <Navbar/>
          
          {/* Main Content: Flex-grow ensures footer stays at the bottom */}
          <main className="grow w-full max-w-7xl mx-auto p-6 md:p-12">
            <Routes>
              {/* Route Definitions for Page Navigation */}
              <Route path="/products" element={<Products/>}></Route>
              <Route path="/products/:id" element={<ProductDetails/>}></Route>
              <Route path="/product/:id" element={<ProductDetails/>}></Route>
              
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Auth />}></Route>
                <Route path="/register" element={<Auth mode="register" />}></Route>
                <Route path="/" element={<Landing/>}></Route>
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/me" element={<Account />}></Route>
                <Route path="/account" element={<Account />}></Route>
                <Route path="/home" element={<Home/>}></Route>
                <Route path="/cart" element={<Cart/>}></Route>
                <Route path="/checkout" element={<Checkout/>}></Route>
                <Route path="/orders" element={<Orders/>}></Route>
                <Route path="/orders/:id" element={<OrderSuccess/>}></Route>
                <Route path="/order-success/:id" element={<OrderSuccess/>}></Route>
                <Route path="/wishlist" element={<Wishlist/>}></Route>
              </Route>
            </Routes>
          </main>

          <Footer/>

          </BrowserRouter>
          <ToastContainer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App