// ---------------------------------------------------------------------------
// Single source of truth for currency conversion and price maths.
//
// Catalogue prices are stored in USD. The conversion rate lives ONLY here, on
// the server. Nothing the browser sends (rate, price, total, quantity) is ever
// used to work out what a customer is charged, so tampering with the frontend
// cannot change the amount.
//
// All maths is done in integer paise (1 INR = 100 paise) to avoid floating-point
// drift, so what the shopper sees always equals what Razorpay charges.
// ---------------------------------------------------------------------------

export const USD_TO_INR = 84;
export const CURRENCY = 'INR';

/** USD price -> integer paise for ONE unit. Returns NaN for invalid input. */
export function usdToPaise(usdPrice) {
	const usd = Number(usdPrice);
	if (!Number.isFinite(usd) || usd <= 0) return NaN;
	return Math.round(usd * USD_TO_INR * 100);
}

export const paiseToInr = (paise) => paise / 100;

/** USD price -> INR rupees (2 decimal places at most). */
export const usdToInr = (usdPrice) => paiseToInr(usdToPaise(usdPrice));

/** Adds the server-computed INR price to a product (Mongoose doc or plain object). */
export function withPriceInr(product) {
	if (!product) return product;
	const plain = typeof product.toObject === 'function' ? product.toObject() : { ...product };
	return { ...plain, priceInr: usdToInr(plain.price) };
}

/**
 * Totals for a list of { price (USD, from the DB), quantity } entries.
 * Used for both the cart summary shown to the user and the final charge.
 */
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

/** INR line total (unit price x quantity) for one cart/order line. */
export function lineTotalInr(price, quantity) {
	return paiseToInr(usdToPaise(price) * Number(quantity));
}
