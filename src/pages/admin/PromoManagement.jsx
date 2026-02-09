import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Plus, Trash2, Edit2, ShieldCheck, X, Image as ImageIcon, Loader2, Save } from 'lucide-react';

const PromoManagement = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        imageUrl: '',
        link: '/menu',
        order: 0,
        isActive: true
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const { data } = await API.get('/promo');
            setBanners(data);
        } catch (err) {
            console.error('Failed to fetch banners');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await API.put(`/promo/${selectedId}`, formData);
            } else {
                await API.post('/promo', formData);
            }
            setShowModal(false);
            fetchBanners();
            resetForm();
        } catch (err) {
            alert('Error saving banner');
        }
    };

    const handleEdit = (banner) => {
        setIsEditing(true);
        setSelectedId(banner._id);
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle,
            imageUrl: banner.imageUrl,
            link: banner.link,
            order: banner.order,
            isActive: banner.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await API.delete(`/promo/${id}`);
                fetchBanners();
            } catch (err) {
                alert('Error deleting banner');
            }
        }
    };

    const resetForm = () => {
        setFormData({ title: '', subtitle: '', imageUrl: '', link: '/menu', order: 0, isActive: true });
        setIsEditing(false);
        setSelectedId(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border shadow-sm">
                <div>
                    <h1 className="text-4xl font-black text-secondary">Promo Banners</h1>
                    <p className="text-gray-400 font-bold">Manage Home Page Highlights</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                    <Plus className="w-6 h-6" /> Create Banner
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {banners.map(banner => (
                    <div key={banner._id} className={`bg-white rounded-[2.5rem] border-2 transition-all overflow-hidden group ${banner.isActive ? 'border-transparent shadow-sm' : 'border-gray-100 opacity-60'}`}>
                        <div className="h-48 bg-gray-50 relative">
                            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button onClick={() => handleEdit(banner)} className="p-3 bg-white text-secondary rounded-xl hover:bg-primary hover:text-white transition-all"><Edit2 className="w-5 h-5" /></button>
                                <button onClick={() => handleDelete(banner._id)} className="p-3 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                            </div>
                            {!banner.isActive && (
                                <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">Inactive</div>
                            )}
                        </div>
                        <div className="p-6 space-y-2">
                            <h3 className="font-black text-secondary text-xl">{banner.title}</h3>
                            <p className="text-gray-400 font-bold text-sm">{banner.subtitle}</p>
                            <div className="pt-4 flex justify-between items-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                <span>Order: {banner.order}</span>
                                <span>{banner.link}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-secondary/20 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-black text-secondary">{isEditing ? 'Edit Banner' : 'New Banner'}</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Banner Title (e.g. 30% Off Home Style!)"
                                        className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl font-bold transition-all outline-none"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subtitle (Short Catchy Line)"
                                        className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl font-bold transition-all outline-none"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Image URL (Unsplash or direct link)"
                                        className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl font-bold transition-all outline-none"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Link Override (/menu)"
                                            className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl font-bold transition-all outline-none"
                                            value={formData.link}
                                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Display Order"
                                            className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl font-bold transition-all outline-none"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border-2 border-transparent">
                                        <label className="flex-grow font-black text-gray-400 uppercase text-xs">Banner Visibility</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                            className={`px-6 py-2 rounded-xl font-black text-xs transition-all ${formData.isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-200 text-gray-500'}`}
                                        >
                                            {formData.isActive ? 'ACTIVE' : 'DISABLED'}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-6 bg-secondary text-white rounded-[2rem] font-black text-xl hover:bg-primary transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-3"
                                >
                                    <Save className="w-6 h-6" /> {isEditing ? 'Update Banner' : 'Publish Banner'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoManagement;
