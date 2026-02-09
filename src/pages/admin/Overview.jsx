import React from 'react';
import { TrendingUp, ShoppingBag, Clock, DollarSign, CreditCard, Activity, Download } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import HeatmapChart from '../../components/admin/HeatmapChart';
import ProfitAnalysis from '../../components/admin/ProfitAnalysis';
import API from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const Overview = ({ stats, loading }) => {
    const { isDarkMode } = useTheme();

    if (loading) return (
        <div className="py-24 text-center flex flex-col items-center gap-6 animate-fade-in">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
            </div>
            <p className="text-gray-400 font-black text-lg tracking-tight animate-pulse">Syncing Business Data...</p>
        </div>
    );

    const cards = [
        { label: "Today's Revenue", value: `₹${stats?.today?.revenue || 0}`, icon: DollarSign, color: 'text-orange-600', trend: '+12.5%', trendType: 'up' },
        { label: "Today's Orders", value: stats?.today?.totalOrders || 0, icon: ShoppingBag, color: 'text-orange-800', trend: '+4', trendType: 'up' },
        { label: "Pending Orders", value: stats?.today?.pending || 0, icon: Clock, color: 'text-red-600', trend: 'Needs Action', trendType: 'neutral' },
        { label: "UPI Payments", value: stats?.today?.online || 0, icon: CreditCard, color: 'text-orange-900', trend: '84% Capacity', trendType: 'up' },
    ];

    const chartData = stats?.trend || [];

    const handleDownloadReport = async () => {
        try {
            const { data: orders } = await API.get('/admin/reports');
            if (!orders || orders.length === 0) return alert("No orders found for today.");

            const csvRows = [
                ['Order ID', 'Customer', 'Phone', 'Amount', 'Status', 'Payment', 'Date'],
                ...orders.map(o => [
                    o._id.toString().slice(-6).toUpperCase(),
                    o.user?.name || 'Guest',
                    o.user?.phone || 'N/A',
                    `INR ${o.payableAmount}`,
                    o.orderStatus,
                    o.paymentMode,
                    new Date(o.createdAt).toLocaleTimeString()
                ])
            ];

            const csvContent = csvRows.map(e => e.join(",")).join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `Sales_Report_${new Date().toLocaleDateString()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert("Failed to download report");
        }
    };

    return (
        <div className="space-y-12 pb-10">
            <div className="relative p-10 bg-secondary rounded-[3.5rem] overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/20 transition-all duration-1000" />
                <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-8">
                    <div className="text-center xl:text-left">
                        <div className="flex items-center gap-3 mb-4 justify-center xl:justify-start">
                            <span className="px-3 py-1 bg-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md border border-white/5">Performance Center</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">Kitchen Overview</h2>
                        <p className="text-white/40 font-bold max-w-md mx-auto xl:mx-0">Track your cloud kitchen's daily performance, growth trends and financial health in real-time.</p>
                    </div>
                    <button
                        onClick={handleDownloadReport}
                        className="w-full sm:w-auto group bg-white text-secondary px-8 py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-2xl shadow-black/20 hover:scale-105"
                    >
                        <Download className="w-5 h-5 group-hover:animate-bounce" />
                        Generate Analytics Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 cursor-default">
                        <div className="absolute top-0 right-0 p-8 text-gray-50/50 group-hover:text-primary/5 transition-colors duration-500">
                            <card.icon className="w-24 h-24 rotate-12 translate-x-10 -translate-y-4" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <div className={`${card.color} p-4 bg-orange-50 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 font-black text-[10px] px-3 py-1 rounded-full ${card.trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
                                    }`}>
                                    {card.trendType === 'up' && <TrendingUp className="w-3 h-3" />}
                                    {card.trend}
                                </div>
                            </div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{card.label}</p>
                            <h3 className="text-4xl font-black text-secondary tracking-tighter">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white rounded-[4rem] border border-gray-100 p-12 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10 flex justify-between items-start mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-5 h-5 text-primary" />
                                <h4 className="text-2xl font-black text-secondary">Revenue Streams</h4>
                            </div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-7">Detailed daily financial performance</p>
                        </div>
                    </div>
                    <div className="relative h-[350px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={100}>
                                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7C2D12" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#7C2D12" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: '#7C2D12', strokeWidth: 1, strokeDasharray: '5 5' }}
                                        contentStyle={{ backgroundColor: '#7C2D12', borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)', padding: '20px' }}
                                        itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 900 }}
                                        labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}
                                        formatter={(value) => [`₹${value}`, 'Revenue']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#7C2D12"
                                        strokeWidth={5}
                                        strokeLinecap="round"
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-gray-300 font-black tracking-widest uppercase italic text-xs">
                                No statistical data recorded
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-10">
                    <ProfitAnalysis data={stats?.profit} />
                </div>

                <div className="lg:col-span-3">
                    <HeatmapChart data={stats?.heatmap || []} />
                </div>
            </div>
        </div>
    );
};

export default Overview;
