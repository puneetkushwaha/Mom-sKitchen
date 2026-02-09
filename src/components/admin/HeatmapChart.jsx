import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock } from 'lucide-react';

const HeatmapChart = ({ data }) => {
    // Fill in missing hours if any (0-23)
    const fullData = Array.from({ length: 24 }, (_, i) => {
        const existing = (data || []).find(d => d._id === i);
        return {
            hour: i,
            count: existing ? existing.count : 0,
            label: `${i}:00`
        };
    });

    const maxCount = Math.max(...fullData.map(d => d.count), 1);

    const getBarColor = (count) => {
        const intensity = count / maxCount;
        if (intensity > 0.8) return '#7C2D12'; // Brand Maroon (Peak)
        if (intensity > 0.5) return '#EA580C'; // Warm Orange
        if (intensity > 0.2) return '#FDBA74'; // Soft Amber
        return '#E2E8F0'; // Light Gray (Low)
    };

    return (
        <div className="bg-white dark:bg-secondary p-10 rounded-[2.5rem] border dark:border-gray-800 h-[500px] flex flex-col">
            <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                    <h4 className="text-xl font-black text-secondary dark:text-white">Peak Order Hours</h4>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Heatmap based on last 30 days</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl">
                    <Clock className="w-6 h-6" />
                </div>
            </div>

            <div className="flex-grow w-full relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={100}>
                    <BarChart data={fullData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="hour"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                        />
                        <YAxis axisLine={false} tickLine={false} hide />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-secondary text-white p-4 rounded-2xl shadow-2xl border border-white/10">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">{payload[0].payload.label}</p>
                                            <p className="text-xl font-black">{payload[0].value} Orders</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 6, 6]}>
                            {fullData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.count)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase">Low</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-300"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#7C2D12]"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase">Peak</span>
                </div>
            </div>
        </div>
    );
};

export default HeatmapChart;
