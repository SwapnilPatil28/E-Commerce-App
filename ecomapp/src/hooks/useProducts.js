import { useState, useEffect } from "react";
import axios from "axios";

const useProducts = (limit = 0, skip = 0) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
        setProducts(response.data.products);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit, skip]);

  return { products, loading, error };
};

export default useProducts;