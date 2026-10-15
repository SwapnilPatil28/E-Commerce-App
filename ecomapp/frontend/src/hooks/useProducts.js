import { useState, useEffect } from "react";
import { getProducts } from "../services/productApi";

const useProducts = (limit = 0, skip = 0) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.products || []);
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