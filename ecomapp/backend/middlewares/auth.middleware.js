import jwt from 'jsonwebtoken';
import Customer from '../models/customer.model.js';

async function protect(req, res, next) {
	try {
		let token = req.cookies.shopkart_token;
		if (!token && req.headers.authorization?.startsWith('Bearer ')) {
			token = req.headers.authorization.split(' ')[1];
		}

		if (!token) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const customer = await Customer.findById(decoded.customerId);

		if (!customer) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		req.user = customer;
		next();
	} catch (error) {
		return res.status(401).json({ success: false, message: 'Unauthorized' });
	}
}

export default protect;
