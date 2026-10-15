import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import generateToken from '../utils/generateToken.js';

const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
	maxAge: 10 * 24 * 60 * 60 * 1000, // matches the 10d JWT expiry
};

function customerResponse(customer) {
	return {
		_id: customer._id,
		fullName: customer.fullName,
		email: customer.email,
		phone: customer.phone,
	};
}

async function findProductByReference(productReference) {
	if (!productReference) {
		return null;
	}

	if (mongoose.isValidObjectId(productReference)) {
		const product = await Product.findById(productReference);
		if (product) {
			return product;
		}
	}

	const numericProductId = Number(productReference);
	if (Number.isFinite(numericProductId) && numericProductId > 0) {
		return Product.findOne({ id: numericProductId });
	}

	return null;
}

export async function register(req, res) {
	try {
		const { fullName, email, password, phone } = req.body;

		if (!fullName || !email || !password || !phone) {
			return res.status(400).json({ success: false, message: 'All fields are required' });
		}

		if (password.length < 6) {
			return res.status(400).json({ success: false, message: 'Password must contain at least 6 characters' });
		}

		const normalizedEmail = email.trim().toLowerCase();
		const existingCustomer = await Customer.findOne({ email: normalizedEmail });

		if (existingCustomer) {
			return res.status(409).json({ success: false, message: 'Email already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const customer = await Customer.create({
			fullName,
			email: normalizedEmail,
			password: hashedPassword,
			phone,
		});

		return res.status(201).json({
			success: true,
			message: 'Customer registered successfully',
			customer: customerResponse(customer),
		});
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Unable to register customer' });
	}
}

export async function login(req, res) {
	try {
		const { email, password } = req.body;
		const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
		const customer = await Customer.findOne({ email: normalizedEmail }).select('+password');

		if (!customer || typeof password !== 'string' || !(await bcrypt.compare(password, customer.password))) {
			return res.status(401).json({ success: false, message: 'Invalid credentials' });
		}

		const token = generateToken(customer._id.toString());
		res.cookie('shopkart_token', token, cookieOptions);
		// token is also returned so the frontend can fall back to a Bearer header when the
		// browser blocks third-party cookies (Safari, Brave, incognito) on a cross-domain deploy
		return res.json({ success: true, message: 'Login successful', token, customer: customerResponse(customer) });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Unable to log in' });
	}
}

export function getProfile(req, res) {
	return res.json(customerResponse(req.user));
}

export function logout(req, res) {
	res.clearCookie('shopkart_token', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
	});
	return res.json({ success: true, message: 'Logged out successfully' });
}

export async function changePassword(req, res) {
	try {
		const { oldPassword, newPassword } = req.body;

		if (!oldPassword || !newPassword || newPassword.length < 6) {
			return res.status(400).json({ success: false, message: 'A valid old and new password are required' });
		}

		const customer = await Customer.findById(req.user._id).select('+password');
		const oldPasswordMatches = await bcrypt.compare(oldPassword, customer.password);

		if (!oldPasswordMatches) {
			return res.status(401).json({ success: false, message: 'Invalid old password' });
		}

		customer.password = await bcrypt.hash(newPassword, 12);
		await customer.save();
		return res.json({ success: true, message: 'Password changed successfully' });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Unable to change password' });
	}
}

export const getWishlist = async(req, res) => {
    try {
		const customer = await req.user.populate('wishlist');
        return res.status(200).json({
			success: true,
			message: 'Wishlist fetched successfully',
			wishlist: customer.wishlist,
		});
    } catch {
		return res.status(500).json({ success: false, message: 'Unable to get wishlist' });
    }
}

export const putWishlist = async(req, res) => {
	try{
		const customer = req.user;
		const { id } = req.body;
		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({ success: false, message: 'Invalid product id' });
		}

		const productExists = await Product.exists({ _id: id });
		if (!productExists) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		const alreadyAdded = customer.wishlist.some((productId) => productId.toString() === id);
		if (alreadyAdded) {
			return res.status(409).json({ success: false, message: 'Product is already added' });
		}

		customer.wishlist.addToSet(id);
		await customer.save();

		return res.status(201).json({ success: true, message: 'Product added successfully' });

	} catch {
		return res.status(500).json({ success: false, message: 'Unable to add product' });
	}
}

export const deleteWishlist = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({ success: false, message: 'Invalid product id' });
		}

		await Customer.findByIdAndUpdate(req.user._id, {
			$pull: { wishlist: id },
		});

		return res.status(200).json({ success: true, message: 'Product removed from wishlist' });
	} catch {
		return res.status(500).json({ success: false, message: 'Unable to remove product' });
	}
}

export const getCart = async (req, res) => {
	try {
		const customer = await Customer.findById(req.user._id).populate('cart.product');
		return res.status(200).json({
			success: true,
			message: 'Cart fetched successfully',
			cart: customer.cart,
		});
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Unable to get cart' });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.params;
		const product = await findProductByReference(productId);

		if (!product) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		const customer = await Customer.findById(req.user._id);
		const existingItem = customer.cart.find((item) => item.product.toString() === product._id.toString());

		if (existingItem) {
			const nextQuantity = existingItem.quantity + 1;
			if (nextQuantity > product.stock) {
				return res.status(400).json({ success: false, message: 'Quantity exceeds available stock' });
			}
			existingItem.quantity = nextQuantity;
		} else {
			if (product.stock < 1) {
				return res.status(400).json({ success: false, message: 'Product is out of stock' });
			}
			customer.cart.push({ product: product._id, quantity: 1 });
		}

		await customer.save();
		const updatedCustomer = await Customer.findById(req.user._id).populate('cart.product');
		return res.status(existingItem ? 200 : 201).json({
			success: true,
			message: 'Cart updated',
			cart: updatedCustomer.cart,
		});
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Unable to add product to cart' });
	}
};

export const updateCartItem = async (req, res) => {
	try {
		const { productId } = req.params;
		const { quantity } = req.body;
		const product = await findProductByReference(productId);

		if (!product) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		if (!Number.isInteger(quantity) || quantity < 1) {
			return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
		}

		if (quantity > product.stock) {
			return res.status(400).json({ success: false, message: 'Quantity exceeds available stock' });
		}

		const customer = await Customer.findById(req.user._id);
		const item = customer.cart.find((entry) => entry.product.toString() === product._id.toString());

		if (!item) {
			return res.status(404).json({ success: false, message: 'Product not found in cart' });
		}

		item.quantity = quantity;
		await customer.save();
		const updatedCustomer = await Customer.findById(req.user._id).populate('cart.product');
		return res.status(200).json({
			success: true,
			message: 'Cart updated',
			cart: updatedCustomer.cart,
		});
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Unable to update cart' });
	}
};

export const removeCartItem = async (req, res) => {
	try {
		const { productId } = req.params;
		const product = await findProductByReference(productId);

		if (!product) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		const customer = await Customer.findById(req.user._id);
		const previousLength = customer.cart.length;
		customer.cart = customer.cart.filter((item) => item.product.toString() !== product._id.toString());

		if (customer.cart.length === previousLength) {
			return res.status(404).json({ success: false, message: 'Product not found in cart' });
		}

		await customer.save();
		const updatedCustomer = await Customer.findById(req.user._id).populate('cart.product');
		return res.status(200).json({
			success: true,
			message: 'Product removed from cart',
			cart: updatedCustomer.cart,
		});
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Unable to remove product from cart' });
	}
};

export const clearCart = async (req, res) => {
	try {
		const customer = await Customer.findById(req.user._id);
		customer.cart = [];
		await customer.save();
		return res.status(200).json({ success: true, message: 'Cart cleared', cart: [] });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Unable to clear cart' });
	}
};

export const putCart = addToCart;
export const deleteCart = removeCartItem;
