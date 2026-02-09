import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
    LayoutDashboard, Utensils, ShoppingBag, Truck,
    TrendingUp, Users, Settings, LogOut, Loader2,
    DollarSign, Clock, AlertCircle, Image as ImageIcon, Ticket
} from 'lucide-react';
import Overview from './admin/Overview';
import OrderManagement from './admin/OrderManagement';
import MenuManagement from './admin/MenuManagement';
import DispatchManagement from './admin/DispatchManagement';

import AdminSettings from './admin/AdminSettings';
import CustomerManagement from './admin/CustomerManagement';
import PromoManagement from './admin/PromoManagement';
import CouponManagement from './admin/CouponManagement';

import io from 'socket.io-client';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();

        const socket = io(import.meta.env.VITE_SOCKET_URL || 'https://mom-skitchen-backend.onrender.com');

        socket.on('connect', () => {
            console.log('[AdminDashboard] Connected to Socket.io server:', socket.id);
        });

        socket.on('connect_error', (err) => {
            console.error('[AdminDashboard] Socket Connection Error:', err);
        });

        socket.on('newOrder', (newOrder) => {
            console.log('[AdminDashboard] New Order Event Received:', newOrder);
            playNotificationSound();
            alert(`New Order Received! #${newOrder._id.slice(-6).toUpperCase()}`);
            fetchStats();
        });

        return () => socket.disconnect();
    }, []);

    const playNotificationSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.error('Audio play failed (check browser permissions):', e));
    };

    const fetchStats = async () => {
        try {
            const { data } = await API.get('/admin/analytics');
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch analytics', err);
        } finally {
            setLoading(false);
        }
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'menu', label: 'Menu', icon: Utensils },
        { id: 'dispatch', label: 'Dispatch', icon: Truck },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'promos', label: 'Promos', icon: ImageIcon },
        { id: 'coupons', label: 'Coupons', icon: Ticket },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mt-6 md:mt-10 pb-24 lg:pb-0">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 space-y-2 sticky top-24 self-start h-[calc(100vh-120px)] overflow-y-auto pr-2 scrollbar-hide">
                <div className="p-6 bg-secondary text-white rounded-3xl mb-8">
                    <p className="text-gray-400 text-sm">Welcome back,</p>
                    <h2 className="font-bold text-xl">Kitchen Owner</h2>
                    <button
                        onClick={() => playNotificationSound()}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded mt-2 w-full text-left flex items-center gap-2"
                    >
                        🔊 Test Sound
                    </button>
                </div>

                <div className="space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }}
                    className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 mt-10 transition-colors"
                >
                    <LogOut className="w-5 h-5" /> Logout
                </button>
            </aside>

            {/* Mobile/Tablet Bottom Navigation */}
            <nav className="fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl border border-orange-100 px-2 py-2 z-[70] lg:hidden shadow-2xl rounded-[2rem] animate-fade-in">
                <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center gap-1 min-w-[64px] py-2 transition-all rounded-2xl ${activeTab === item.id
                                ? 'text-primary bg-primary/5'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <item.icon className="w-5 h-5 transition-transform active:scale-110" />
                            <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
                        </button>
                    ))}
                    <div className="w-[1px] h-8 bg-gray-100 mx-1 flex-shrink-0" />
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }}
                        className="flex flex-col items-center gap-1 min-w-[64px] py-2 text-red-400 hover:text-red-500 rounded-2xl"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow min-h-[600px] bg-white rounded-3xl border p-4 md:p-8">
                {activeTab === 'overview' && <Overview stats={stats} loading={loading} />}
                {activeTab === 'orders' && <OrderManagement />}
                {activeTab === 'menu' && <MenuManagement />}
                {activeTab === 'dispatch' && <DispatchManagement />}
                {activeTab === 'customers' && <CustomerManagement />}
                {activeTab === 'promos' && <PromoManagement />}
                {activeTab === 'coupons' && <CouponManagement />}
                {activeTab === 'settings' && <AdminSettings />}
            </main>
        </div>
    );
};

export default AdminDashboard;
