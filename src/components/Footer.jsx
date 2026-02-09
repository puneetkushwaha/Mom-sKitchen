import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-32">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-3xl shadow-soft">
                                👩‍🍳
                            </div>
                            <div>
                                <h3 className="text-xl font-black">Mom's Kitchen</h3>
                                <p className="text-xs text-orange-500 font-bold uppercase">Cloud Kitchen</p>
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Experience the warmth of home-cooked meals, made with love and the finest ingredients.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-black mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {['Menu', 'About', 'Contact', 'Profile'].map((link) => (
                                <li key={link}>
                                    <Link to={`/${link.toLowerCase()}`} className="text-gray-400 hover:text-primary transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-black mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <Phone className="w-5 h-5 text-primary mt-0.5" />
                                <span>+91 73806 63685</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <Mail className="w-5 h-5 text-primary mt-0.5" />
                                <span>hello@momskitchen.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                <span>Lucknow, Uttar Pradesh, India</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-black mb-6">Stay Updated</h4>
                        <p className="text-gray-400 mb-4">Get exclusive offers and updates</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            <button className="px-4 py-2 bg-primary hover:bg-accent text-white font-bold rounded-lg transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
                    <p className="flex items-center gap-2">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by Mom's Kitchen © 2026
                    </p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
