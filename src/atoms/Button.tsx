import React, { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  iconPosition?: "left" | "right";
  showIcon?: boolean;
  icon?: React.ReactNode;
}

interface RippleType {
  x: number;
  y: number;
  id: number;
}

const SQUISH_RADIUS = "72px / 56px";

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[#6236ff] text-white shadow-[0_8px_28px_-6px_rgba(98,54,255,0.35)] " +
    "hover:shadow-[0_10px_32px_-4px_rgba(98,54,255,0.45)] active:shadow-none",
  secondary:
    "bg-pink-500 text-white shadow-[0_8px_28px_-6px_rgba(236,72,153,0.35)] " +
    "hover:shadow-[0_10px_32px_-4px_rgba(236,72,153,0.45)] active:shadow-none",
  outline:
    "border border-[#6236ff] text-[#6236ff] hover:bg-[#6236ff]/10 active:bg-[#6236ff]/20",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "py-2 px-5 text-sm",
  md: "py-3 px-8 text-base",
  lg: "py-4 px-10 text-lg",
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  iconPosition = "right",
  showIcon = true,
  icon,
  className = "",
  ...props
}) => {
  const [ripples, setRipples] = useState<RippleType[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const nextId = useRef(0);

  // Handle ripple effect
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      // Calculate ripple position relative to button
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const id = nextId.current;
      nextId.current = nextId.current + 1;

      // Add new ripple
      setRipples([...ripples, { x, y, id }]);

      // Call original onClick if provided
      if (props.onClick) {
        props.onClick(e);
      }
    }
  };

  // Remove ripple after animation completes
  useEffect(() => {
    if (ripples.length > 0) {
      const timeoutId = setTimeout(() => {
        setRipples((prevRipples) => prevRipples.slice(1));
      }, 600); // Match this with the CSS animation duration

      return () => clearTimeout(timeoutId);
    }
  }, [ripples]);

  return (
    <button
      ref={buttonRef}
      style={{ borderRadius: SQUISH_RADIUS }}
      className={`
        relative overflow-hidden
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-150 ease-out
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      onClick={handleClick}
      {...props}
    >
      {iconPosition === "left" &&
        (icon ||
          (showIcon && (
            <ArrowRight size={size === "sm" ? 16 : size === "md" ? 18 : 20} />
          )))}

      {children}

      {iconPosition === "right" &&
        (icon ||
          (showIcon && (
            <ArrowRight size={size === "sm" ? 16 : size === "md" ? 18 : 20} />
          )))}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
            opacity: 0.5, // Opacity inicial explícita
          }}
          className={`
            absolute rounded-full
            bg-white
            animate-ripple pointer-events-none
          `}
        ></span>
      ))}
    </button>
  );
};

export { Button };
