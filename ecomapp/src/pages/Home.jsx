import React, { useState, useMemo } from "react";
import Productcard from "../components/Productcard";
import { categories } from "../components/ProductCategories";
import useProducts from "../hooks/useProducts";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  // 1. Fetch products using custom hook
  const { products, loading: productsLoading } = useProducts(0); // Fetch all products
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [order, setOrder] = useState("rel");

  // 2. Filter and Sort Logic
  // We use useMemo to optimize performance, only re-calculating when dependencies change
  const filteredProductsFeed = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== "all") {
        result = result.filter(p => p.category === selectedCategory);
    }

    // Sort by Price
    if (order === "asc") {
        result.sort((a,b) => a.price - b.price);
    } else if (order === "desc") {
        result.sort((a,b) => b.price - a.price);
    }
    
    return result;
  }, [selectedCategory, order, products]);

  if (productsLoading) {
     return <div className="min-h-screen flex items-center justify-center bg-white"><div className="bg-yellow-300 border-4 border-black px-8 py-4 font-black text-2xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">Loading...</div></div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hero / Banner */}
      <div className="bg-cyan-300 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="font-black text-4xl md:text-6xl uppercase tracking-tight mb-6 leading-tight">
          Bold. Brutal. <br/><span className="bg-white px-2">Best Prices.</span>
        </h1>
        <p className="font-bold text-xl mb-6 max-w-2xl leading-snug">
          Discover the latest trends with our high-contrast collection. No minimalist non-sense included.
        </p>
        <Link to="/products" className="inline-block bg-pink-400 border-4 border-black px-6 py-4 font-black uppercase text-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          Shop Now
        </Link>
      </div>

        {/* Category Dropdown & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] gap-4">
             {/* Category Dropdown */}
             <div className="flex items-center gap-2 w-full md:w-auto">
                <label className="font-bold uppercase text-sm whitespace-nowrap">Category:</label>
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full md:w-auto bg-white border-2 border-black p-2 font-bold uppercase focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer">
                    <option value="all">All Products</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
             </div>

             {/* Sort Controls */}
             <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <label className="font-bold uppercase text-sm whitespace-nowrap">Sort:</label>
                <select 
                    value={order} 
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full md:w-auto bg-white border-2 border-black p-2 font-bold uppercase focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer">
                    <option value="rel">Relevance</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
             </div>
        </div>

      {/* Product Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProductsFeed.map((product) => (
          <motion.div 
            key={product.id} 
            layout 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Productcard data={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Home;
