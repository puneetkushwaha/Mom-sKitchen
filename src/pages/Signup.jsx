import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Phone, Loader2 } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login: saveAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/signup', formData);
            saveAuth(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2rem] border shadow-2xl">
            <h2 className="text-4xl font-black mb-2 text-center text-secondary">Join Us!</h2>
            <p className="text-gray-400 text-center mb-10 font-medium">Create your cloud kitchen account</p>

            {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest pl-1">Full Name</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                        <input
                            type="text" required placeholder="John Doe"
                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl outline-none transition-all font-bold"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest pl-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                        <input
                            type="email" required placeholder="john@example.com"
                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl outline-none transition-all font-bold"
                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest pl-1">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                        <input
                            type="tel" required placeholder="9988776655"
                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl outline-none transition-all font-bold"
                            value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest pl-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                        <input
                            type="password" required placeholder="••••••••"
                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl outline-none transition-all font-bold"
                            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit" disabled={loading}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-primary/30 transition-all flex justify-center items-center gap-3 active:scale-95"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Register Now'}
                </button>
            </form>

            <p className="mt-8 text-center text-gray-500 font-bold">
                Already have an account? <Link to="/login" className="text-primary hover:underline">Login here</Link>
            </p>
        </div>
    );
};

export default Signup;
