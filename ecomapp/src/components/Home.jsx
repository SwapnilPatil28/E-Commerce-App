import React, { useState, useEffect } from "react";
import axios from "axios";
import Productcard from "./Productcard";
import { categories } from "./ProductCategories";

function Home() {
  const [productsFeed, setProductsFeed] = useState([]);
  const [FilteredProductsFeed, setFilteredProductsFeed] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [order, setOrder] = useState("rel");
  
  useEffect(() => {
    async function getData() {
      try {
        let response = await axios.get("https://dummyjson.com/products?limit=0");
        setProductsFeed(response.data.products);
        setFilteredProductsFeed(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getData();
  }, [] );

  function sortByOrder(prod1, prod2)
  {
    if(order==="rel")  return 0;
    else if(order === "asc")   return prod1.price-prod2.price;
    else return prod2.price-prod1.price;
  }

  useEffect(()=>{
    let filteredP;
    if(selectedCategory==="all")    filteredP = productsFeed;
    else{
        filteredP = productsFeed.filter((prod)=> {return prod.category===selectedCategory});
    }
    filteredP.sort(sortByOrder);
    setFilteredProductsFeed(filteredP);
  }, [selectedCategory, order])

  return (
    <div className="flex flex-col gap-8">
      
      {/* Brutalist Section Title */}
      <div className="inline-block bg-yellow-300 border-4 border-black px-6 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] self-start mb-4">
        <h1 className="font-black text-4xl uppercase tracking-tighter">
          Trending Products 🚀
        </h1>
      </div>

    <div className="flex flex-col md:flex-row gap-4 md:items-start">
    {/* Filter */}
      <div className="w-full md:max-w-sm bg-cyan-300 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <label
          htmlFor="category-filter"
          className="inline-block mb-3 bg-white border-2 border-black px-3 py-1 font-black text-sm uppercase tracking-wide"
        >
          Filter by Category
        </label>
        <select
          id="category-filter"
          onChange={(e) => {
            setSelectedCategory(e.target.value);
          }}
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
      <div className="w-full md:max-w-sm bg-cyan-300 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <label
          htmlFor="sort-order"
          className="inline-block mb-3 bg-white border-2 border-black px-3 py-1 font-black text-sm uppercase tracking-wide"
        >
          Sort by Price
        </label>
        <select
          id="sort-order"
          onChange={(e) => {
            setOrder(e.target.value);
          }}
          className="w-full bg-white border-4 border-black px-4 py-3 font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <option value="rel">By Relevance</option>
          <option value="asc">Ascending</option>
          <option value="des">Descending</option>
        </select>
      </div>
    </div>


      {/* Responsive Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {FilteredProductsFeed.map(function (prod) {
          return <Productcard key={prod.id} data={prod} />;
        })}
      </div>
      
    </div>
  );
}

export default Home;