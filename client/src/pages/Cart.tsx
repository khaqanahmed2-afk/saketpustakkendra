import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShinyButton } from "@/components/ui/shiny-button";
import { MessageCircle, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

// Mock Data for Cart/Inquiry List
const cartItems = [
    { id: 1, name: "Classmate Notebook - Pack of 6", price: "₹340", image: "https://images.unsplash.com/photo-1531346878377-a513bc95f30f?w=200&q=80" },
    { id: 2, name: "Parker Roller Pen - Blue", price: "₹250", image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=200&q=80" },
    { id: 3, name: "Camlin Acrylic Colors - 12 Shades", price: "₹450", image: "https://images.unsplash.com/photo-1572916172675-7301c3bc6566?w=200&q=80" },
];

export default function Cart() {
    return (
        <Layout>
            <div className="min-h-screen bg-secondary/30 pb-20">
                <div className="bg-gradient-to-r from-primary/10 via-secondary to-accent/10 pt-12 pb-20 px-4 border-b border-primary/5">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl font-display font-bold mb-4 text-slate-800">Your Inquiry List</h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Review the items you're interested in. Click to request the final price on WhatsApp.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto space-y-6"
                    >
                        {cartItems.map((item, idx) => (
                            <Card key={item.id} className="border-primary/5 shadow-sm hover:shadow-md transition-all bg-white rounded-[1.5rem] overflow-hidden group">
                                <CardContent className="p-4 flex items-center gap-6">
                                    <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">{item.name}</h3>
                                        <p className="text-primary font-bold">{item.price} <span className="text-slate-400 text-sm font-normal">(Approx)</span></p>
                                    </div>
                                    <button className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="pt-6">
                            <Card className="border-none shadow-lg bg-white rounded-[2rem] overflow-hidden p-8 text-center ring-1 ring-primary/10">
                                <div className="mb-6 flex justify-center">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                        <MessageCircle className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to Order?</h3>
                                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                    Sending this list to WhatsApp will connect you directly with our store manager for stock confirmation and bulk discounts.
                                </p>
                                <ShinyButton className="w-full max-w-md mx-auto bg-green-500 hover:bg-green-600 text-white shadow-green-200 py-6 text-lg rounded-2xl">
                                    Send List on WhatsApp <ArrowRight className="w-5 h-5 ml-2" />
                                </ShinyButton>
                            </Card>
                        </div>

                        <div className="text-center pt-8">
                            <Link href="/shop" className="text-slate-500 hover:text-primary font-bold flex items-center justify-center gap-2 transition-colors">
                                <ShoppingBag className="w-4 h-4" /> Continue Shopping
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
