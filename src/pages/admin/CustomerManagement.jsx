import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Users, Search, ShoppingBag, IndianRupee, Calendar, Loader2, X, MapPin, Phone, Mail, Clock, ChevronRight } from 'lucide-react';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const { data } = await API.get('/admin/users');
            setCustomers(data);
        } catch (err) {
            console.error('Failed to fetch customers', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerDetails = async (id) => {
        setDetailsLoading(true);
        setSelectedCustomerId(id);
        try {
            const { data } = await API.get(`/admin/users/${id}`);
            setCustomerDetails(data);
        } catch (err) {
            console.error('Failed to fetch details', err);
        } finally {
            setDetailsLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    if (loading) return (
        <div className="py-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="font-bold text-gray-500">Loading Customer CRM...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center shadow-inner">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-secondary tracking-tight">Customer CRM</h2>
                        <p className="text-gray-400 font-bold text-sm">Track lifetime value and loyalty</p>
                    </div>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Customers', value: customers.length, icon: Users, color: 'bg-blue-500' },
                    { label: 'Avg Bucket Value', value: `₹${(customers.reduce((acc, c) => acc + (c.lifetimeValue || 0), 0) / (customers.length || 1)).toFixed(0)}`, icon: IndianRupee, color: 'bg-emerald-500' },
                    { label: 'Top Loyalists', value: customers.filter(c => c.totalOrders >= 5).length, icon: ShoppingBag, color: 'bg-amber-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border shadow-sm flex items-center gap-5 hover:shadow-lg transition-all cursor-default group">
                        <div className={`${stat.color} p-4 rounded-2xl text-white shadow-xl shadow-black/10 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                            <p className="text-2xl font-black text-secondary tracking-tighter">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white border rounded-[3rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-bottom">
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">Customer Info</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">Orders</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">Lifetime Value</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">Joined On</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredCustomers.map((user) => (
                                <tr
                                    key={user._id}
                                    onClick={() => fetchCustomerDetails(user._id)}
                                    className="hover:bg-gray-50/50 transition-all cursor-pointer group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-secondary group-hover:bg-primary group-hover:text-white transition-all capitalize">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-secondary leading-none mb-1">{user.name}</p>
                                                <p className="text-sm font-bold text-gray-400">{user.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-secondary">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs">
                                                {user.totalOrders || 0}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-lg font-black text-emerald-600">₹{user.lifetimeValue || 0}</span>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${(user.lifetimeValue || 0) > 2000 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {(user.lifetimeValue || 0) > 2000 ? 'VIP Member' : 'Regular'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredCustomers.length === 0 && (
                    <div className="py-20 text-center text-gray-300 font-bold italic">
                        No customers found matching your search.
                    </div>
                )}
            </div>

            {/* Customer Detail Modal */}
            {selectedCustomerId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-2xl h-full bg-white shadow-2xl animate-slide-left overflow-y-auto">
                        {detailsLoading ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                <p className="font-bold text-gray-400">Fetching profile...</p>
                            </div>
                        ) : customerDetails ? (
                            <div className="p-10 space-y-10">
                                {/* Modal Header */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-primary text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/20 capitalize">
                                            {customerDetails.user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-secondary">{customerDetails.user.name}</h3>
                                            <p className="text-gray-400 font-bold">Customer since {new Date(customerDetails.user.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCustomerId(null)}
                                        className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                                        <p className="text-[10px] font-black uppercase text-orange-400 tracking-widest mb-1">Lifetime Value</p>
                                        <p className="text-3xl font-black text-secondary">₹{customerDetails.user.lifetimeValue || 0}</p>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                                        <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Total Orders</p>
                                        <p className="text-3xl font-black text-secondary">{customerDetails.user.totalOrders || 0}</p>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Contact Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <span className="font-bold text-secondary">{customerDetails.user.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <span className="font-bold text-secondary">{customerDetails.user.email || 'No email provided'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Addresses */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Saved Addresses</h4>
                                    <div className="space-y-3">
                                        {customerDetails.user.addresses?.length > 0 ? (
                                            customerDetails.user.addresses.map((addr, i) => (
                                                <div key={i} className="p-5 border-2 border-gray-50 rounded-2xl flex items-start gap-4">
                                                    <MapPin className="w-5 h-5 text-primary mt-1" />
                                                    <div>
                                                        <p className="font-black text-secondary text-sm mb-1">{addr.label} {addr.isDefault && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Default</span>}</p>
                                                        <p className="text-sm text-gray-400 font-bold leading-relaxed">{addr.addressLine}, {addr.landmark && `${addr.landmark}, `}{addr.zipCode}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm font-bold text-gray-300 italic">No addresses saved yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Order History */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Order History</h4>
                                    <div className="space-y-3">
                                        {customerDetails.orders?.length > 0 ? (
                                            customerDetails.orders.map((order) => (
                                                <div key={order._id} className="p-5 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-gray-100 rounded-3xl transition-all group">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                                <Clock className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-secondary text-sm">#{order._id.slice(-6).toUpperCase()}</p>
                                                                <p className="text-xs font-bold text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-black text-secondary">₹{order.payableAmount}</p>
                                                            <p className={`text-[10px] font-black uppercase tracking-widest ${order.orderStatus === 'Delivered' ? 'text-emerald-500' :
                                                                    order.orderStatus === 'Cancelled' ? 'text-red-500' : 'text-amber-500'
                                                                }`}>{order.orderStatus}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm font-bold text-gray-300 italic">No orders found.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center gap-4">
                                <p className="font-bold text-red-400">Failed to load customer details.</p>
                                <button onClick={() => setSelectedCustomerId(null)} className="text-primary font-bold">Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerManagement;
