import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { isStoreOpen } from '../utils/timeHelper';
import { MapPin, CreditCard, Ticket, CheckCircle2, Loader2, Plus, Home, Briefcase, Map as MapIcon, ChevronRight } from 'lucide-react';
import MapPicker from '../components/MapPicker';

const Checkout = () => {
    const { cartItems, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        addressLine: '',
        landmark: '',
        zipCode: ''
    });
    const [paymentMode, setPaymentMode] = useState('UPI');
    const [transactionId, setTransactionId] = useState('');
    const [showUpiModal, setShowUpiModal] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState({ amount: 0, code: '', isFreeDelivery: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [upiDetails, setUpiDetails] = useState('7380663685@airtel');
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [businessRules, setBusinessRules] = useState({
        taxPercentage: 5,
        baseDeliveryCharge: 40,
        freeDeliveryAbove: 500
    });

    const [activeCoupons, setActiveCoupons] = useState([]);
    const [showCoupons, setShowCoupons] = useState(false);

    useEffect(() => {
        const fetchCheckoutData = async () => {
            try {
                const [settingsRes, couponsRes, addressRes] = await Promise.all([
                    API.get('/public/settings'),
                    API.get('/coupons/active'),
                    user ? API.get('/users/address') : Promise.resolve({ data: [] })
                ]);
                if (settingsRes.data?.upiId) setUpiDetails(settingsRes.data.upiId);
                if (settingsRes.data) {
                    setBusinessRules({
                        taxPercentage: settingsRes.data.taxPercentage || 5,
                        baseDeliveryCharge: settingsRes.data.baseDeliveryCharge || 40,
                        freeDeliveryAbove: settingsRes.data.freeDeliveryAbove || 500
                    });
                }
                setActiveCoupons(couponsRes.data);
                setSavedAddresses(addressRes.data);
                if (addressRes.data.length > 0) {
                    const def = addressRes.data.find(a => a.isDefault) || addressRes.data[0];
                    setSelectedAddressId(def._id);
                    setAddress({
                        addressLine: def.addressLine,
                        landmark: def.landmark,
                        zipCode: def.zipCode
                    });
                }
            } catch (e) {
                console.log('Failed to fetch checkout data');
            }
        };
        fetchCheckoutData();
    }, []);

    const deliveryCharge = subtotal > businessRules.freeDeliveryAbove ? 0 : businessRules.baseDeliveryCharge;
    const tax = Math.round(subtotal * (businessRules.taxPercentage / 100));
    const activeDeliveryCharge = discount.isFreeDelivery ? 0 : deliveryCharge;
    const payableAmount = subtotal + activeDeliveryCharge + tax - discount.amount;

    const handleApplyCoupon = async () => {
        try {
            const { data } = await API.post('/coupons/apply', { code: couponCode.toUpperCase().trim(), orderAmount: subtotal });
            setDiscount({
                amount: data.discountAmount,
                code: data.code,
                isFreeDelivery: data.isFreeDelivery
            });
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Coupon');
            setDiscount({ amount: 0, code: '', isFreeDelivery: false });
        }
    };

    const handleRazorpay = async (orderId, amount) => {
        try {
            const { data: orderData } = await API.post('/payments/create-order', {
                orderId,
                amount
            });

            const options = {
                key: orderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Cloud Kitchen",
                description: "Premium Food Delivery",
                order_id: orderData.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await API.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            db_order_id: orderId
                        });

                        if (verifyRes.data.success) {
                            clearCart();
                            navigate(`/track/${orderId}`);
                        }
                    } catch (err) {
                        setError("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone
                },
                theme: {
                    color: "#ef4444"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError("Razorpay initialization failed");
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!address.addressLine || !address.zipCode) {
            setError('Please fill delivery address');
            return;
        }

        setLoading(true);
        try {
            // Check if store is open
            const { data: settings } = await API.get('/public/settings');
            if (!isStoreOpen(settings)) {
                setError('Sorry, the kitchen just closed. We cannot accept new orders right now.');
                setLoading(false);
                return;
            }

            const orderPayload = {
                orderItems: cartItems.map(i => ({ menuItem: i._id, quantity: i.quantity })),
                deliveryAddress: address,
                paymentMode,
                totalAmount: subtotal,
                deliveryCharge: activeDeliveryCharge,
                taxAmount: tax,
                payableAmount,
                couponCode: discount.code // Pass coupon code for backend tracking
            };

            const { data: order } = await API.post('/orders', orderPayload);
            setCreatedOrder(order);

            if (paymentMode === 'UPI') {
                setError('');
                setShowUpiModal(true);
                setLoading(false);
            } else if (paymentMode === 'Online') {
                handleRazorpay(order._id, payableAmount);
            } else {
                clearCart();
                navigate(`/track/${order._id}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Order failed');
            setLoading(false);
        }
    };

    const handleVerifyUpi = async () => {
        if (!transactionId) {
            setError('Please enter Transaction ID / UTR');
            return;
        }
        setLoading(true);
        try {
            await API.post('/payments/verify-manual', {
                orderId: createdOrder._id,
                transactionId
            });
            clearCart();
            navigate(`/track/${createdOrder._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Contact support.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 py-10">
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Checkout</h1>

                {/* Address */}
                <div className="bg-white p-6 rounded-2xl border space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 text-xl font-bold">
                            <MapPin className="text-primary" /> Delivery Address
                        </div>
                        {user && (
                            <button
                                onClick={() => setShowMap(!showMap)}
                                className="text-xs font-black uppercase text-primary flex items-center gap-1 hover:underline"
                            >
                                <Plus className="w-3 h-3" /> Add New
                            </button>
                        )}
                    </div>

                    {showMap ? (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <MapPicker onSelectLocation={(loc) => {
                                setAddress({ ...address, addressLine: loc.address });
                            }} />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text" placeholder="Landmark"
                                    className="p-3 border rounded-xl"
                                    value={address.landmark}
                                    onChange={e => setAddress({ ...address, landmark: e.target.value })}
                                />
                                <input
                                    type="text" placeholder="Pincode"
                                    className="p-3 border rounded-xl"
                                    value={address.zipCode}
                                    onChange={e => setAddress({ ...address, zipCode: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={async () => {
                                        try {
                                            const { data } = await API.post('/users/address', { ...address, label: 'Home' });
                                            setSavedAddresses(data);
                                            setShowMap(false);
                                        } catch (e) { alert('Failed to save'); }
                                    }}
                                    className="flex-grow bg-secondary text-white py-3 rounded-xl font-bold"
                                >
                                    Save Address
                                </button>
                                <button onClick={() => setShowMap(false)} className="bg-gray-100 px-6 rounded-xl font-bold italic">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {savedAddresses.map(addr => (
                                <div
                                    key={addr._id}
                                    onClick={() => {
                                        setSelectedAddressId(addr._id);
                                        setAddress({
                                            addressLine: addr.addressLine,
                                            landmark: addr.landmark,
                                            zipCode: addr.zipCode
                                        });
                                    }}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${selectedAddressId === addr._id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        {addr.label === 'Home' ? <Home className="w-4 h-4 text-primary" /> : <Briefcase className="w-4 h-4 text-primary" />}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-xs font-black text-secondary">{addr.label || 'Other'}</p>
                                        <p className="text-[10px] text-gray-500 font-bold leading-tight">{addr.addressLine}</p>
                                    </div>
                                    {selectedAddressId === addr._id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                                </div>
                            ))}

                            {/* Manual Entry if no saved or as fallback */}
                            {(!user || savedAddresses.length === 0) && (
                                <div className="space-y-4">
                                    <input
                                        type="text" placeholder="House No, Street, Area"
                                        className="w-full p-3 border rounded-xl"
                                        value={address.addressLine}
                                        onChange={e => setAddress({ ...address, addressLine: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text" placeholder="Landmark"
                                            className="p-3 border rounded-xl"
                                            value={address.landmark}
                                            onChange={e => setAddress({ ...address, landmark: e.target.value })}
                                        />
                                        <input
                                            type="text" placeholder="Pincode"
                                            className="p-3 border rounded-xl"
                                            value={address.zipCode}
                                            onChange={e => setAddress({ ...address, zipCode: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Payment Selection */}
                <div className="bg-white p-6 rounded-2xl border space-y-4">
                    <div className="flex items-center gap-2 text-xl font-bold mb-2">
                        <CreditCard className="text-primary" /> Payment Method
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => setPaymentMode('UPI')}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMode === 'UPI' ? 'border-primary bg-red-50 font-bold text-primary' : 'border-gray-100'
                                }`}
                        >
                            UPI Manual
                        </button>
                        <button
                            onClick={() => setPaymentMode('Online')}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMode === 'Online' ? 'border-primary bg-red-50 font-bold text-primary' : 'border-gray-100'
                                }`}
                        >
                            Card/Netbanking
                        </button>
                        <button
                            onClick={() => setPaymentMode('COD')}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMode === 'COD' ? 'border-primary bg-red-50 font-bold text-primary' : 'border-gray-100'
                                }`}
                        >
                            Cash on Delivery
                        </button>
                    </div>
                </div>

                {/* Payment Summary for Mobile (Integrated if needed) or just visible */}
            </div>

            <div className="space-y-6">
                <div className="bg-gray-50 p-8 rounded-3xl border sticky top-24">
                    <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

                    <div className="relative mb-6">
                        <Ticket className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text" placeholder="Promo Code"
                            className="w-full pl-10 pr-24 py-3 border rounded-xl outline-none"
                            value={couponCode}
                            onChange={e => setCouponCode(e.target.value)}
                        />
                        <button
                            onClick={handleApplyCoupon}
                            className="absolute right-2 top-2 bg-black text-white px-4 py-1.5 rounded-lg font-bold text-sm"
                        >
                            Apply
                        </button>
                    </div>

                    {activeCoupons.length > 0 && (
                        <div className="mb-6">
                            <button
                                onClick={() => setShowCoupons(!showCoupons)}
                                className="text-primary text-xs font-black uppercase tracking-wider flex items-center gap-1 hover:underline"
                            >
                                <Ticket className="w-3 h-3" /> {showCoupons ? 'Hide Offers' : 'View Available Offers'}
                            </button>

                            {showCoupons && (
                                <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-300">
                                    {activeCoupons.map(c => (
                                        <div
                                            key={c.code}
                                            onClick={() => { setCouponCode(c.code); setShowCoupons(false); }}
                                            className="p-3 bg-white border-2 border-dashed border-primary/20 rounded-xl cursor-pointer hover:bg-primary/5 transition-all group"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-black text-secondary">{c.code}</span>
                                                <span className="text-[10px] font-bold text-primary group-hover:underline">Tap to Apply</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold mt-1">
                                                {c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`} on orders above ₹{c.minOrderAmount}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-3 mb-6 pb-6 border-b">
                        <div className="flex justify-between text-gray-600">
                            <span>Items Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery Fee</span>
                            <span className={discount.isFreeDelivery ? 'line-through' : ''}>₹{deliveryCharge}</span>
                        </div>
                        {discount.isFreeDelivery && <div className="flex justify-between text-green-600 font-bold"><span>Free Delivery applied</span><span>-₹{deliveryCharge}</span></div>}
                        <div className="flex justify-between text-gray-600">
                            <span>GST ({businessRules.taxPercentage}%)</span>
                            <span>₹{tax}</span>
                        </div>
                        {discount.amount > 0 && <div className="flex justify-between text-green-600 font-bold"><span>Discount</span><span>-₹{discount.amount}</span></div>}
                    </div>

                    <div className="flex justify-between text-2xl font-extrabold mb-8">
                        <span>Total Payable</span>
                        <span className="text-black font-black">₹{payableAmount}</span>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <button
                        disabled={loading}
                        onClick={handlePlaceOrder}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Place Order <CheckCircle2 className="w-6 h-6" /></>}
                    </button>
                </div>
            </div>

            {/* UPI Payment Modal */}
            {showUpiModal && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 text-center space-y-6">
                        <h2 className="text-2xl font-bold">Scan to Pay ₹{payableAmount}</h2>

                        <div className="bg-white p-2 border-2 border-gray-100 rounded-2xl shadow-inner inline-block">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiDetails}&pn=CloudKitchen&am=${payableAmount}&cu=INR`}
                                alt="UPI QR"
                                className="w-48 h-48"
                            />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <p className="text-xs text-blue-500 font-bold uppercase mb-1">UPI ID</p>
                            <p className="font-mono font-bold text-lg">{upiDetails}</p>
                        </div>

                        <div className="space-y-4 pt-4 border-t text-left">
                            <label className="text-sm font-bold text-gray-600">Enter Transaction ID / UTR:</label>
                            <input
                                type="text"
                                placeholder="12 digit number"
                                className="w-full p-4 border rounded-xl text-center font-bold tracking-widest bg-gray-50 focus:bg-white"
                                value={transactionId}
                                onChange={e => setTransactionId(e.target.value)}
                            />
                            {error && <p className="text-red-500 text-sm font-bold text-center animate-pulse">{error}</p>}
                            <button
                                onClick={handleVerifyUpi}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold mt-2"
                            >
                                Submit & Confirm Order
                            </button>
                            <button
                                onClick={() => setShowUpiModal(false)}
                                className="w-full text-gray-400 text-sm font-medium hover:text-black mt-2"
                            >
                                Go Back / Change Method
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
