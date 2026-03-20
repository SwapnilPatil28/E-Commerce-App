import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../services/api'
import useCart from '../hooks/useCart'
import useWishlist from '../hooks/useWishlist'
import { motion } from 'framer-motion'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../index.css'; // Ensure tailwind is available 

function ProductDetails() {
    // 1. Get the product ID from the URL using useParams
    const { id } = useParams();
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const { addToCart } = useCart();
    const { addToWishlist } = useWishlist();

    // 2. Fetch product details when the component mounts or ID changes
    useEffect(()=>{
        async function getData(){
            try {
                let product = await getProductById(id);
                setData(product);
            } catch(error){
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, [id])

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="bg-yellow-300 border-4 border-black px-8 py-4 font-black text-2xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">Loading...</div></div>;
    
    if (!data.id) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="bg-pink-400 border-4 border-black px-8 py-4 font-black text-2xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">Product not found</div></div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto p-6"
        >
            {/* LEFT COLUMN - SMALL */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                {/* Product Image Gallery with Swiper */}
                <div className="bg-white border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-96">
                    {data.images && data.images.length > 0 ? (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            className="h-full w-full"
                        >
                            {data.images.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <div className="w-full h-full bg-white flex items-center justify-center">
                                        <img src={img} alt={`${data.title} - ${index}`} className="max-w-full max-h-full object-contain" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-black uppercase text-xl bg-gray-200">No Images</div>
                    )}
                </div>

                {/* Essential Details Box */}
                <div className="bg-cyan-300 border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                    <h1 className="font-black text-2xl uppercase tracking-tight leading-tight">{data.title}</h1>
                    
                    <div className="border-t-4 border-black pt-4">
                        <div className="font-black text-sm uppercase text-gray-700 mb-1">Price</div>
                        <div className="font-black text-5xl">${data.price}</div>
                        {data.discountPercentage && (
                            <div className="text-xs font-black uppercase mt-2 bg-white border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                -{data.discountPercentage.toFixed(1)}%
                            </div>
                        )}
                    </div>

                    <div className="border-t-4 border-black pt-4">
                        <div className="font-black text-sm uppercase text-gray-700 mb-1">Rating</div>
                        <div className="font-black text-4xl">{data.rating} ⭐</div>
                    </div>

                    <button 
                        onClick={() => addToCart({ id: data.id, title: data.title, price: data.price, thumbnail: data.thumbnail || data.images[0] })}
                        className="w-full bg-pink-400 border-4 border-black px-4 py-3 font-black uppercase tracking-wide transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-2">
                        Add to Cart
                    </button>

                    <button 
                        onClick={() => addToWishlist({ id: data.id, title: data.title, price: data.price, thumbnail: data.thumbnail || data.images[0] })}
                        className="w-full bg-lime-300 border-4 border-black px-4 py-3 font-black uppercase tracking-wide transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        ❤️ Add to Wishlist
                    </button>
                </div>
            </div>

            {/* RIGHT COLUMN - LARGE */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Description */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="font-black text-2xl uppercase tracking-tight mb-4 border-b-4 border-black pb-3">Description</h2>
                    <p className="font-bold text-base leading-relaxed">{data.description}</p>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {data.brand && (
                        <div className="bg-pink-300 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <div className="font-black text-xs uppercase text-gray-700 mb-1">Brand</div>
                            <div className="font-black text-lg uppercase">{data.brand}</div>
                        </div>
                    )}
                    {data.category && (
                        <div className="bg-cyan-300 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <div className="font-black text-xs uppercase text-gray-700 mb-1">Category</div>
                            <div className="font-black text-lg uppercase">{data.category}</div>
                        </div>
                    )}
                    {data.stock !== undefined && (
                        <div className="bg-lime-300 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <div className="font-black text-xs uppercase text-gray-700 mb-1">Stock</div>
                            <div className="font-black text-lg">{data.stock} units</div>
                        </div>
                    )}
                    {data.sku && (
                        <div className="bg-yellow-300 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <div className="font-black text-xs uppercase text-gray-700 mb-1">SKU</div>
                            <div className="font-black text-sm">{data.sku}</div>
                        </div>
                    )}
                    {data.weight && (
                        <div className="bg-orange-300 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <div className="font-black text-xs uppercase text-gray-700 mb-1">Weight</div>
                            <div className="font-black text-lg">{data.weight}g</div>
                        </div>
                    )}
                    {data.availabilityStatus && (
                        <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <div className="font-black text-xs uppercase text-gray-700 mb-1">Availability</div>
                            <div className="font-black text-lg uppercase text-green-600">{data.availabilityStatus}</div>
                        </div>
                    )}
                </div>

                {/* Extended Details */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="font-black text-2xl uppercase tracking-tight mb-4 border-b-4 border-black pb-3">Details</h2>
                    <div className="space-y-3">
                        {data.warrantyInformation && (
                            <div className="flex justify-between border-b-2 border-black pb-2">
                                <span className="font-black uppercase text-sm">Warranty</span>
                                <span className="font-bold">{data.warrantyInformation}</span>
                            </div>
                        )}
                        {data.shippingInformation && (
                            <div className="flex justify-between border-b-2 border-black pb-2">
                                <span className="font-black uppercase text-sm">Shipping</span>
                                <span className="font-bold">{data.shippingInformation}</span>
                            </div>
                        )}
                        {data.returnPolicy && (
                            <div className="flex justify-between border-b-2 border-black pb-2">
                                <span className="font-black uppercase text-sm">Return Policy</span>
                                <span className="font-bold">{data.returnPolicy}</span>
                            </div>
                        )}
                        {data.minimumOrderQuantity && (
                            <div className="flex justify-between border-b-2 border-black pb-2">
                                <span className="font-black uppercase text-sm">Min Order</span>
                                <span className="font-bold">{data.minimumOrderQuantity}</span>
                            </div>
                        )}
                        {data.dimensions && (
                            <div className="flex justify-between border-b-2 border-black pb-2">
                                <span className="font-black uppercase text-sm">Dimensions</span>
                                <span className="font-bold">{data.dimensions.width}x{data.dimensions.height}x{data.dimensions.depth} cm</span>
                            </div>
                        )}
                        {data.tags && data.tags.length > 0 && (
                            <div className="pt-2">
                                <span className="font-black uppercase text-sm block mb-2">Tags</span>
                                <div className="flex flex-wrap gap-2">
                                    {data.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-pink-400 border-2 border-black px-2 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                {data.reviews && data.reviews.length > 0 && (
                    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="font-black text-2xl uppercase tracking-tight mb-4 border-b-4 border-black pb-3">Reviews ({data.reviews.length})</h2>
                        <div className="space-y-4">
                            {data.reviews.map((review, idx) => (
                                <div key={idx} className="bg-cyan-100 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="flex justify-between mb-2">
                                        <div className="font-black text-lg">{review.rating} ⭐</div>
                                        <div className="text-xs font-bold text-gray-600">{new Date(review.date).toLocaleDateString()}</div>
                                    </div>
                                    <p className="font-bold text-base mb-2">{review.comment}</p>
                                    <div className="font-black text-sm uppercase text-gray-700">{review.reviewerName}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default ProductDetails


