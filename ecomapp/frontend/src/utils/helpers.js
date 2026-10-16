// Display-only helpers. All prices and totals come from the backend in INR.

// Formats an INR amount, e.g. "₹1,34,999" or "₹839.16"; shows paise only when present
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

// Stable key for a product (_id, or numeric id), used to track per-product UI state
export const getProductKey = (product) => {
    const key = product?._id || product?.id;
    return key ? String(key) : '';
};

export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
