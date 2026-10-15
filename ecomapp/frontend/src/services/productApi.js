import axios from 'axios'

const productApi = axios.create({
    baseURL: import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:5000/productapi',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Products
export const getProducts = async (search = "", category = "") => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    const query = params.toString();
    const response = await productApi.get(`/products${query ? `?${query}` : ''}`);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await productApi.get(`/products/${id}`);
    return response.data;
};

// Categories
export const getCategories = async () => {
    const response = await productApi.get(`/categories`);
    return response.data;
};

export default productApi
