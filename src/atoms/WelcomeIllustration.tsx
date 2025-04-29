import React from "react";
import WelcomeIllustrationIcon from "@/assets/svgs/welcome-icon.svg";

interface WelcomeIllustrationProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const WelcomeIllustration: React.FC<WelcomeIllustrationProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-60 h-60",
  };

  return (
    <div
      className={`rounded-lg overflow-hidden flex items-center justify-center bg-transparent ${sizeClasses[size]} ${className}`}
    >
      <img src={WelcomeIllustrationIcon} alt="Welcome" />
    </div>
  );
};

export default WelcomeIllustration;
