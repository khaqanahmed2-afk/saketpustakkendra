import { Card, CardContent } from "@/components/ui/card";
import { User, Smartphone, Calendar, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

interface AccountInfoProps {
    customer: any;
}

export function AccountInfoCard({ customer }: AccountInfoProps) {
    if (!customer) return null;

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
                <h3 className="text-lg font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Account Info
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Account Name</p>
                            <p className="text-sm font-bold text-slate-800">{customer.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                            <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Mobile Number</p>
                            <p className="text-sm font-bold text-slate-800">{customer.mobile}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
                        <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Join Date</p>
                            <p className="text-sm font-bold text-slate-800">
                                {customer.createdAt ? format(new Date(customer.createdAt), 'dd MMM yyyy') : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Account Status</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
