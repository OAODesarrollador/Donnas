"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  isLoading = false,
  icon,
}) => {
  // Styles configuration based on modern, premium aesthetics
  const baseStyle =
    "inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed select-none relative overflow-hidden active:scale-95";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs rounded-xl gap-1.5",
    md: "px-6 py-3.5 text-sm rounded-2xl gap-2",
    lg: "px-8 py-4.5 text-base rounded-2xl gap-2.5",
    xl: "px-9 py-5 text-lg rounded-3xl gap-3",
  };

  const variantStyles = {
    primary:
      "bg-brand-cacao text-brand-cream hover:bg-brand-chocolate shadow-[0_8px_24px_rgba(42,27,20,0.18)] hover:shadow-[0_12px_28px_rgba(42,27,20,0.25)] border border-transparent",
    secondary:
      "bg-brand-pink text-brand-cacao hover:bg-brand-pink-dark shadow-[0_8px_24px_rgba(243,210,215,0.3)] hover:shadow-[0_12px_28px_rgba(243,210,215,0.45)] border border-transparent",
    outline:
      "border border-brand-cacao/15 text-brand-cacao bg-white/40 backdrop-blur-sm hover:bg-brand-beige/25 hover:border-brand-cacao/30 shadow-[0_4px_12px_rgba(0,0,0,0.02)]",
    ghost:
      "text-brand-cacao bg-transparent hover:bg-brand-beige/20",
    danger:
      "bg-red-50 text-red-700 hover:bg-red-100/80 border border-red-100",
  };

  // Spring physics for the liquid bouncy tap feel
  const springTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 24,
    mass: 0.8,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      whileHover={{ 
        scale: 1.025,
        y: -1.5,
      }}
      whileTap={{ 
        scale: 0.94,
        y: 0,
        borderRadius: size === "xl" ? "20px" : "14px",
      }}
      transition={springTransition}
    >
      {/* Liquid background reflection glow */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-t from-white/0 via-white/5 to-white/10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4.5 w-4.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Procesando...
        </div>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="relative z-10 font-semibold tracking-wide">{children}</span>
        </>
      )}
    </motion.button>
  );
};
