import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Wallet, TrendingUp } from "lucide-react";

interface ChartProps {
    data: any[];
    type: 'purchase' | 'payment';
}

export function DashboardCharts({ data, type }: ChartProps) {
    if (type === 'purchase') {
        return (
            <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <CardHeader className="pt-8 px-8">
                    <CardTitle className="text-xl flex items-center justify-between font-display">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2.5 rounded-2xl text-orange-600 transition-transform group-hover:rotate-12">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                            <span>Monthly Purchases</span>
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500 opacity-50" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[320px] pb-8 pt-4 px-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#fb923c" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                dx={-10}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc', radius: 8 }}
                                contentStyle={{
                                    borderRadius: '20px',
                                    border: 'none',
                                    padding: '12px 16px',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ fontWeight: 700, color: '#1e293b' }}
                                labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
                            />
                            <Bar
                                dataKey="total_purchase"
                                fill="url(#barGradient)"
                                radius={[6, 6, 6, 6]}
                                barSize={28}
                                name="Purchase"
                                animationDuration={1500}
                                animationBegin={300}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
            <CardHeader className="pt-8 px-8">
                <CardTitle className="text-xl flex items-center justify-between font-display">
                    <div className="flex items-center gap-3">
                        <div className="bg-sky-100 p-2.5 rounded-2xl text-sky-600 transition-transform group-hover:rotate-12">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <span>Monthly Payments</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[320px] pb-8 pt-4 px-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '20px',
                                border: 'none',
                                padding: '12px 16px',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ fontWeight: 700, color: '#1e293b' }}
                            labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="total_paid"
                            stroke="#0ea5e9"
                            fillOpacity={1}
                            fill="url(#colorPaid)"
                            strokeWidth={4}
                            name="Paid"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

