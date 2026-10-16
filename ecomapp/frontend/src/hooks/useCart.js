import { useContext } from "react";
import CartContext from "../context/CartContext";

const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    const { cartItems, cartLoading, cartError, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartSummary, cartCount, refreshCart, isAdding } = context;
    return { cartItems, cartLoading, cartError, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartSummary, cartCount, refreshCart, isAdding };
};

export default useCart;