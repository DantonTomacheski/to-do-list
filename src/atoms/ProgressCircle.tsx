import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ProgressCircleProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  trailColor?: string;
  textColor?: string;
  showPercentage?: boolean;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size = "md",
  color = "#5B3FFF", // Use our custom purple color as default
  className = "",
  trailColor = "#E9D5FF",
  textColor,
  showPercentage = true,
}) => {
  const sizeValues = {
    sm: 40,
    md: 60,
    lg: 80,
  };

  const actualSize = sizeValues[size];

  return (
    <div
      className={`${className}`}
      style={{ width: actualSize, height: actualSize }}
    >
      <CircularProgressbar
        value={percentage}
        text={showPercentage ? `${percentage}%` : ""}
        strokeWidth={10}
        styles={buildStyles({
          rotation: 0,
          strokeLinecap: "round",
          textSize: "30px",
          pathTransitionDuration: 0.5,
          pathColor: color,
          textColor: textColor || color,
          trailColor: trailColor,
          backgroundColor: "transparent",
        })}
      />
    </div>
  );
};

export default ProgressCircle;
