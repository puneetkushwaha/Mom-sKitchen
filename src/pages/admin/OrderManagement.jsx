import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Check, X, Eye, Loader2, Package, MapPin, Phone, Mail, User as UserIcon, XCircle, Clock } from 'lucide-react';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = API.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${path}`;
    };

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchOrders(); // Initial fetch
        const interval = setInterval(() => fetchOrders(true), 2000); // Auto poll every 2 sec
        return () => clearInterval(interval);
    }, [selectedDate]);

    const fetchOrders = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const { data } = await API.get(`/orders?date=${selectedDate}`);
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/orders/${id}/status`, { orderStatus: status });
            // If the modal is open for this order, update local state too
            if (selectedOrder && selectedOrder._id === id) {
                setSelectedOrder({ ...selectedOrder, orderStatus: status });
            }
            fetchOrders();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading && orders.length === 0) return (
        <div className="py-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="font-bold text-gray-500 animate-pulse">Loading Kitchen Orders...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-secondary">Active Orders</h2>
                    <p className="text-gray-400 text-sm font-medium">Manage your kitchen flow and delivery</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group flex-grow md:flex-grow-0">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-gray-50 border border-orange-100 text-secondary text-sm font-black rounded-xl focus:ring-primary focus:border-primary block w-full p-2.5 transition-all outline-none"
                        />
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all border"
                    >
                        <Clock className="w-4 h-4" /> Refresh
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
                            <tr>
                                <th className="p-6">Order ID</th>
                                <th className="p-6">Customer</th>
                                <th className="p-6">Total</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center text-gray-400 font-bold italic">
                                        No active orders found. Try placing one!
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-6 font-black text-secondary text-sm">#{order.orderId}</td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                                    <UserIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-secondary">{order.user?.name || 'Guest'}</p>
                                                    <p className="text-xs text-gray-400 font-bold">{order.user?.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-black text-secondary">₹{order.payableAmount}</p>
                                            <p className={`text-[10px] font-black uppercase ${order.paymentStatus === 'Paid' ? 'text-green-500' : order.paymentStatus === 'Verifying' ? 'text-amber-500' : 'text-red-500'}`}>
                                                {order.paymentStatus === 'Paid' ? 'Paid' : order.paymentStatus === 'Verifying' ? 'Verifying (UTR Submitted)' : 'Unpaid (' + order.paymentMode + ')'}
                                            </p>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${order.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-600' :
                                                order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                                    order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-center gap-2">
                                                {order.orderStatus === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(order._id, 'Confirmed')}
                                                            className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all border border-green-100 shadow-sm"
                                                            title="Accept Order"
                                                        >
                                                            <Check className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(order._id, 'Cancelled')}
                                                            className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all border border-red-100 shadow-sm"
                                                            title="Reject Order"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                                {order.orderStatus === 'Confirmed' && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'Preparing')}
                                                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all border border-blue-100 shadow-sm flex items-center gap-2 font-bold text-xs"
                                                    >
                                                        <Package className="w-5 h-5" /> Start Preparing
                                                    </button>
                                                )}
                                                {order.orderStatus === 'Preparing' && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'Packed')}
                                                        className="p-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all border border-purple-100 shadow-sm flex items-center gap-2 font-bold text-xs"
                                                    >
                                                        <Check className="w-5 h-5" /> Mark Packed
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2.5 bg-gray-50 text-secondary rounded-xl hover:bg-gray-100 transition-all border shadow-sm"
                                                    title="View Full Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-end backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white h-full w-full max-w-xl shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col pt-10">
                        {/* Modal Header */}
                        <div className="p-8 border-b flex justify-between items-start">
                            <div>
                                <h3 className="text-3xl font-black text-secondary mb-1">Order Details</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">ID: #{selectedOrder.orderId}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border"
                            >
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
                            {/* Customer Section */}
                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <UserIcon className="w-4 h-4" /> Customer Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Name</p>
                                        <p className="font-black text-secondary">{selectedOrder.user?.name || 'Guest User'}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Phone</p>
                                        <p className="font-black text-secondary">{selectedOrder.user?.phone}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border col-span-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Email</p>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-300" />
                                            <p className="font-bold text-gray-600">{selectedOrder.user?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Delivery Section */}
                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <MapPin className="w-4 h-4" /> Delivery Address
                                </h4>
                                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                                    <p className="font-black text-secondary leading-relaxed mb-3">
                                        {selectedOrder.deliveryAddress?.addressLine}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-white px-3 py-1 rounded-lg text-[10px] font-black text-secondary border uppercase">
                                            Landmark: {selectedOrder.deliveryAddress?.landmark || 'N/A'}
                                        </span>
                                        <span className="bg-white px-3 py-1 rounded-lg text-[10px] font-black text-secondary border uppercase">
                                            Pincode: {selectedOrder.deliveryAddress?.zipCode || selectedOrder.deliveryAddress?.pincode || 'N/A'}
                                        </span>
                                    </div>
                                    {selectedOrder.deliveryNotes && (
                                        <div className="mt-4 p-4 bg-white/50 rounded-2xl border border-dashed text-sm font-medium text-gray-600 italic">
                                            Note: "{selectedOrder.deliveryNotes}"
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Items Section */}
                            <section className="space-y-4 pb-10">
                                <h4 className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <ShoppingBag className="w-4 h-4" /> Order Items
                                </h4>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-white border rounded-2xl hover:border-primary transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-black text-secondary border overflow-hidden">
                                                    {item.menuItem?.images && item.menuItem.images.length > 0 ? (
                                                        <img src={getImageUrl(item.menuItem.images[0])} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{item.quantity}x</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-secondary">{item.menuItem?.name || 'Loading Item...'}</p>
                                                    <p className="text-xs text-gray-400 font-bold tracking-tight">₹{item.priceAtSelection || item.menuItem?.price} per unit</p>
                                                </div>
                                            </div>
                                            <p className="font-black text-secondary">₹{(item.priceAtSelection || item.menuItem?.price) * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Totals */}
                                <div className="mt-6 p-6 bg-gray-900 rounded-[2rem] text-white space-y-3 shadow-xl">
                                    <div className="flex justify-between text-sm text-gray-400 font-bold">
                                        <span>Order Subtotal</span>
                                        <span>₹{selectedOrder.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400 font-bold pb-3 border-b border-white/10">
                                        <span>Delivery & Taxes</span>
                                        <span>₹{(selectedOrder.deliveryCharge || 0) + (selectedOrder.taxAmount || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-black">
                                        <span>Amount Payable</span>
                                        <span className="text-primary">₹{selectedOrder.payableAmount}</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Modal Footer (Actions) */}
                        <div className="p-8 bg-gray-50 border-t flex gap-4">
                            {selectedOrder.orderStatus === 'Pending' && (
                                <>
                                    <button
                                        onClick={() => updateStatus(selectedOrder._id, 'Confirmed')}
                                        className="flex-grow bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg active:scale-95"
                                    >
                                        <Check className="w-6 h-6" /> Accept Order
                                    </button>
                                    <button
                                        onClick={() => updateStatus(selectedOrder._id, 'Cancelled')}
                                        className="p-4 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition-all border border-red-200"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                            {selectedOrder.orderStatus === 'Confirmed' && (
                                <button
                                    onClick={() => updateStatus(selectedOrder._id, 'Preparing')}
                                    className="flex-grow bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                >
                                    <Package className="w-6 h-6" /> Start Kitchen Prep
                                </button>
                            )}
                            {selectedOrder.orderStatus === 'Preparing' && (
                                <button
                                    onClick={() => updateStatus(selectedOrder._id, 'Packed')}
                                    className="flex-grow bg-purple-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                                >
                                    <Check className="w-6 h-6" /> Ready for Delivery
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ShoppingBag = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
);

export default OrderManagement;
