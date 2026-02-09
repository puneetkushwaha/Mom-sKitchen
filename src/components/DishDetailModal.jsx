import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Star, Clock, ChevronLeft, ChevronRight, Check, Sparkles, Loader2 } from 'lucide-react';
import API, { BASE_URL } from '../services/api';

const DishDetailModal = ({ item, isOpen, onClose, onAddToCart, isKitchenOpen }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [recommendations, setRecommendations] = useState([]);
    const [recsLoading, setRecsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && item) {
            fetchRecommendations();
            setCurrentImageIndex(0);
        }
    }, [isOpen, item]);

    const fetchRecommendations = async () => {
        setRecsLoading(true);
        try {
            const { data } = await API.get(`/analytics/recommendations/${item._id}`);
            setRecommendations(data);
        } catch (err) {
            console.error('Failed to fetch recommendations', err);
        } finally {
            setRecsLoading(false);
        }
    };

    if (!isOpen || !item) return null;

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${BASE_URL}${path}`;
    };

    const nextImage = (e) => {
        e.stopPropagation();
        if (item.images && item.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
        }
    };

    const prevImage = (e) => {
        e.stopPropagation();
        if (item.images && item.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-300"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-secondary/80 backdrop-blur-xl"></div>

            <div
                className="relative bg-white dark:bg-secondary w-full max-w-5xl rounded-[2rem] md:rounded-[3rem] border-4 border-white dark:border-gray-800 overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh] transition-colors"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-secondary transition-all"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left: Image Gallery */}
                <div className="w-full md:w-1/2 h-80 md:h-auto relative bg-gray-50 flex-shrink-0">
                    {item.images && item.images.length > 0 ? (
                        <>
                            <img
                                src={getImageUrl(item.images[currentImageIndex])}
                                alt={item.name}
                                className="w-full h-full object-cover transition-all duration-700"
                            />

                            {item.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-secondary transition-all"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-secondary transition-all"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>

                                    {/* Dots */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                        {item.images.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1 rounded-full transition-all ${idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                                            ></div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-200 gap-4">
                            <ShoppingBag className="w-20 h-20" />
                            <p className="font-bold italic">No Photos Available</p>
                        </div>
                    )}

                    {/* Tags Over Images */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                        {item.isTodaySpecial && (
                            <div className="bg-primary text-white px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-lg">
                                <Clock className="w-3 h-3" /> Today's Special
                            </div>
                        )}
                        {item.isBestSeller && (
                            <div className="bg-amber-400 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-lg">
                                <Star className="w-3 h-3 fill-current" /> Best Seller
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Content Section */}
                <div className="flex-grow p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
                    <div className="flex-grow space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${item.isVeg ? 'border-green-500 text-green-600 bg-green-50' : 'border-red-500 text-red-600 bg-red-50'}`}>
                                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                                </div>
                                <div className="text-gray-400 font-bold text-xs uppercase tracking-widest">{item.category}</div>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-secondary dark:text-white leading-none mb-4">{item.name}</h2>
                            <div className="text-3xl font-black text-primary">₹{item.price}</div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</h4>
                            <p className="text-gray-500 text-lg leading-relaxed font-medium">
                                {item.description || "The chef hasn't added a description yet, but we promise it's delicious! Our ingredients are hand-picked for the best taste."}
                            </p>
                        </div>

                        {/* Ingredients / Highlights */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Fresh Ingredients', icon: Check },
                                { label: 'Home Style Cooking', icon: Check },
                                { label: 'Safe & Hygienic', icon: Check },
                                { label: 'Fast Delivery', icon: Check }
                            ].map((h, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm font-bold text-gray-400">
                                    <div className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                                        <h.icon className="w-3 h-3" />
                                    </div>
                                    {h.label}
                                </div>
                            ))}
                        </div>

                        {/* Recommendations Section */}
                        {recommendations.length > 0 && (
                            <div className="pt-8 space-y-4">
                                <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Frequently Ordered With
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {recommendations.map(rec => (
                                        <div
                                            key={rec._id}
                                            onClick={() => isKitchenOpen && onAddToCart(rec)}
                                            className={`p-4 rounded-3xl border transition-all overflow-hidden ${isKitchenOpen
                                                ? 'bg-gray-50 dark:bg-gray-900/50 dark:border-gray-800 hover:border-primary group/rec cursor-pointer'
                                                : 'bg-gray-100 opacity-60 cursor-not-allowed border-gray-200'
                                                }`}
                                        >
                                            <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-3 overflow-hidden grayscale-[0.5]">
                                                {rec.images?.[0] && (
                                                    <img src={getImageUrl(rec.images[0])} alt={rec.name} className="w-full h-full object-cover group-hover/rec:scale-110 transition-transform" />
                                                )}
                                            </div>
                                            <h5 className="font-black text-xs text-secondary dark:text-gray-200 line-clamp-1">{rec.name}</h5>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-[10px] font-black text-primary">₹{rec.price}</span>
                                                {isKitchenOpen && <Plus className="w-3 h-3 text-primary opacity-0 group-hover/rec:opacity-100 transition-opacity" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-10 mt-10 border-t border-dashed">
                        <button
                            onClick={() => {
                                if (isKitchenOpen) {
                                    onAddToCart(item);
                                    onClose();
                                }
                            }}
                            disabled={!isKitchenOpen}
                            className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 ${isKitchenOpen
                                ? 'bg-secondary text-white hover:bg-primary shadow-secondary/20 hover:shadow-primary/30'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed uppercase text-sm'
                                }`}
                        >
                            {isKitchenOpen ? (
                                <><Plus className="w-6 h-6" /> Add to Plate</>
                            ) : (
                                <><Clock className="w-5 h-5" /> Kitchen is Closed</>
                            )}
                        </button>
                        <p className="text-center mt-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            {isKitchenOpen ? 'Ready for immediate dispatch' : 'Check back during open hours'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DishDetailModal;
