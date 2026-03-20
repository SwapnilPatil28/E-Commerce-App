import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

// Provides Cart and Wishlist state to all children components
export const CartProvider = ({ children }) => {
  
  // --- Initialize State (from Local Storage) ---
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("wishlistItems");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Persistence Effects ---
  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Save wishlist to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // --- Cart Actions ---
  
  // Add item or increment quantity if exists
  const addToCart = (product) => {
    // Check if item already exists
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      // If exists, just increment quantity
      const updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedCart);
      toast.info("Increased quantity in Cart");
    } else {
      // If new, add with quantity 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
      toast.success("Added to Cart!");
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.error("Removed from Cart");
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart Cleared");
  };

  // --- Wishlist Actions ---
  const addToWishlist = (product) => {
    const existingItem = wishlistItems.find((item) => item.id === product.id);
    if (existingItem) {
      toast.warning("Already in Wishlist");
      return;
    }
    setWishlistItems([...wishlistItems, product]);
    toast.success("Added to Wishlist ❤️");
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    toast.error("Removed from Wishlist");
  };

  // --- Derived State ---
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
