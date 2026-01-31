import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const orders = [
    { id: "ORD-2024-001", date: "29 Jan 2024", items: "Classmate Notebooks (x12), Pens", status: "Completed", amount: "₹850" },
    { id: "ORD-2024-002", date: "25 Jan 2024", items: "Office File Organizer, Stapler", status: "Processing", amount: "₹420" },
    { id: "ORD-2023-089", date: "12 Dec 2023", items: "Exam Guide - Class 10 (Full Set)", status: "Completed", amount: "₹1,250" },
];

export default function Orders() {
    return (
        <Layout>
            <div className="min-h-screen bg-secondary/30 pb-20">
                <div className="bg-gradient-to-r from-primary/10 via-secondary to-accent/10 pt-12 pb-20 px-4 border-b border-primary/5">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl font-display font-bold mb-4 text-slate-800">My Orders</h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Track your past purchases and ongoing inquiries.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto space-y-4"
                    >
                        {orders.map((order) => (
                            <Card key={order.id} className="border-primary/5 shadow-sm hover:shadow-md transition-all bg-white rounded-[1.5rem] overflow-hidden group cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl ${order.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{order.id}</h4>
                                                <p className="text-xs text-slate-400 font-medium">{order.date}</p>
                                            </div>
                                        </div>
                                        <Badge variant={order.status === 'Completed' ? 'default' : 'secondary'} className="rounded-lg px-3 py-1">
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <div className="pl-14">
                                        <p className="text-slate-600 font-medium mb-1">{order.items}</p>
                                        <p className="text-slate-400 text-sm">Total: <span className="text-slate-800 font-bold">{order.amount}</span></p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="text-center pt-8 opacity-60">
                            <p className="text-sm text-slate-400">Showing last 3 orders</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
