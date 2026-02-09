import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../services/api';
import { User, Mail, Phone, ShoppingBag, Clock, ChevronRight, Loader2, Package, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const { replaceCart } = useCart();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const { data } = await API.get('/orders/myorders');
                setOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyOrders();
        }
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-600';
            case 'Confirmed': return 'bg-blue-100 text-blue-600';
            case 'Preparing': return 'bg-purple-100 text-purple-600';
            case 'Delivered': return 'bg-green-100 text-green-600';
            case 'Cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-gray-500 font-bold animate-pulse">Loading your profile...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-6">
            {/* User Info Header */}
            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/20">
                    {(user?.name || user?.email)?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-grow text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-black text-secondary">
                        {user?.name || user?.email?.split('@')[0] || 'User'}
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold text-gray-500">
                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user?.email || 'No email'}</span>
                        <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {user?.phone || 'No phone'}</span>
                    </div>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }}
                    className="bg-red-50 text-red-500 px-6 py-3 rounded-2xl font-black text-sm hover:bg-red-100 transition-all border border-red-100"
                >
                    Logout
                </button>
            </div>

            {/* Order History */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-2xl font-black text-secondary flex items-center gap-3">
                        <ShoppingBag className="w-7 h-7 text-primary" /> My Order History
                    </h2>
                    <span className="bg-gray-100 px-4 py-1.5 rounded-full text-xs font-black text-gray-500">
                        {orders.length} Orders
                    </span>
                </div>

                <div className="grid gap-4">
                    {orders.length === 0 ? (
                        <div className="bg-gray-50 border border-dashed p-16 rounded-[2rem] text-center space-y-4">
                            <Package className="w-12 h-12 text-gray-300 mx-auto" />
                            <p className="text-gray-500 font-bold">You haven't placed any orders yet.</p>
                            <Link to="/menu" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all">
                                Browse Menu
                            </Link>
                        </div>
                    ) : (
                        orders.map(order => (
                            <Link
                                key={order._id}
                                to={`/track/${order._id}`}
                                className="group bg-white p-6 rounded-[2rem] border hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col md:flex-row items-center gap-6"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getStatusColor(order.orderStatus).split(' ')[0]}`}>
                                    {order.orderStatus === 'Delivered' ? <CheckCircle2 className="w-7 h-7 text-green-600" /> : <Clock className="w-7 h-7 text-amber-600" />}
                                </div>

                                <div className="flex-grow text-center md:text-left space-y-1">
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                                        <p className="font-black text-secondary text-lg">Order #{order.orderId}</p>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-bold">
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const itemsToCart = order.items.map(item => ({
                                                ...item.menuItem,
                                                quantity: item.quantity,
                                                price: item.priceAtSelection
                                            }));
                                            replaceCart(itemsToCart);
                                            navigate('/checkout');
                                        }}
                                        className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1"
                                    >
                                        <Package className="w-3 h-3" /> Order Again
                                    </button>
                                </div>

                                <div className="text-center md:text-right flex items-center gap-6">
                                    <div>
                                        <p className="font-black text-secondary text-xl">₹{order.payableAmount}</p>
                                        <p className={`text-[10px] font-black uppercase ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-amber-500'}`}>
                                            {order.paymentStatus === 'Paid' ? 'Paid' : 'Payment: ' + order.paymentMode}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
