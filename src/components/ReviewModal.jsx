import React, { useState } from 'react';
import { Star, X, Camera, Loader2, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

const ReviewModal = ({ orderId, isOpen, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]); // Store File objects
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 3) {
            alert('Aap max 3 photos hi add kar sakte hain.');
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviews(newPreviews);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('orderId', orderId);
            formData.append('rating', rating);
            formData.append('comment', comment);

            images.forEach((image) => {
                formData.append('images', image);
            });

            await API.post('/reviews', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSubmitted(true);
            setTimeout(() => {
                onReviewSubmitted();
                onClose();
            }, 2000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-secondary w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative border dark:border-gray-800">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {submitted ? (
                    <div className="p-12 text-center space-y-4 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-secondary dark:text-white">Thank You!</h2>
                        <p className="text-gray-500 font-medium">Your delicious feedback helps us grow.</p>
                    </div>
                ) : (
                    <div className="p-8 space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-secondary dark:text-white">Rate Your Meal</h2>
                            <p className="text-gray-400 font-medium text-sm">How was your experience today?</p>
                        </div>

                        {/* Stars */}
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-transform active:scale-90"
                                >
                                    <Star
                                        className={`w-10 h-10 transition-colors ${(hover || rating) >= star
                                            ? 'fill-accent text-accent'
                                            : 'text-gray-200 dark:text-gray-700'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Comment */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Your Thoughts (Optional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tell us what you liked the most..."
                                className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-800 rounded-3xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none dark:text-white"
                            />
                        </div>

                        {/* Photo Selection */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Add Photos (Max 3)</label>

                            {/* Previews */}
                            {previews.length > 0 && (
                                <div className="flex gap-4 px-2 overflow-x-auto pb-2">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="relative w-20 h-20 flex-shrink-0 group">
                                            <img src={src} alt="Preview" className="w-full h-full object-cover rounded-2xl border dark:border-gray-800 shadow-sm" />
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <label className="cursor-pointer group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <div className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex items-center justify-center gap-3 text-gray-400 group-hover:border-primary group-hover:text-primary transition-all font-bold">
                                    <Camera className="w-5 h-5" />
                                    <span>{images.length > 0 ? 'Add More Photos' : 'Add Food Photos'}</span>
                                </div>
                            </label>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || rating === 0}
                            className="w-full py-5 bg-secondary dark:bg-primary text-white rounded-3xl font-black text-lg hover:scale-[1.02] transition-all shadow-xl shadow-secondary/20 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Review'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewModal;
