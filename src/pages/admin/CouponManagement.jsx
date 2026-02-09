import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Plus, Trash2, Ticket, X, Save, Edit2, Calendar, DollarSign, Percent, Truck } from 'lucide-react';

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'Percentage',
        discountValue: '',
        minOrderAmount: '',
        maxDiscount: '',
        expiryDate: '',
        usageLimit: 1,
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const { data } = await API.get('/coupons');
            setCoupons(data);
        } catch (err) {
            console.error('Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await API.put(`/coupons/${selectedId}`, formData);
            } else {
                const payload = { ...formData };
                if (payload.discountType === 'Free Delivery') payload.discountValue = 0;
                await API.post('/coupons', payload);
            }
            setShowModal(false);
            fetchCoupons();
            resetForm();
        } catch (err) {
            alert('Error saving coupon');
        }
    };

    const handleEdit = (coupon) => {
        setIsEditing(true);
        setSelectedId(coupon._id);
        setFormData({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderAmount: coupon.minOrderAmount || '',
            maxDiscount: coupon.maxDiscount || '',
            expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
            usageLimit: coupon.usageLimit,
            isActive: coupon.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                await API.delete(`/coupons/${id}`);
                fetchCoupons();
            } catch (err) {
                alert('Error deleting coupon');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discountType: 'Percentage',
            discountValue: '',
            minOrderAmount: '',
            maxDiscount: '',
            expiryDate: '',
            usageLimit: 1,
            isActive: true
        });
        setIsEditing(false);
        setSelectedId(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border shadow-sm">
                <div>
                    <h1 className="text-4xl font-black text-secondary">Coupons</h1>
                    <p className="text-gray-400 font-bold">Manage Customer Discounts</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                    <Plus className="w-6 h-6" /> Create Coupon
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coupons.map(coupon => (
                    <div key={coupon._id} className={`bg-white rounded-[2.5rem] border-2 transition-all p-8 relative group ${coupon.isActive ? 'border-transparent shadow-sm' : 'border-gray-100 opacity-60'}`}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                                <Ticket className="w-8 h-8" />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(coupon)} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><Edit2 className="w-4 h-4 text-secondary" /></button>
                                <button onClick={() => handleDelete(coupon._id)} className="p-2 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-secondary">{coupon.code}</h3>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${coupon.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {coupon.isActive ? 'Active' : 'Disabled'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-primary font-black text-lg">
                                {coupon.discountType === 'Percentage' ? <Percent className="w-5 h-5" /> :
                                    coupon.discountType === 'Flat' ? <DollarSign className="w-5 h-5" /> :
                                        <Truck className="w-5 h-5" />}
                                {coupon.discountType === 'Free Delivery' ? 'Free Delivery' :
                                    `${coupon.discountValue}${coupon.discountType === 'Percentage' ? '%' : ' OFF'}`}
                            </div>

                            <div className="space-y-2 pt-4 border-t border-dashed">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400">Min Order:</span>
                                    <span className="text-secondary">₹{coupon.minOrderAmount || 0}</span>
                                </div>
                                {coupon.expiryDate && (
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-400">Expires:</span>
                                        <span className="text-secondary">{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400">Used:</span>
                                    <span className="text-secondary">{coupon.usageCount} / {coupon.usageLimit}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-secondary/20">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative">
                        <div className="p-10 space-y-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-black text-secondary">{isEditing ? 'Edit Coupon' : 'New Coupon'}</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Coupon Code</label>
                                    <input
                                        type="text"
                                        placeholder="E.g. WELCOME50"
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl font-bold transition-all outline-none mt-2"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                                    <select
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl font-bold transition-all outline-none mt-2"
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                    >
                                        <option value="Percentage">Percentage (%)</option>
                                        <option value="Flat">Flat (₹)</option>
                                        <option value="Free Delivery">Free Delivery</option>
                                    </select>
                                </div>

                                {formData.discountType !== 'Free Delivery' && (
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Value</label>
                                        <input
                                            type="number"
                                            placeholder="Discount Value"
                                            className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl font-bold transition-all outline-none mt-2"
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Min Order</label>
                                    <input
                                        type="number"
                                        placeholder="Min Order Amount"
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl font-bold transition-all outline-none mt-2"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Max Discount (for %)</label>
                                    <input
                                        type="number"
                                        placeholder="Max Discount Amount"
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl font-bold transition-all outline-none mt-2"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl font-bold transition-all outline-none mt-2"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Usage Limit</label>
                                    <input
                                        type="number"
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl font-bold transition-all outline-none mt-2"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2 pt-6">
                                    <button
                                        type="submit"
                                        className="w-full py-6 bg-secondary text-white rounded-[2rem] font-black text-xl hover:bg-primary transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-3"
                                    >
                                        <Save className="w-6 h-6" /> {isEditing ? 'Update Coupon' : 'Create Coupon'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponManagement;
