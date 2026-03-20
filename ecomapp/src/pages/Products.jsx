import React, {useState, useEffect} from 'react'
import ProductCard from '../components/Productcard';
import { categories } from '../components/ProductCategories';
import useDebounce from "../hooks/useDebounce";
import { getProducts, searchProducts } from '../services/api';
import { motion } from 'framer-motion';

function Products() {
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 500);
    const [productsFeed, setProductsFeed] = useState([]);
    const [filteredProductsFeed, setFilteredProductsFeed] = useState([]);
    
    // Filters
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [priceRange, setPriceRange] = useState("all"); 
    const [order, setOrder] = useState("rel");
    
    const [loading, setLoading] = useState(false);

    // --- Data Fetching ---
    // Fetch initial products or search results when debounce completes
    useEffect(() => {
        async function getData() {
            try {
                setLoading(true);
                let data;
                if (debouncedSearch) {
                    data = await searchProducts(debouncedSearch);
                } else {
                    // Fetch more to ensure we have enough data to filter client-side effectively
                    data = await getProducts(100); 
                }
                setProductsFeed(data.products);
                setFilteredProductsFeed(data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, [debouncedSearch]);

    // --- Client-Side Filtering ---
    // Reactively filter the product feed when user changes options
    useEffect(() => {
        let result = [...productsFeed];

        // 1. Category Filter
        if (selectedCategory !== "all") {
            result = result.filter(p => p.category === selectedCategory);
        }

        // 2. Price Range Filter
        if (priceRange !== "all") {
            const [min, max] = priceRange.split('-').map(Number);
            if (max) {
                result = result.filter(p => p.price >= min && p.price <= max);
            } else {
                // "1000+" case
                result = result.filter(p => p.price >= min);
            }
        }

        // 3. Sorting
        if (order === "asc") {
            result.sort((a,b) => a.price - b.price);
        } else if (order === "desc") {
            result.sort((a,b) => b.price - a.price);
        } else if (order === "newest") {
             // Mocking "newest" by ID descending (assuming higher ID = newer)
             result.sort((a,b) => b.id - a.id);
        } 
        // "rel" keeps original order
        
        setFilteredProductsFeed(result);
    }, [selectedCategory, priceRange, order, productsFeed]);


    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
            {/* Search & Filters Bar */}
            <div className="bg-yellow-300 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <input 
                    type="text" 
                    placeholder="SEARCH PRODUCTS..." 
                    className="w-full border-4 border-black p-4 font-black text-xl uppercase placeholder-gray-500 focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {/* Category Filter */}
                    <div className="flex flex-col">
                        <label className="font-black uppercase text-sm mb-1">Category</label>
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-white border-4 border-black p-3 font-bold uppercase focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                            <option value="all">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                     {/* Price Filter */}
                     <div className="flex flex-col">
                        <label className="font-black uppercase text-sm mb-1">Price Range</label>
                        <select 
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="bg-white border-4 border-black p-3 font-bold uppercase focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                            <option value="all">All Prices</option>
                            <option value="0-50">$0 - $50</option>
                            <option value="50-100">$50 - $100</option>
                            <option value="100-500">$100 - $500</option>
                            <option value="500-1000">$500 - $1000</option>
                            <option value="1000+">$1000+</option>
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div className="flex flex-col">
                        <label className="font-black uppercase text-sm mb-1">Sort By</label>
                        <select 
                            value={order} 
                            onChange={(e) => setOrder(e.target.value)}
                            className="bg-white border-4 border-black p-3 font-bold uppercase focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                            <option value="rel">Relevance</option>
                            <option value="asc">Price: Low to High</option>
                            <option value="desc">Price: High to Low</option>
                            <option value="newest">Newest Arrivals</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                 <div className="flex justify-center p-10 font-black text-2xl uppercase">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProductsFeed.length > 0 ? (
                        filteredProductsFeed.map((product) => (
                            <motion.div 
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProductCard data={product} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center font-black text-2xl uppercase py-10 bg-white border-4 border-black box-border">
                            No Products Found
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Products