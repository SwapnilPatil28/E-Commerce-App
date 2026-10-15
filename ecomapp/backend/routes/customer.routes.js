import express from 'express';
import {
	register,
	login,
	getProfile,
	logout,
	changePassword,
	getWishlist,
	putWishlist,
	deleteWishlist,
	getCart,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
} from '../controllers/customer.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getProfile);
router.post('/logout', protect, logout);
router.patch('/change-password', protect, changePassword);

router.get('/getwishlist', protect, getWishlist);
router.post('/putwishlist', protect, putWishlist);
router.delete('/wishlist/:id', protect, deleteWishlist);

router.get('/cart', protect, getCart);
router.get('/getcart', protect, getCart);
router.post('/cart/:productId', protect, addToCart);
router.post('/putCart', protect, addToCart);
router.patch('/cart/:productId', protect, updateCartItem);
router.delete('/cart/:productId', protect, removeCartItem);
router.delete('/cart', protect, clearCart);
router.delete('/deletecart', protect, clearCart);

export default router;
