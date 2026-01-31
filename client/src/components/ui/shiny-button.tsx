import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  children?: React.ReactNode;
}

export const ShinyButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {

    const baseStyles = "relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-display font-bold tracking-wide rounded-full transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-primary text-white shadow-[0_10px_30px_rgba(255,87,34,0.3)] hover:shadow-[0_20px_40px_rgba(255,87,34,0.4)]",
      secondary: "bg-teal-500 text-white shadow-[0_10px_30px_rgba(20,184,166,0.3)] hover:shadow-[0_20px_40px_rgba(20,184,166,0.4)]",
      outline: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
      ghost: "bg-transparent text-primary hover:bg-primary/5",
    };

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {/* Animated Shine */}
        <motion.div
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
        />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.button>
    )

  }
)
ShinyButton.displayName = "ShinyButton"
