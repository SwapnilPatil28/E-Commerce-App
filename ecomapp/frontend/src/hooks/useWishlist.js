import { useContext } from "react";
import CartContext from "../context/CartContext";

const useWishlist = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useWishlist must be used within a CartProvider");
    }
    const { wishlistItems, wishlistLoading, wishlistError, addToWishlist, removeFromWishlist } = context;
    return { wishlistItems, wishlistLoading, wishlistError, addToWishlist, removeFromWishlist };
};

export default useWishlist;