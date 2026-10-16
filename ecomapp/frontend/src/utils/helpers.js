/**
 * Display-only helpers.
 *
 * There is intentionally NO currency rate on the client. All prices and totals are
 * calculated by the backend (INR) and only formatted here, so editing frontend code
 * cannot change what a customer is charged.
 */

/**
 * Formats an INR amount that came from the server, e.g. "₹1,34,999" or "₹839.16".
 * Paise are shown only when present so shoppers always see the exact amount charged.
 * @param {number} inrAmount
 * @returns {string}
 */
export const formatInr = (inrAmount) => {
    const amount = Number(inrAmount) || 0;
    const digits = Number.isInteger(amount) ? 0 : 2;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(amount);
};

/**
 * Stable key for a product, used to track per-product UI state (e.g. "Adding...").
 * Works for DB documents (_id) and for objects that only carry the numeric id.
 */
export const getProductKey = (product) => {
    const key = product?._id || product?.id;
    return key ? String(key) : '';
};

export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
