import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Clock } from 'lucide-react';
import API, { BASE_URL } from '../services/api';
import { isStoreOpen } from '../utils/timeHelper';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [isKitchenOpen, setIsKitchenOpen] = useState(true);

    useEffect(() => {
        API.get('/public/settings')
            .then(res => setIsKitchenOpen(isStoreOpen(res.data)))
            .catch(() => setIsKitchenOpen(true));
    }, []);

    const getImageUrl = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url}`;
    };

    if (cartItems.length === 0) {
        return (
            <div className="py-24 text-center flex flex-col items-center bg-gradient-to-b from-orange-50/50 to-white min-h-[60vh]">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-orange-100 mb-8 animate-bounce">
                    <ShoppingBag className="w-16 h-16 text-primary" />
                </div>
                <h2 className="text-4xl font-black text-secondary mb-4 tracking-tight">CART KHALI HAI! 🥘</h2>
                <p className="text-gray-500 mb-10 max-w-sm font-medium">Lagta hai aapne abhi tak kuch tasty order nahi kiya. Chaliye menu dekhte hain!</p>
                <Link to="/menu" className="bg-secondary dark:bg-primary text-white px-10 py-4 rounded-3xl font-black shadow-2xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all flex items-center gap-3">
                    EXPLORE MENU <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 px-6 py-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-secondary uppercase tracking-tight leading-none">Your <span className="text-gradient">Cart</span></h1>
                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs">{cartItems.length} Items Selected</p>
                </div>
                <button
                    onClick={clearCart}
                    className="text-xs font-black uppercase text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 group"
                >
                    <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Clear entire cart
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Items List */}
                <div className="lg:col-span-8 space-y-6">
                    {cartItems.map(item => (
                        <div key={item._id} className="group relative flex items-center gap-6 p-6 bg-white dark:bg-secondary/50 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 dark:bg-gray-900 rounded-[2rem] overflow-hidden flex-shrink-0 border dark:border-gray-800 shadow-inner">
                                <img
                                    src={getImageUrl(item.imageUrl)}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
                                    }}
                                />
                            </div>

                            <div className="flex-grow space-y-2">
                                <h3 className="text-xl font-black text-secondary dark:text-white group-hover:text-primary transition-colors">{item.name}</h3>
                                <div className="flex items-center gap-3">
                                    <p className="text-2xl font-black text-secondary dark:text-gray-200">₹{item.price}</p>
                                    <span className="text-[10px] font-black uppercase text-gray-400 border border-gray-200 dark:border-gray-800 px-2 py-0.5 rounded-md tracking-tighter">Per Unit</span>
                                </div>

                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex items-center bg-gray-50 dark:bg-gray-900 p-1.5 rounded-2xl border dark:border-gray-800 shadow-sm">
                                        <button
                                            onClick={() => item.quantity > 1 && addToCart(item, -1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm text-secondary dark:text-gray-400"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="px-5 font-black text-base min-w-[3rem] text-center dark:text-white uppercase tracking-tighter">{item.quantity}</span>
                                        <button
                                            onClick={() => addToCart(item, 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm text-secondary dark:text-gray-400"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                                        title="Remove Item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="hidden md:block text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
                                <p className="text-2xl font-black text-secondary dark:text-white">₹{item.price * item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Section */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                    <div className="bg-white dark:bg-secondary/80 p-8 rounded-[3rem] border-2 border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                        <h3 className="text-2xl font-black text-secondary dark:text-white mb-8 relative">Bill Details</h3>

                        <div className="space-y-5 relative">
                            <div className="flex justify-between items-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                <span>Item Total</span>
                                <span className="text-base text-secondary dark:text-gray-300 font-black tracking-normal">₹{subtotal}</span>
                            </div>

                            <div className="p-4 bg-orange-50 dark:bg-primary/10 rounded-3xl border border-orange-100 dark:border-primary/20 flex gap-4">
                                <div className="w-10 h-10 bg-white dark:bg-secondary rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                                    <Clock className="w-5 h-5 text-primary animate-pulse" />
                                </div>
                                <span className="text-[11px] font-bold text-orange-800 dark:text-primary leading-tight">Delivery changes & taxes will be added during the next checkout step.</span>
                            </div>

                            <div className="pt-8 mt-4 border-t-2 border-dashed border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <span className="text-xl font-black text-secondary dark:text-white">To Pay</span>
                                <span className="text-4xl font-black text-primary">₹{subtotal}</span>
                            </div>
                        </div>

                        {!isKitchenOpen && (
                            <div className="mt-8 bg-red-50 dark:bg-red-900/10 text-red-500 p-4 rounded-3xl text-center text-xs font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                                Kitchen currently offline
                            </div>
                        )}

                        <button
                            disabled={!isKitchenOpen}
                            onClick={() => navigate('/checkout')}
                            className={`w-full py-6 mt-8 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-3 shadow-2xl ${isKitchenOpen
                                ? 'bg-secondary dark:bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/30'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed grayscale'
                                }`}
                        >
                            {isKitchenOpen ? (
                                <>PROCEED TO PAY <ArrowRight className="w-6 h-6" /></>
                            ) : (
                                'CLOSED'
                            )}
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-secondary to-black p-8 rounded-[3rem] text-white overflow-hidden relative group">
                        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                        <h4 className="font-black text-sm uppercase tracking-[0.2em] mb-4 text-primary">Safety Assurance</h4>
                        <p className="text-xs font-medium text-gray-300 leading-relaxed uppercase">Har order ko puri safai aur pyaar se banaya jata hai. Freshness 100% Guaranteed!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
