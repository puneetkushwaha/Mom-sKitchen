import React, { useState, useEffect, useRef } from 'react';
import API from '../../services/api';
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon, X, Upload, ChevronLeft, ChevronRight, Star, Clock, Check, ShoppingBag } from 'lucide-react';

const MenuManagement = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '', price: '', category: '', description: '', isVeg: true, isBestSeller: false, isTodaySpecial: false, isCombo: false
    });

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = API.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${path}`;
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const { data } = await API.get('/menu');
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            price: item.price,
            category: item.category,
            description: item.description,
            isVeg: item.isVeg,
            isBestSeller: item.isBestSeller || false,
            isTodaySpecial: item.isTodaySpecial || false,
            isCombo: item.isCombo || false
        });
        setSelectedId(item._id);
        const existingPreviews = (item.images || []).map(img => getImageUrl(img));
        setImagePreviews(existingPreviews);
        setImageFiles([]); // Reset files, we'll only send new ones if selected
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await API.delete(`/menu/${id}`);
            fetchMenu();
        } catch (err) {
            alert('Failed to delete item');
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newFiles = [...imageFiles, ...files].slice(0, 5); // Limit to 5
            setImageFiles(newFiles);

            const newPreviews = [];
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result].slice(0, 5));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removePreview = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', Number(formData.price));
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('isVeg', formData.isVeg === true || formData.isVeg === 'true');
        data.append('isBestSeller', formData.isBestSeller === true || formData.isBestSeller === 'true');
        data.append('isTodaySpecial', formData.isTodaySpecial === true || formData.isTodaySpecial === 'true');
        data.append('isCombo', formData.isCombo === true || formData.isCombo === 'true');

        imageFiles.forEach(file => {
            data.append('images', file);
        });

        try {
            if (isEditing) {
                await API.put(`/menu/${selectedId}`, data);
            } else {
                await API.post('/menu', data);
            }
            setShowModal(false);
            resetForm();
            fetchMenu();
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to save item';
            alert('Error: ' + msg);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', price: '', category: '', description: '', isVeg: true });
        setImageFiles([]);
        setImagePreviews([]);
        setIsEditing(false);
        setSelectedId(null);
    };

    if (loading) return (
        <div className="py-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="font-bold text-gray-500">Syncing Menu Items...</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-secondary">Menu Inventory</h2>
                    <p className="text-gray-400 text-sm font-medium">Manage your dishes and pricing</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-primary text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" /> Add Dish
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item._id} className="p-6 border rounded-[2rem] flex gap-5 bg-white hover:border-primary transition-all group relative overflow-hidden">
                        <div className="w-24 h-24 bg-gray-50 rounded-[1.5rem] flex-shrink-0 flex items-center justify-center text-gray-300 relative overflow-hidden border border-dashed">
                            {item.images && item.images.length > 0 ? (
                                <img src={getImageUrl(item.images[0])} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-8 h-8" />
                            )}
                            <div className={`absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-white ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                            {item.images?.length > 1 && (
                                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1.5 rounded-md font-black">
                                    +{item.images.length - 1}
                                </div>
                            )}
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                            <div>
                                <h3 className="font-black text-secondary group-hover:text-primary transition-colors">{item.name}</h3>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">{item.category}</p>
                                <p className="text-lg font-black text-secondary mt-1">₹{item.price}</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="flex-grow text-[10px] py-2 bg-gray-50 text-gray-600 rounded-xl font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-[10px] p-2 bg-red-50 text-red-500 rounded-xl font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-[3rem] text-gray-300">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p className="font-black italic">Kitchen is empty. Add your first dish!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-secondary/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all z-10">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-2xl md:text-3xl font-black text-secondary">{isEditing ? 'Update Dish' : 'New Dish'}</h3>
                            <p className="text-gray-400 font-bold text-sm">Configure your signature recipe</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-grow pb-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Dish Name</label>
                                <input
                                    required placeholder="Paneer Butter Masala" className="w-full p-4 bg-gray-50 border rounded-2xl font-bold focus:bg-white transition-all outline-none focus:ring-2 focus:ring-primary/10"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Price (₹)</label>
                                    <input
                                        required placeholder="299" type="number" className="w-full p-4 bg-gray-50 border rounded-2xl font-bold focus:bg-white transition-all outline-none focus:ring-2 focus:ring-primary/10"
                                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Category</label>
                                    <select
                                        className="w-full p-4 bg-gray-50 border rounded-2xl font-bold focus:bg-white transition-all appearance-none outline-none focus:ring-2 focus:ring-primary/10"
                                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value="Main Course">Main Course</option>
                                        <option value="Starters">Starters</option>
                                        <option value="Beverages">Beverages</option>
                                        <option value="Desserts">Desserts</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tags Section */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isBestSeller: !formData.isBestSeller })}
                                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.isBestSeller ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-50 bg-gray-50 text-gray-400 opacity-60'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Star className={`w-4 h-4 ${formData.isBestSeller ? 'fill-current' : ''}`} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Best Seller</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.isBestSeller ? 'border-amber-400 bg-amber-400' : 'border-gray-200'}`}>
                                        {formData.isBestSeller && <Check className="w-2 h-2 text-white" />}
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isTodaySpecial: !formData.isTodaySpecial })}
                                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.isTodaySpecial ? 'border-primary bg-red-50 text-primary' : 'border-gray-50 bg-gray-50 text-gray-400 opacity-60'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Today's Special</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.isTodaySpecial ? 'border-primary bg-primary' : 'border-gray-200'}`}>
                                        {formData.isTodaySpecial && <Check className="w-2 h-2 text-white" />}
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isCombo: !formData.isCombo })}
                                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.isCombo ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-50 bg-gray-50 text-gray-400 opacity-60'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Combo Meal</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.isCombo ? 'border-blue-500 bg-blue-500' : 'border-gray-200'}`}>
                                        {formData.isCombo && <Check className="w-2 h-2 text-white" />}
                                    </div>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Meal Type</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isVeg: true })}
                                            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${formData.isVeg ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-50 bg-gray-50 text-gray-400 opacity-60'}`}
                                        >Veg</button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isVeg: false })}
                                            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${!formData.isVeg ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-50 bg-gray-50 text-gray-400 opacity-60'}`}
                                        >Non-Veg</button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Dish Images (Max 5)</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="aspect-square relative rounded-2xl overflow-hidden border group">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePreview(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {imagePreviews.length < 5 && (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square bg-gray-50 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all text-gray-300"
                                        >
                                            <Upload className="w-6 h-6 mb-1" />
                                            <span className="text-[8px] font-black uppercase">Add Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description</label>
                                <textarea
                                    required
                                    placeholder="Tell us about this delicious item..." className="w-full p-4 bg-gray-50 border rounded-2xl h-32 font-medium focus:bg-white transition-all resize-none outline-none focus:ring-2 focus:ring-primary/10"
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-2xl">
                                <label className="text-sm font-black text-secondary">Type:</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isVeg: true })}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${formData.isVeg ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-200' : 'bg-white text-gray-400'}`}
                                    >
                                        Veg
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isVeg: false })}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${!formData.isVeg ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-200' : 'bg-white text-gray-400'}`}
                                    >
                                        Non-Veg
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="pt-4 border-t mt-auto">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all"
                            >
                                {isEditing ? 'Confirm Changes' : 'Add to Menu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManagement;
