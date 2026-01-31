import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: "orange" | "blue" | "teal" | "sky" | "pink" | "red" | "green" | "slate";
  delay?: number;
}

const colorMap = {
  orange: "border-orange-100 hover:border-orange-200 shadow-orange-500/5",
  blue: "border-blue-100 hover:border-blue-200 shadow-blue-500/5",
  teal: "border-teal-100 hover:border-teal-200 shadow-teal-500/5",
  sky: "border-sky-100 hover:border-sky-200 shadow-sky-500/5",
  pink: "border-pink-100 hover:border-pink-200 shadow-pink-500/5",
  red: "border-red-100 hover:border-red-200 shadow-red-500/5",
  green: "border-green-100 hover:border-green-200 shadow-green-500/5",
  slate: "border-slate-100 hover:border-slate-200 shadow-slate-500/5",
};

const iconBgMap = {
  orange: "bg-orange-50 text-orange-600",
  blue: "bg-blue-50 text-blue-600",
  teal: "bg-teal-50 text-teal-600",
  sky: "bg-sky-50 text-sky-600",
  pink: "bg-pink-50 text-pink-600",
  red: "bg-red-50 text-red-600",
  green: "bg-green-50 text-green-600",
  slate: "bg-slate-50 text-slate-600",
};

export function StatCard({ title, value, icon: Icon, color, delay = 0 }: StatCardProps) {
  return (
    <div className={cn("animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both")} style={{ animationDelay: `${delay}ms` }}>
      <Card className={cn(
        "border shadow-lg transition-all duration-500 bg-white rounded-[2rem] overflow-hidden group hover:-translate-y-1 hover:shadow-xl",
        colorMap[color]
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-8">
          <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
            {title}
          </CardTitle>
          <div className={cn("p-3 rounded-2xl transition-transform group-hover:rotate-12", iconBgMap[color])}>
            <Icon className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="text-4xl font-black font-display tracking-tight text-slate-800">{value}</div>
        </CardContent>
      </Card>
    </div>
  );
}

