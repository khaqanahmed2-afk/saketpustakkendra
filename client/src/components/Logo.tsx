
import { BookOpen } from "lucide-react";

export function Logo({ className = "", iconClassName = "w-6 h-6", textSize = "text-xl" }: { className?: string, iconClassName?: string, textSize?: string }) {
    return (
        <div className={`flex items-center gap-2 group cursor-pointer ${className}`}>
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <BookOpen className={`${iconClassName} text-primary`} />
            </div>
            <span className={`font-display font-bold tracking-tight text-foreground ${textSize}`}>
                Saket Pustak Kendra
            </span>
        </div>
    );
}
