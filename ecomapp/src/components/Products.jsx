import React, {useState, useEffect} from 'react'
import axios from 'axios';
import ProductCard from './Productcard';
import { categories } from './ProductCategories';

function Products() {
    const[searchQuery, setSearchQuery] = useState("");
    const[productsFeed, setProductsFeed] = useState([]);
    const[FilteredProductsFeed, setFilteredProductsFeed] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [order, setOrder] = useState("rel");

    async function getProduct(){
        let response = await axios.get(`https://dummyjson.com/products/search?q=${searchQuery}`);
        setProductsFeed(response.data.products);
        setFilteredProductsFeed(response.data.products);
        setSearchQuery("");
        setSelectedCategory("all");
        setOrder("rel");
    }

    useEffect(()=>{getProduct();},[]);

    function sortByOrder(prod1, prod2)
    {
        if(order==="rel")  return 0;
        else if(order === "asc")   return prod1.price-prod2.price;
        else return prod2.price-prod1.price;
    }

    useEffect(()=>{
        let filteredP;
        if(selectedCategory==="all")    filteredP = structuredClone(productsFeed);
        else{
            filteredP = productsFeed.filter((prod)=> {return prod.category===selectedCategory});
        }
        filteredP.sort(sortByOrder);
        setFilteredProductsFeed(filteredP);
    }, [selectedCategory, order, productsFeed])

  return (
    <>
        <section className="w-full max-w-5xl bg-cyan-300 border-4 border-black p-6 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="inline-block bg-white border-4 border-black px-4 py-2 font-black text-3xl md:text-4xl uppercase tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            Product Search
        </h1>
        <p className="mt-6 bg-white border-4 border-black p-4 md:p-5 font-bold text-base leading-relaxed shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row gap-3 sm:items-center">
            <input className="w-full sm:flex-1 bg-yellow-200 border-4 border-black px-4 py-3 font-black uppercase tracking-wide placeholder:text-black/70 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" type='text' placeholder='Search for an item...' value={searchQuery} onChange={(e)=>{setSearchQuery(e.target.value)}}></input>
            <button className="bg-pink-400 border-4 border-black px-6 py-3 font-black uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" onClick={()=>getProduct()}>Search</button>
        </p>
        </section>

        <div className="mt-6 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Filter */}
            <div className="w-full bg-lime-300 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <label
                htmlFor="category-filter"
                className="inline-block mb-3 bg-white border-2 border-black px-3 py-1 font-black text-sm uppercase tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
                Filter by Category
            </label>
            <select
                id="category-filter"
                onChange={(e) => {
                setSelectedCategory(e.target.value);
                }}
                value={selectedCategory}
                className="w-full bg-white border-4 border-black px-4 py-3 font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
                <option value="all">All</option>
                {categories.map(function (category) {
                return (
                    <option key={category} value={category}>
                    {category}
                    </option>
                );
                })}
            </select>
            </div>
    
        {/* Sort */}
            <div className="w-full bg-yellow-300 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <label
                htmlFor="sort-order"
                className="inline-block mb-3 bg-white border-2 border-black px-3 py-1 font-black text-sm uppercase tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
                Sort by Price
            </label>
            <select
                id="sort-order"
                onChange={(e) => {
                setOrder(e.target.value);
                }}
                value={order}
                className="w-full bg-white border-4 border-black px-4 py-3 font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
                <option value="rel">By Relevance</option>
                <option value="asc">Ascending</option>
                <option value="des">Descending</option>
            </select>
            </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {FilteredProductsFeed.map(function(prod){
                return <ProductCard
                    key={prod.id}   
                    data = {prod}
                />
            })}
        </div>

    </>
  )
}

export default Products