import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Truck, Plus, CheckCircle2, Loader2, Calendar } from 'lucide-react';

const DispatchManagement = () => {
    const [dispatches, setDispatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [orders, setOrders] = useState([]); // Orders ready for dispatch

    const [formData, setFormData] = useState({
        orderId: '', serviceName: 'Porter', bookingId: '', deliveryCharge: ''
    });

    useEffect(() => {
        fetchDispatches();
        fetchReadyOrders();
    }, []);

    const fetchDispatches = async () => {
        try {
            const { data } = await API.get('/dispatch');
            setDispatches(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchReadyOrders = async () => {
        try {
            const { data } = await API.get('/orders');
            setOrders(data.filter(o => o.orderStatus === 'Packed'));
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/dispatch', formData);
            setShowModal(false);
            fetchDispatches();
            fetchReadyOrders();
        } catch (err) { alert('Dispatch failed'); }
    };

    const handleComplete = async (id) => {
        try {
            await API.put(`/dispatch/${id}/complete`);
            fetchDispatches();
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="py-20 text-center animate-pulse">Loading Dispatch Records...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Dispatch & Logistics</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-secondary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Record Dispatch
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dispatches.map(record => (
                    <div key={record._id} className="p-6 border rounded-3xl bg-white shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <Truck className="w-6 h-6" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${record.completionTime ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                {record.completionTime ? 'Completed' : 'In Transit'}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{record.serviceName} - {record.bookingId}</h3>
                        <p className="text-sm text-gray-500 mb-4">Order #{record.order?.orderId}</p>

                        {!record.completionTime && (
                            <button
                                onClick={() => handleComplete(record._id)}
                                className="w-full bg-green-500 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                Mark Delivered <CheckCircle2 className="w-4 h-4" />
                            </button>
                        )}

                        <div className="mt-4 pt-4 border-t flex justify-between text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(record.dispatchTime).toLocaleTimeString()}</span>
                            <span className="font-bold text-gray-600">Cost: ₹{record.deliveryCharge}</span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 space-y-4">
                        <h3 className="text-2xl font-bold">Dispatch Order</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <select
                                required className="w-full p-3 border rounded-xl bg-white"
                                onChange={e => setFormData({ ...formData, orderId: e.target.value })}
                            >
                                <option value="">Select Packed Order</option>
                                {orders.map(o => <option key={o._id} value={o._id}>#{o.orderId} - {o.user?.name}</option>)}
                            </select>
                            <input
                                required placeholder="Logistic Service (e.g. Porter)" className="w-full p-3 border rounded-xl"
                                value={formData.serviceName} onChange={e => setFormData({ ...formData, serviceName: e.target.value })}
                            />
                            <input
                                required placeholder="Booking ID" className="w-full p-3 border rounded-xl"
                                value={formData.bookingId} onChange={e => setFormData({ ...formData, bookingId: e.target.value })}
                            />
                            <input
                                required placeholder="Delivery Charge (₹)" type="number" className="w-full p-3 border rounded-xl"
                                value={formData.deliveryCharge} onChange={e => setFormData({ ...formData, deliveryCharge: e.target.value })}
                            />
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-grow bg-primary text-white py-3 rounded-xl font-bold">Dispatch</button>
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border rounded-xl font-bold">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DispatchManagement;
