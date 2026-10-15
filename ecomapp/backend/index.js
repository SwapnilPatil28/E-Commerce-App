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

// Render (and most hosts) sit behind a reverse proxy; needed for secure cookies / correct IPs
app.set('trust proxy', 1);

// FRONTEND_URL can hold one or many origins, comma separated (no trailing slash needed)
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
	.split(',')
	.map((origin) => origin.trim().replace(/\/$/, ''))
	.filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin(origin, callback) {
		// allow non-browser clients (curl, health checks) that send no Origin header
		if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
		return callback(new Error(`CORS blocked for origin: ${origin}`));
	},
	credentials: true,
}));
app.use('/customers', customerRoutes);
app.use('/cart', customerRoutes);
app.use('/orders', orderRoutes);
app.use('/customers/orders', orderRoutes);
app.use('/productapi', productRoutes);

app.get('/health', (req, res) => {
	res.json({ success: true, status: 'ok' });
});

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
