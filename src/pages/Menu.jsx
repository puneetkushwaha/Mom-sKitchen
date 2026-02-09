import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { Plus, Search, X, Star, Leaf, Flame } from 'lucide-react';
import { isStoreOpen } from '../utils/timeHelper';
import DishDetailModal from '../components/DishDetailModal';
import { BASE_URL } from '../services/api';

const Menu = () => {
    // ... items state initialized above ...

    const getImageUrl = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80';
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url}`;
    };
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [settings, setSettings] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { addToCart } = useCart();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [menuRes, settingsRes] = await Promise.allSettled([
                API.get('/menu'),
                API.get('/public/settings')
            ]);

            const menuData = menuRes.status === 'fulfilled' ? menuRes.value.data : [];
            const settingsData = settingsRes.status === 'fulfilled' ? settingsRes.value.data : null;

            setItems(Array.isArray(menuData) ? menuData : []);
            setSettings(settingsData);

            const cats = ['All', ...new Set((Array.isArray(menuData) ? menuData : []).map(item => item.category))];
            setCategories(cats);
        } catch (err) {
            console.error('Failed to fetch data', err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const isOpen = isStoreOpen(settings);

    const filteredItems = items.filter(item =>
        (activeCategory === 'All' || item.category === activeCategory) &&
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-semibold">Loading delicious dishes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <section className="py-12 md:py-16 px-6 bg-gradient-to-br from-orange-50 via-white to-orange-100/50">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-secondary mb-4 leading-none">
                        Our <span className="text-gradient">Delicious</span> Menu
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        From starters to desserts, we have everything you crave
                    </p>
                </div>
            </section>

            {/* Search & Categories */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-premium p-6 mb-8">
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for dishes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 bg-orange-50/50 border-2 border-orange-100 rounded-xl font-medium focus:border-orange-500 focus:bg-white transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-12 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-all ${activeCategory === cat
                                ? 'bg-primary text-white shadow-premium'
                                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Grid */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-6 text-gray-600 font-semibold">
                    Showing {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
                </div>

                {filteredItems.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-black text-secondary mb-2">No dishes found</h3>
                        <p className="text-gray-600">Try searching for something else</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map((item, i) => (
                            <div
                                key={item._id}
                                onClick={() => openModal(item)}
                                className="group cursor-pointer card-hover animate-scale-in"
                                style={{ animationDelay: `${i * 30}ms` }}
                            >
                                <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 h-full flex flex-col">
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={getImageUrl(item.imageUrl)}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                if (e.target.src !== 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80') {
                                                    e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80';
                                                }
                                            }}
                                        />

                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            {item.isVeg !== undefined && (
                                                <div className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-soft">
                                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                                        <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-soft">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                <span className="text-xs font-bold text-gray-900">4.8</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex-grow flex flex-col">
                                        <h3 className="text-lg font-black text-secondary mb-2 line-clamp-1">{item.name}</h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{item.description}</p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="text-2xl font-black text-primary">₹{item.price}</div>
                                            <button
                                                disabled={!isOpen}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(item);
                                                }}
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all transform shadow-soft ${isOpen
                                                    ? 'bg-primary hover:bg-accent text-white hover:scale-110'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                                    }`}
                                            >
                                                {isOpen ? <Plus className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    {!isOpen && (
                                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-20 pointer-events-none">
                                            <div className="bg-secondary text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                                                Kitchen Closed
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DishDetailModal
                item={selectedItem}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={addToCart}
                isKitchenOpen={isOpen}
            />
        </div>
    );
};

export default Menu;
