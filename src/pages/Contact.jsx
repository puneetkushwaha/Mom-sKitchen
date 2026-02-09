import React, { useState } from 'react';
import API from '../services/api';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Twitter, Loader2 } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await API.post('/public/contact', formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const contactInfo = [
        {
            icon: Phone,
            title: "Call Us",
            details: ["+91 73806 63685"],
            link: "tel:+917380663685"
        },
        {
            icon: Mail,
            title: "Email Us",
            details: ["hello@momskitchen.com", "support@momskitchen.com"],
            link: "mailto:hello@momskitchen.com"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            details: ["Lucknow, Uttar Pradesh", "India - 226001"],
            link: "https://maps.google.com/?q=Lucknow"
        },
        {
            icon: Clock,
            title: "Working Hours",
            details: ["Monday - Saturday: 9 AM - 10 PM", "Sunday: 10 AM - 9 PM"],
            link: null
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <h1 className="text-6xl md:text-7xl font-black text-secondary mb-6 leading-none">
                        Get in
                        <span className="block mt-2 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                            Touch
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactInfo.map((info, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-premium border-2 border-gray-100 hover:border-orange-200 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <info.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-secondary mb-3">{info.title}</h3>
                            <div className="space-y-1">
                                {info.details.map((detail, idx) => (
                                    <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                                ))}
                            </div>
                            {info.link && (
                                <a
                                    href={info.link}
                                    className="inline-block mt-4 text-orange-500 text-sm font-bold hover:text-orange-600 transition-colors"
                                >
                                    {info.icon === MapPin ? 'View on Map →' : 'Contact →'}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Form & Map Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">

                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl p-8 shadow-premium border-2 border-gray-100">
                        <h2 className="text-4xl font-black text-secondary mb-2">
                            Send us a Message
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Fill out the form below and we'll get back to you within 24 hours
                        </p>

                        {submitted && (
                            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl animate-scale-in">
                                <p className="text-green-700 font-bold">✓ Message sent successfully! We'll be in touch soon.</p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-scale-in">
                                <p className="text-red-700 font-bold">✕ {error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Your Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                                    placeholder="John Doe"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                                    placeholder="john@example.com"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                                    placeholder="+91 73806 63685"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
                                <textarea
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all outline-none resize-none"
                                    placeholder="Tell us how we can help you..."
                                    disabled={loading}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-400 text-white font-black py-4 rounded-xl shadow-premium hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* Map & Social */}
                    <div className="space-y-8">
                        {/* Google Map Placeholder */}
                        <div className="bg-gray-200 rounded-3xl overflow-hidden shadow-premium border-2 border-gray-100 h-80">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.23307662998!2d80.85244199999999!3d26.848623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Mom's Kitchen Location"
                            ></iframe>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-3xl p-8 shadow-soft border-2 border-gray-100">
                            <h3 className="text-2xl font-black text-secondary mb-4">Follow Us</h3>
                            <p className="text-gray-600 mb-6">Stay connected on social media for updates and special offers</p>
                            <div className="flex gap-4">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-soft"
                                >
                                    <Facebook className="w-6 h-6 text-white" />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-soft"
                                >
                                    <Instagram className="w-6 h-6 text-white" />
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-soft"
                                >
                                    <Twitter className="w-6 h-6 text-white" />
                                </a>
                            </div>
                        </div>

                        {/* FAQ Quick Links */}
                        <div className="bg-gradient-to-br from-orange-600 to-orange-400 rounded-3xl p-8 shadow-premium text-white">
                            <h3 className="text-2xl font-black mb-2">Need Quick Help?</h3>
                            <p className="mb-6 opacity-90">Check out our frequently asked questions</p>
                            <a
                                href="/menu"
                                className="inline-block px-6 py-3 bg-white text-orange-600 font-black rounded-xl hover:scale-105 transition-transform shadow-soft"
                            >
                                View FAQ
                            </a>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
};

export default Contact;
