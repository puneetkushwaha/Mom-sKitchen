import React from 'react';

const PlaceholderPage = ({ title }) => (
    <div className="py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-500 italic">Feature coming soon or under development...</p>
        <div className="mt-10 p-10 border-2 border-dashed border-gray-200 rounded-2xl max-w-md mx-auto">
            [Placeholder Interface]
        </div>
    </div>
);

export const Menu = () => <PlaceholderPage title="Menu Browsing" />;
export const Cart = () => <PlaceholderPage title="Your Cart" />;
export const Checkout = () => <PlaceholderPage title="Checkout" />;
export const OrderTracking = () => <PlaceholderPage title="Track Your Order" />;
export const Login = () => <PlaceholderPage title="Login / Signup" />;
export const AdminDashboard = () => <PlaceholderPage title="Owner Admin Panel" />;
