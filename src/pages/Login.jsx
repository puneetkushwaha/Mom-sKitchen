import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login: saveAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/login', { email, password });
            saveAuth(data);
            if (data.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] border-2 border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-secondary">Welcome Back!</h2>
                <p className="text-gray-400 font-medium mt-2">Log in to your cloud kitchen account</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-xs font-black border border-red-100 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-7">
                <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <input
                            type="email" required placeholder="puneet@example.com"
                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[1.2rem] outline-none transition-all font-bold placeholder:text-gray-300"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <input
                            type="password" required placeholder="••••••••"
                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[1.2rem] outline-none transition-all font-bold placeholder:text-gray-300"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit" disabled={loading}
                    className="w-full bg-secondary text-white py-5 rounded-[1.2rem] font-black text-lg hover:bg-black transition-all flex justify-center items-center gap-3 active:scale-[0.98] group shadow-lg shadow-gray-200"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <>Login to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                    )}
                </button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                <p className="text-gray-500 font-bold">
                    Don't have an account? <Link to="/signup" className="text-primary hover:underline">Register now</Link>
                </p>
                <p className="text-[10px] text-gray-300 mt-6 italic">
                    Admin switch automated for puneetkushwaha88@gmail.com
                </p>
            </div>
        </div>
    );
};

export default Login;
