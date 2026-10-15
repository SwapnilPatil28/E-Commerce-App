import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import customerRoutes from './routes/customer.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: process.env.FRONTEND_URL || 'http://localhost:5173',
	credentials: true,
}));
app.use('/customers', customerRoutes);
app.use('/cart', customerRoutes);
app.use('/orders', orderRoutes);
app.use('/customers/orders', orderRoutes);
app.use('/productapi', productRoutes);

app.get('/', (req, res) => {
	res.json({ success: true, message: 'NeoMart API is running' });
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ success: false, message: 'Internal server error' });
});

async function startServer() {
	if (!process.env.MONGODB_URL) {
		throw new Error('MONGODB_URL is not configured');
	}

	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is not configured');
	}

	await mongoose.connect(process.env.MONGODB_URL);
	app.listen(port, () => {
		console.log(`NeoMart server is running on port ${port}`);
	});
}

startServer().catch((error) => {
	console.error('Unable to start server:', error.message);
	process.exit(1);
});
