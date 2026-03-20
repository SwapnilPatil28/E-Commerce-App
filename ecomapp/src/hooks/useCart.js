import { useContext } from "react";
import CartContext from "../context/CartContext";

const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = context;
    return { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount };
};

export default useCart;