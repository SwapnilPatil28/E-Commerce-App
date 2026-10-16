export const USD_TO_INR = 84;
export const CURRENCY = 'INR';

// USD price to paise for one unit (NaN if invalid)
export function usdToPaise(usdPrice) {
	const usd = Number(usdPrice);
	if (!Number.isFinite(usd) || usd <= 0) return NaN;
	return Math.round(usd * USD_TO_INR * 100);
}

export const paiseToInr = (paise) => paise / 100;

// USD price to INR
export const usdToInr = (usdPrice) => paiseToInr(usdToPaise(usdPrice));

// Adds priceInr to a product
export function withPriceInr(product) {
	if (!product) return product;
	const plain = typeof product.toObject === 'function' ? product.toObject() : { ...product };
	return { ...plain, priceInr: usdToInr(plain.price) };
}

// Cart totals from DB prices and quantities
export function summarizeCart(entries) {
	let totalPaise = 0;
	let itemCount = 0;

	for (const { price, quantity } of entries) {
		const unitPaise = usdToPaise(price);
		const qty = Number(quantity);
		if (!Number.isSafeInteger(unitPaise) || !Number.isInteger(qty) || qty < 1) {
			throw new Error('Invalid price or quantity in cart');
		}
		totalPaise += unitPaise * qty;
		itemCount += qty;
	}

	const totalInr = paiseToInr(totalPaise);
	return { itemCount, subtotalInr: totalInr, totalInr, totalPaise, currency: CURRENCY };
}

// INR total for one cart/order line
export function lineTotalInr(price, quantity) {
	return paiseToInr(usdToPaise(price) * Number(quantity));
}
