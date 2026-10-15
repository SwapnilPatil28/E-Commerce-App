// USD to INR conversion rate (1 USD = 84 INR)
// Update this constant to change the rate across the entire app.
export const USD_TO_INR = 84;

/**
 * Converts a USD price to INR.
 * @param {number} usdPrice
 * @returns {number}
 */
export const usdToInr = (usdPrice) => Math.round(usdPrice * USD_TO_INR * 100) / 100;

/**
 * Formats an amount that is already in INR (e.g. order.totalAmount from DB).
 * @param {number} inrAmount
 * @returns {string}
 */
export const formatInr = (inrAmount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(inrAmount);
};

/**
 * Formats a USD price as Indian Rupees (₹) for display.
 * @param {number} usdPrice - price in USD
 * @returns {string} - formatted INR string e.g. "₹1,34,999"
 */
export const formatPrice = (usdPrice) => {
    const inr = usdToInr(usdPrice);
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(inr);
};

export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};