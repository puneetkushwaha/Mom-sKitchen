import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Save, Loader2, Clock, MapPin, DollarSign, Percent, Phone, Home } from 'lucide-react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        kitchenName: '',
        timings: { open: '', close: '' },
        deliveryRadius: 0,
        baseDeliveryCharge: 0,
        freeDeliveryAbove: 0,
        taxPercentage: 0,
        contactPhone: '',
        address: '',
        upiId: '',
        isHolidayMode: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await API.get('/admin/settings');
            setSettings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await API.put('/admin/settings', settings);
            alert('Settings updated successfully');
        } catch (err) {
            alert('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="py-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="font-bold text-gray-500 animate-pulse">Loading Kitchen Configuration...</p>
        </div>
    );

    return (
        <form onSubmit={handleSave} className="space-y-8 max-w-5xl pb-24">
            {/* Header / Kitchen Power */}
            <div className="bg-white p-10 rounded-[3rem] border shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-primary/10" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full animate-pulse ${settings.isHolidayMode ? 'bg-red-500' : 'bg-emerald-500'}`} />
                            <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase">Kitchen Control</h2>
                        </div>
                        <p className="text-gray-400 font-bold max-w-sm leading-tight italic">
                            {settings.isHolidayMode
                                ? "KITCHEN IS CURRENTLY OFFLINE. No orders will be accepted."
                                : "KITCHEN IS ONLINE. Accepting orders based on schedule."}
                        </p>
                    </div>

                    <div className="flex items-center gap-8 bg-gray-50 p-6 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <div className="text-right">
                            <span className="block text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Power Status</span>
                            <span className={`text-2xl font-black uppercase tracking-tighter ${settings.isHolidayMode ? 'text-red-500' : 'text-emerald-500'}`}>
                                {settings.isHolidayMode ? 'OFFLINE' : 'ONLINE'}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={async () => {
                                const newMode = !settings.isHolidayMode;
                                setSettings({ ...settings, isHolidayMode: newMode });
                                try {
                                    await API.put('/admin/settings', { ...settings, isHolidayMode: newMode });
                                    // No alert here for better UX, the UI change is feedback enough
                                } catch (e) {
                                    alert('Failed to update kitchen status');
                                    setSettings({ ...settings, isHolidayMode: !newMode }); // Revert
                                }
                            }}
                            className={`w-20 h-10 rounded-full p-1.5 transition-all shadow-lg ring-4 ring-offset-2 ${settings.isHolidayMode ? 'bg-red-500 ring-red-100' : 'bg-emerald-500 ring-emerald-100'
                                }`}
                        >
                            <div className={`w-7 h-7 bg-white rounded-full shadow-xl transition-all duration-300 transform ${settings.isHolidayMode ? 'translate-x-10' : 'translate-x-0'
                                }`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Branding & Contact */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Home className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="text-lg font-black text-secondary tracking-tight">BRANDING & SUPPORT</h4>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 ml-1 uppercase flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full" /> Kitchen Name
                            </label>
                            <input
                                className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl font-black text-secondary focus:border-primary focus:bg-white transition-all outline-none text-lg"
                                value={settings.kitchenName}
                                onChange={e => setSettings({ ...settings, kitchenName: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 ml-1 uppercase flex items-center gap-2">
                                    <span className="w-1 h-1 bg-primary rounded-full" /> Customer Support
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-5 w-5 h-5 text-gray-300" />
                                    <input
                                        className="w-full pl-12 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-2xl font-black text-secondary focus:border-primary focus:bg-white transition-all outline-none"
                                        value={settings.contactPhone}
                                        onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-red-500 ml-1 uppercase flex items-center gap-2">
                                    <span className="w-1 h-1 bg-red-500 rounded-full" /> Admin WhatsApp
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-5 w-5 h-5 text-red-300" />
                                    <input
                                        className="w-full pl-12 pr-4 py-5 bg-red-50 border-2 border-transparent rounded-2xl font-black text-red-600 focus:border-red-200 focus:bg-white transition-all outline-none"
                                        placeholder="+91999..."
                                        value={settings.adminPhone || ''}
                                        onChange={e => setSettings({ ...settings, adminPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logistics & Timings */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b">
                        <div className="p-3 bg-indigo-100 rounded-2xl">
                            <Clock className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h4 className="text-lg font-black text-secondary tracking-tight">TIMINGS & LOGISTICS</h4>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 ml-1 uppercase">Opening Time</label>
                                <input
                                    placeholder="09:00 AM" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl font-black text-center focus:border-primary focus:bg-white transition-all outline-none text-xl"
                                    value={settings.timings?.open || ''}
                                    onChange={e => setSettings({ ...settings, timings: { ...(settings.timings || {}), open: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 ml-1 uppercase">Closing Time</label>
                                <input
                                    placeholder="11:00 PM" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl font-black text-center focus:border-primary focus:bg-white transition-all outline-none text-xl"
                                    value={settings.timings?.close || ''}
                                    onChange={e => setSettings({ ...settings, timings: { ...(settings.timings || {}), close: e.target.value } })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
                                <span className="block text-[8px] font-black uppercase text-emerald-400 tracking-widest mb-1">Max Radius (KM)</span>
                                <input
                                    type="number" className="w-full bg-transparent text-2xl font-black text-emerald-700 text-center outline-none"
                                    value={settings.deliveryRadius}
                                    onChange={e => setSettings({ ...settings, deliveryRadius: Number(e.target.value) })}
                                />
                            </div>
                            <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 text-center">
                                <span className="block text-[8px] font-black uppercase text-blue-400 tracking-widest mb-1">Base Delivery (₹)</span>
                                <input
                                    type="number" className="w-full bg-transparent text-2xl font-black text-blue-700 text-center outline-none"
                                    value={settings.baseDeliveryCharge}
                                    onChange={e => setSettings({ ...settings, baseDeliveryCharge: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-xl shadow-sm"><DollarSign className="w-4 h-4 text-indigo-600" /></div>
                                <span className="text-xs font-black text-indigo-700 uppercase tracking-tight">Payments UPI</span>
                            </div>
                            <input
                                className="bg-transparent text-right font-black text-indigo-600 outline-none"
                                value={settings.upiId}
                                onChange={e => setSettings({ ...settings, upiId: e.target.value })}
                                placeholder="example@upi"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button
                    type="submit" disabled={saving}
                    className="group relative bg-secondary text-white px-16 py-6 rounded-[2rem] font-black flex items-center gap-4 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 shadow-2xl text-xl overflow-hidden"
                >
                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    {saving ? <Loader2 className="animate-spin w-6 h-6" /> : <><Save className="w-6 h-6" /> SAVE CONFIGURATION</>}
                </button>
            </div>
        </form>
    );
};

const AlertCircle = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
);

export default AdminSettings;
