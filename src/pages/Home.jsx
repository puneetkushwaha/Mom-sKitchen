import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Shield, Truck, Award, Heart, ChefHat } from 'lucide-react';
import API from '../services/api';
import { isStoreOpen } from '../utils/timeHelper';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import DishDetailModal from '../components/DishDetailModal';

const Home = () => {
    const [settings, setSettings] = useState(null);
    const [items, setItems] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const isOpen = isStoreOpen(settings);

    useEffect(() => {
        API.get('/public/settings').then(res => setSettings(res.data)).catch(() => { });
        API.get('/menu').then(res => setItems(res.data.slice(0, 6))).catch(() => { });
        API.get('/reviews').then(res => setReviews(res.data.slice(0, 3))).catch(() => { });
    }, []);

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100/50">
                {/* Decorative Elements */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="animate-slide-up">
                            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full mb-6 shadow-soft">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-sm font-bold text-gray-700">{isOpen ? 'Kitchen Open Now' : 'Kitchen Closed'}</span>
                            </div>

                            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black text-[#7C2D12] mb-6 leading-[1.2] md:leading-[1.1]">
                                Authentic<br />
                                <span className="text-gradient">Desi Taste</span><br />
                                From Our Kitchen
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                                Experience the soul of home-cooked meals. Healthy, hygienic, and delicious homestyle food delivered to your table.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/menu"
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-premium hover:shadow-glow transition-all hover:-translate-y-0.5"
                                >
                                    Order Now
                                    <ArrowRight className="w-5 h-5" />
                                </Link>

                                <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-orange-50 text-secondary font-bold text-lg rounded-xl shadow-soft hover:shadow-premium transition-all border-2 border-orange-100">
                                    <ChefHat className="w-5 h-5 text-primary" />
                                    How it Works
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-8 mt-12">
                                <div>
                                    <div className="text-3xl font-black text-secondary">12k+</div>
                                    <div className="text-sm text-gray-600 font-semibold">Happy Customers</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-secondary">4.8★</div>
                                    <div className="text-sm text-gray-600 font-semibold">Average Rating</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-secondary">100%</div>
                                    <div className="text-sm text-gray-600 font-semibold">Hygienic</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative animate-fade-in">
                            <div className="relative rounded-3xl overflow-hidden shadow-premium">
                                <img
                                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
                                    alt="Delicious Food"
                                    className="w-full h-[400px] md:h-[600px] object-cover"
                                />
                                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-premium border-2 border-orange-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">5.0 Rating</p>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 bg-white rounded-2xl p-4 md:p-6 shadow-premium animate-float ring-4 ring-orange-50/50">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Shield className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-black text-[#7C2D12] text-sm md:text-lg">100% Hygienic</div>
                                        <div className="text-[10px] md:text-sm text-gray-600">Quality Assured</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-secondary mb-4">Why Choose Us?</h2>
                        <p className="text-xl text-gray-600">Quality, hygiene, and taste - all in one place</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Clock, title: "Super Fast", desc: "Fresh food delivered in 30 minutes", color: "bg-orange-500" },
                            { icon: Shield, title: "100% Safe", desc: "No artificial colors, home-style hygiene", color: "bg-green-500" },
                            { icon: Truck, title: "Live Tracking", desc: "Real-time updates from kitchen to door", color: "bg-blue-500" }
                        ].map((feature, i) => (
                            <div key={i} className="group card-hover">
                                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 h-full">
                                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#7C2D12] mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Dishes */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-[#7C2D12] mb-2">Popular Dishes</h2>
                            <p className="text-xl text-gray-600">Customer favorites you'll love</p>
                        </div>
                        <Link to="/menu" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                            View All <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item, i) => (
                            <div
                                key={item._id}
                                onClick={() => openModal(item)}
                                className="group cursor-pointer card-hover animate-scale-in"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100">
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80'}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                if (e.target.src !== 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80') {
                                                    e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80';
                                                }
                                            }}
                                        />
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-soft">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="text-sm font-bold text-gray-900">4.8</span>
                                            </div>
                                        </div>
                                        {item.isVeg !== undefined && (
                                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-soft">
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                                    <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-black text-[#7C2D12] mb-2">{item.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="text-2xl font-black text-primary">₹{item.price}</div>
                                            <button
                                                disabled={!isOpen}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(item);
                                                }}
                                                className={`px-6 py-2 font-bold rounded-lg transition-all ${isOpen
                                                    ? 'bg-primary hover:bg-accent text-white shadow-soft active:scale-95'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                {isOpen ? 'Add' : 'Closed'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/menu" className="inline-flex items-center gap-3 px-8 py-4 bg-secondary hover:bg-secondary/90 text-black font-bold text-lg rounded-xl shadow-soft hover:shadow-premium transition-all">
                            Explore Full Menu
                            <ArrowRight className="w-5 h-5 text-black" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Reviews */}
            {reviews.length > 0 && (
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-secondary mb-4">What People Say</h2>
                            <p className="text-xl text-gray-600">Real reviews from real customers</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-8 card-hover">
                                    <div className="flex text-yellow-400 mb-4">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                                    </div>
                                    <p className="text-gray-700 mb-6 leading-relaxed">"{review.comment}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-primary rounded-full"></div>
                                        <div>
                                            <p className="font-bold text-secondary">{review.user?.name || 'Happy Customer'}</p>
                                            <p className="text-sm text-gray-600">Verified Buyer</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-24 px-6 bg-gradient-to-br from-primary via-accent to-primary">
                <div className="max-w-5xl mx-auto text-center text-black">
                    <h2 className="text-5xl md:text-6xl font-black mb-6">Ready to Order?</h2>
                    <p className="text-xl mb-10 opacity-90">Get your favorite homestyle dishes delivered fresh & hot!</p>
                    <Link to="/menu" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black text-xl rounded-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                        Order Now <ArrowRight className="w-6 h-6 text-black" />
                    </Link>
                </div>
            </section>

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

export default Home;
