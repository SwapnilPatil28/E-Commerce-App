import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dummyjson.com/products',
});

// Products
export const getProducts = async (limit = 30, skip = 0) => {
    // dummyjson supports limit and skip, but getting all to simplify filter/sort for now if needed.
    // Or just fetch enough. Default limit=30.
    const response = await api.get(`?limit=${limit}&skip=${skip}`);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};

export const searchProducts = async (query) => {
    const response = await api.get(`/search?q=${query}`);
    return response.data;
};

// Categories
export const getCategories = async () => {
    const response = await api.get(`/categories`);
    return response.data;
};

export const getProductsByCategory = async (category) => {
    const response = await api.get(`/category/${category}`);
    return response.data;
};

export default api;