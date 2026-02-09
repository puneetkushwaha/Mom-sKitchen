import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, TrendingUp } from 'lucide-react';

const ProfitAnalysis = ({ data }) => {
    const chartData = [
        { name: 'Cost', value: data?.cost || 0, color: '#E2E8F0' },
        { name: 'Profit', value: data?.grossProfit || 0, color: '#7C2D12' }
    ];

    return (
        <div className="bg-white dark:bg-secondary p-10 rounded-[2.5rem] border dark:border-gray-800 h-[500px] flex flex-col transition-colors">
            <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                    <h4 className="text-xl font-black text-secondary dark:text-white">Profit Analysis</h4>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">30-day financial health</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl">
                    <DollarSign className="w-6 h-6" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-grow">
                <div className="relative h-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={100}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                                formatter={(value) => [`₹${value}`]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Margin</span>
                        <span className="text-2xl font-black text-secondary dark:text-white leading-tight">{data?.margin}%</span>
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-6">
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Revenue</p>
                        <p className="text-2xl font-black text-secondary dark:text-white">₹{data?.revenue}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Ingredient Cost</p>
                        <p className="text-xl font-black text-slate-400">₹{data?.cost}</p>
                    </div>
                    <div className="pt-4 border-t dark:border-gray-800">
                        <p className="text-[#7C2D12] text-[10px] font-black uppercase tracking-widest mb-1">Gross Profit</p>
                        <p className="text-3xl font-black text-[#7C2D12]">₹{data?.grossProfit}</p>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-black text-emerald-500">Healthy Margin</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfitAnalysis;
