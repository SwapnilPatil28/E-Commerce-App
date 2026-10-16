import { createContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import customerApi from "../services/customerApi";
import { useAuth } from "./AuthContext";
import { getProductKey } from "../utils/helpers";

const CartContext = createContext();

const normalizeCartItem = (item) => {
  const product = item?.product || item;
  if (!product) {
    return null;
  }

  const normalizedProductId = product._id || product.id;
  if (!normalizedProductId) {
    return null;
  }

  return {
    _id: product._id || normalizedProductId,
    id: product.id || normalizedProductId,
    title: product.title || product.name || "Product",
    // INR values below are computed by the server; the client never converts currency
    priceInr: Number(product.priceInr || 0),
    lineTotalInr: Number(item?.lineTotalInr || 0),
    thumbnail: product.thumbnail || product.images?.[0] || "",
    stock: Number(product.stock || 0),
    quantity: Number(item?.quantity || 1),
  };
};

const EMPTY_SUMMARY = { itemCount: 0, subtotalInr: 0, totalInr: 0, totalPaise: 0, currency: "INR" };

const normalizeSummary = (summary) => ({
  itemCount: Number(summary?.itemCount || 0),
  subtotalInr: Number(summary?.subtotalInr || 0),
  totalInr: Number(summary?.totalInr || 0),
  totalPaise: Number(summary?.totalPaise || 0),
  currency: summary?.currency || "INR",
});

export const CartProvider = ({ children }) => {
  const { customer, isLoading: isAuthLoading } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");
  // Server-calculated totals (INR). The charge is re-calculated again at payment time.
  const [cartSummary, setCartSummary] = useState(EMPTY_SUMMARY);

  // Products currently being added: drives the "Adding..." button state
  const [addingKeys, setAddingKeys] = useState([]);
  const addingRef = useRef(new Set());

  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState("");

  const applyCartResponse = (data) => {
    setCartItems((data.cart || []).map(normalizeCartItem).filter(Boolean));
    setCartSummary(normalizeSummary(data.summary));
  };

  const refreshCart = async () => {
    if (!customer) {
      setCartItems([]);
      setCartSummary(EMPTY_SUMMARY);
      setCartError("");
      setCartLoading(false);
      return;
    }

    setCartLoading(true);
    setCartError("");

    try {
      const { data } = await customerApi.get('/cart');
      applyCartResponse(data);
    } catch (error) {
      setCartItems([]);
      setCartSummary(EMPTY_SUMMARY);
      setCartError(error.response?.data?.message || 'Unable to load your cart.');
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, isAuthLoading]);

  useEffect(() => {
    let isCurrent = true;

    if (isAuthLoading) {
      return () => {
        isCurrent = false;
      };
    }

    if (!customer) {
      setWishlistItems([]);
      setWishlistError("");
      setWishlistLoading(false);
      return () => {
        isCurrent = false;
      };
    }

    const fetchWishlist = async () => {
      setWishlistLoading(true);
      setWishlistError("");
      try {
        const { data } = await customerApi.get('/getwishlist');
        if (isCurrent) {
          setWishlistItems(data.wishlist || []);
        }
      } catch {
        if (isCurrent) {
          setWishlistItems([]);
          setWishlistError('Unable to load your wishlist.');
        }
      } finally {
        if (isCurrent) {
          setWishlistLoading(false);
        }
      }
    };

    fetchWishlist();
    return () => {
      isCurrent = false;
    };
  }, [customer, isAuthLoading]);

  const addToCart = async (product) => {
    if (!customer) {
      toast.warning('Sign in to add items to your cart');
      return;
    }

    const productId = product?._id || product?.id;
    if (!productId) {
      toast.error('This product cannot be added to the cart');
      return;
    }

    // Ignore repeat clicks while this product is already being added
    const key = getProductKey(product);
    if (addingRef.current.has(key)) {
      return;
    }
    addingRef.current.add(key);
    setAddingKeys((keys) => [...keys, key]);

    try {
      const { data } = await customerApi.post(`/cart/${encodeURIComponent(productId)}`);
      applyCartResponse(data);
      toast.success(data.message || 'Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add product to cart');
    } finally {
      addingRef.current.delete(key);
      setAddingKeys((keys) => keys.filter((k) => k !== key));
    }
  };

  const removeFromCart = async (productId) => {
    if (!customer || !productId) {
      return;
    }

    try {
      const { data } = await customerApi.delete(`/cart/${encodeURIComponent(productId)}`);
      applyCartResponse(data);
      toast.info(data.message || 'Removed from cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to remove item from cart');
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!customer || !productId) {
      return;
    }

    if (newQuantity < 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      const { data } = await customerApi.patch(`/cart/${encodeURIComponent(productId)}`, { quantity: newQuantity });
      applyCartResponse(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update cart quantity');
    }
  };

  const clearCart = async () => {
    if (!customer) {
      setCartItems([]);
      setCartSummary(EMPTY_SUMMARY);
      return;
    }

    try {
      const { data } = await customerApi.delete('/cart');
      applyCartResponse(data);
      toast.info(data.message || 'Cart cleared');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to clear cart');
    }
  };

  const addToWishlist = async (product) => {
    if (!customer) {
      toast.warning('Sign in to save items to your wishlist');
      return;
    }

    const productId = product._id;
    if (!productId) {
      toast.error('This product cannot be added to your wishlist');
      return;
    }

    if (wishlistItems.some((item) => item._id === productId)) {
      toast.warning('Already in Wishlist');
      return;
    }

    try {
      await customerApi.post('/putwishlist', { id: productId });
      setWishlistItems((items) => [...items, product]);
      toast.success('Added to Wishlist ❤️');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update your wishlist');
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await customerApi.delete(`/wishlist/${id}`);
      setWishlistItems((items) => items.filter((item) => item._id !== id));
      toast.info('Removed from Wishlist');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to remove item from wishlist');
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  // Total comes from the server, not from multiplying prices in the browser
  const cartTotal = cartSummary.totalInr;
  const isAdding = (product) => addingKeys.includes(getProductKey(product));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartError,
        wishlistItems,
        wishlistLoading,
        wishlistError,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        refreshCart,
        cartCount,
        cartTotal,
        cartSummary,
        isAdding,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
