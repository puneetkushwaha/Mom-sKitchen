import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Mom's Kitchen - Premium Pill-Shaped Navbar
const Navbar = () => {
    const { cartItems } = useCart();
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="sticky top-4 z-[60] px-4 md:px-6">
            <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl border border-orange-100/50 shadow-premium rounded-full px-6 md:px-8 py-3 relative">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
                        <img
                            src="/logo.png"
                            alt="Mom's Kitchen"
                            className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform group-hover:scale-110 group-hover:rotate-6"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full hidden items-center justify-center text-xl md:text-2xl">
                            👩‍🍳
                        </div>
                        <div className="hidden xs:block">
                            <h1 className="text-lg md:text-xl font-black text-secondary leading-none">Mom's Kitchen</h1>
                            <p className="text-[10px] md:text-xs font-bold text-orange-500 uppercase tracking-wider">Cloud Kitchen</p>
                        </div>
                    </Link>

                    {/* Center Navigation (Desktop) */}
                    <div className="hidden lg:flex items-center gap-6 lg:gap-8">
                        <Link to="/" className="text-gray-700 font-semibold hover:text-orange-500 transition-colors">Home</Link>
                        <Link to="/menu" className="text-gray-700 font-semibold hover:text-orange-500 transition-colors">Menu</Link>
                        <Link to="/about" className="text-gray-700 font-semibold hover:text-orange-500 transition-colors">About</Link>
                        <Link to="/contact" className="text-gray-700 font-semibold hover:text-orange-500 transition-colors">Contact</Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 md:gap-4">
                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 hover:bg-orange-50 rounded-lg transition-colors group">
                            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-orange-500 transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-orange-500 text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Menu (Desktop) */}
                        <div className="hidden lg:flex items-center gap-3">
                            {user ? (
                                <>
                                    <Link
                                        to={user.isAdmin ? "/admin" : "/profile"}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        {user.isAdmin ? <LayoutDashboard className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                        <span className="hidden lg:inline font-semibold">{user.name?.split(' ')[0]}</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('user');
                                            window.location.href = '/login';
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="px-4 py-2 font-semibold text-gray-700 hover:text-orange-500 transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/signup" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-soft hover:shadow-premium whitespace-nowrap">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-full transition-all shadow-md active:scale-95 whitespace-nowrap"
                        >
                            <Menu className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-tight">Menu</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl border border-orange-100 shadow-2xl p-6 lg:hidden animate-in slide-in-from-top-4 duration-300 z-[70]">
                        <div className="flex flex-col gap-4">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-gray-50 rounded-xl font-bold text-secondary hover:bg-orange-50">Home</Link>
                            <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-gray-50 rounded-xl font-bold text-secondary hover:bg-orange-50">Menu</Link>
                            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-gray-50 rounded-xl font-bold text-secondary hover:bg-orange-50">About</Link>
                            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-gray-50 rounded-xl font-bold text-secondary hover:bg-orange-50">Contact</Link>

                            <hr className="border-orange-50" />

                            {user ? (
                                <div className="space-y-3">
                                    <Link
                                        to={user.isAdmin ? "/admin" : "/profile"}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-black"
                                    >
                                        {user.isAdmin ? <LayoutDashboard className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                        {user.isAdmin ? 'Admin Dashboard' : 'My Profile'}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('user');
                                            window.location.href = '/login';
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold"
                                    >
                                        <LogOut className="w-5 h-5" /> Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-4 bg-gray-100 text-center rounded-xl font-black text-secondary">Login</Link>
                                    <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="px-4 py-4 bg-orange-500 text-center text-white rounded-xl font-black">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
