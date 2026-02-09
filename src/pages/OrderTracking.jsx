import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import io from 'socket.io-client';
import { Package, Utensils, Box, Truck, CheckCircle, Clock, MapPin, Star, Send, Loader2 } from 'lucide-react';
import ReviewModal from '../components/ReviewModal';
import { useTheme } from '../context/ThemeContext';

const OrderTracking = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { isDarkMode } = useTheme();

    const steps = [
        { status: 'Pending', icon: Clock, label: 'Order Placed' },
        { status: 'Confirmed', icon: CheckCircle, label: 'Confirmed' },
        { status: 'Preparing', icon: Utensils, label: 'Preparing' },
        { status: 'Packed', icon: Box, label: 'Packed' },
        { status: 'Delivered', icon: Package, label: 'Delivered' }
    ];

    useEffect(() => {
        fetchOrder();
        checkExistingReview();
        // ... (existing socket logic)

        // Socket.io integration
        const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

        socket.on('connect', () => {
            console.log('Connected to socket');
            socket.emit('joinOrderRoom', id);
        });

        socket.on('orderUpdate', (updatedOrder) => {
            if (updatedOrder._id === id) {
                setOrder(updatedOrder);
            }
        });

        return () => socket.disconnect();
    }, [id]);

    const checkExistingReview = async () => {
        try {
            const { data } = await API.get(`/reviews/order/${id}`);
            if (data) {
                setReviewSubmitted(true);
                setRating(data.rating);
                setComment(data.comment);
            }
        } catch (err) {
            // 404 is expected if no review exists yet
            if (err.response?.status !== 404) {
                console.error('Failed to check review', err);
            }
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        try {
            await API.post('/reviews', { orderId: id, rating, comment });
            setReviewSubmitted(true);
            alert('Sukriya! Aapka review humare liye bahut keemti hai. 🙏');
        } catch (err) {
            alert('Review submit karne mein error aayi. Please try again.');
        } finally {
            setReviewLoading(false);
        }
    };

    const fetchOrder = async () => {
        try {
            const { data } = await API.get(`/orders/${id}`);
            setOrder(data);
        } catch (err) {
            console.error('Failed to fetch order', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="py-20 text-center animate-pulse">Fetching Order Details...</div>;
    if (!order) return <div className="py-20 text-center text-red-500">Order not found.</div>;

    const currentStepIndex = steps.findIndex(s => s.status === order.orderStatus);

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-secondary p-8 rounded-[2.5rem] border dark:border-gray-800 shadow-sm transition-colors">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-black mb-2 tracking-tight dark:text-white">Order #{order.orderId}</h1>
                        <p className="text-gray-400 font-medium flex items-center gap-2"><Clock className="w-4 h-4" /> Placed on {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm uppercase">
                        {order.orderStatus}
                    </div>
                </div>

                {/* Cancel Button - Only if Pending */}
                {order.orderStatus === 'Pending' && (
                    <div className="mb-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-red-700 font-bold">Changed your mind?</p>
                            <p className="text-red-500 text-xs font-medium text-wrap">You can cancel this order as long as it's still pending.</p>
                        </div>
                        <button
                            onClick={async () => {
                                if (window.confirm('Kya aap waqai mein order cancel karna chahte hain?')) {
                                    try {
                                        setLoading(true);
                                        await API.put(`/orders/${id}/cancel`);
                                        fetchOrder();
                                    } catch (err) {
                                        alert(err.response?.data?.message || 'Cancellation failed');
                                    } finally {
                                        setLoading(false);
                                    }
                                }
                            }}
                            className="bg-white text-red-600 px-6 py-2 rounded-xl border-2 border-red-200 font-black text-xs hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        >
                            CANCEL ORDER
                        </button>
                    </div>
                )}

                {/* Progress Tracker */}
                <div className="relative flex justify-between items-center mb-12 px-2">
                    {/* Progress Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentStepIndex;
                        const isActive = index === currentStepIndex;

                        return (
                            <div key={step.status} className="relative z-10 flex flex-col items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-primary text-white scale-110' : 'bg-white border-2 border-gray-200 text-gray-300'
                                    } ${isActive ? 'ring-4 ring-primary/20' : ''}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider text-center max-w-[80px] ${isCompleted ? 'text-black' : 'text-gray-300'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <MapPin className="text-primary w-5 h-5" /> Delivery To
                        </h3>
                        <div className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed">
                            <p className="font-bold text-black mb-1">{order.user.name}</p>
                            <p>{order.deliveryAddress.addressLine}</p>
                            <p>{order.deliveryAddress.landmark}, {order.deliveryAddress.zipCode}</p>
                            <p className="mt-2 text-primary font-medium">{order.user.phone}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Package className="text-primary w-5 h-5" /> Items Summary
                        </h3>
                        <div className="space-y-3 bg-gray-50 p-4 rounded-xl text-sm">
                            {order.items.map(item => (
                                <div key={item._id} className="flex justify-between">
                                    <span>{item.quantity}x {item.menuItem?.name || 'Item'}</span>
                                    <span className="font-medium text-black">₹{item.priceAtSelection * item.quantity}</span>
                                </div>
                            ))}
                            <div className="pt-3 border-t flex justify-between font-bold text-base text-black">
                                <span>Total Amount</span>
                                <span>₹{order.payableAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Section (Only if Delivered) */}
            {order.orderStatus === 'Delivered' && (
                <div className="bg-white dark:bg-secondary p-8 rounded-[2.5rem] border dark:border-gray-800 shadow-sm animate-in slide-in-from-bottom duration-700">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl flex items-center justify-center">
                                <Star className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-secondary dark:text-white">
                                    {reviewSubmitted ? 'Thanks for the review!' : 'How was the food?'}
                                </h3>
                                <p className="text-gray-400 font-bold text-sm">
                                    {reviewSubmitted ? 'Your feedback helps us a lot.' : 'Share your experience with others.'}
                                </p>
                            </div>
                        </div>

                        {!reviewSubmitted ? (
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="bg-primary text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-primary/20"
                            >
                                RATE NOW
                            </button>
                        ) : (
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`w-5 h-5 ${rating >= s ? 'text-accent fill-accent' : 'text-gray-200 dark:text-gray-800'}`} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ReviewModal
                isOpen={showReviewModal}
                orderId={id}
                onClose={() => setShowReviewModal(false)}
                onReviewSubmitted={() => {
                    setReviewSubmitted(true);
                    fetchOrder();
                }}
            />
        </div>
    );
};

export default OrderTracking;
