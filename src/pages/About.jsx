import React from 'react';
import { Heart, Users, Award, Clock, ChefHat, Leaf } from 'lucide-react';

const About = () => {
    const values = [
        {
            icon: Heart,
            title: "Made with Love",
            description: "Every dish is prepared with care, just like mom makes at home"
        },
        {
            icon: Leaf,
            title: "Fresh Ingredients",
            description: "We source the finest local ingredients daily for maximum freshness"
        },
        {
            icon: ChefHat,
            title: "Expert Chefs",
            description: "Our experienced chefs bring authentic flavors to every meal"
        },
        {
            icon: Award,
            title: "Quality Assured",
            description: "Maintaining highest standards in hygiene and food safety"
        },
        {
            icon: Clock,
            title: "Quick Delivery",
            description: "Hot, fresh meals delivered right to your doorstep"
        },
        {
            icon: Users,
            title: "Family First",
            description: "Building a community around wholesome, home-cooked meals"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full mb-6 shadow-soft border border-orange-100">
                        <ChefHat className="w-5 h-5 text-orange-500" />
                        <span className="text-secondary font-black text-sm uppercase tracking-wider">Our Story</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-black text-secondary mb-6 leading-none">
                        Welcome to
                        <span className="block mt-2 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                            Mom's Kitchen
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                        Where every meal is crafted with the warmth and love of a home-cooked dish.
                        We bring the authentic taste of homemade food right to your table.
                    </p>

                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-bold">Kitchen Open Now</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-5xl font-black text-secondary leading-tight">
                                Started from a
                                <span className="block text-orange-500">Mother's Love</span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Mom's Kitchen was born from a simple belief: everyone deserves to enjoy wholesome,
                                delicious home-cooked meals, even with today's busy lifestyle.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                What started as a mother cooking for her family has grown into a cloud kitchen
                                serving hundreds of families daily. We maintain the same love, care, and authenticity
                                in every dish we prepare.
                            </p>
                            <div className="flex items-center gap-8 pt-4">
                                <div>
                                    <div className="text-4xl font-black text-orange-500">5000+</div>
                                    <div className="text-sm text-gray-600 font-bold">Happy Customers</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-orange-500">50+</div>
                                    <div className="text-sm text-gray-600 font-bold">Dishes</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-orange-500">4.8★</div>
                                    <div className="text-sm text-gray-600 font-bold">Rating</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl overflow-hidden shadow-premium border-4 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80"
                                    alt="Our Kitchen"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-3/4 h-3/4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-6 bg-white/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-secondary mb-4">
                            Our <span className="text-orange-500">Values</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            What makes us different and why families trust us
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-8 shadow-soft hover:shadow-premium border-2 border-gray-100 hover:border-orange-200 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <value.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-secondary mb-3">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-br from-orange-600 to-orange-400 rounded-3xl p-12 shadow-premium text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black mb-6">
                                Hungry? We're Here to Serve! 🍽️
                            </h2>
                            <p className="text-xl mb-8 opacity-90">
                                Experience the joy of home-cooked meals. Order now and taste the difference!
                            </p>
                            <a
                                href="/menu"
                                className="inline-block px-10 py-4 bg-white text-orange-600 font-black text-lg rounded-full shadow-premium hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Explore Our Menu
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
