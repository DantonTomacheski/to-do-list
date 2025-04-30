import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TaskStatus } from "../store/taskStore";

interface StatusFilterChipProps {
  status: "All" | TaskStatus;
  isActive: boolean;
  onClick: () => void;
}

const StatusFilterChip: React.FC<StatusFilterChipProps> = ({
  status,
  isActive,
  onClick,
}) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Effect to update mobile status on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Map status to color and translation
  const statusMap = {
    All: {
      color: "bg-gray-100 text-gray-800",
      activeColor: "text-purple-600",
      label: t("all"),
    },
    "To-do": {
      color: "bg-blue-100 text-blue-800",
      activeColor: "text-blue-600",
      label: t("todo"),
    },
    "In Progress": {
      color: "bg-orange-100 text-orange-800",
      activeColor: "text-orange-600",
      label: t("taskInProgress"),
    },
    Done: {
      color: "bg-green-100 text-green-800",
      activeColor: "text-green-600",
      label: t("done"),
    },
  };

  const { color, activeColor, label } = statusMap[status];

  // Icons for mobile view
  const statusIcons = {
    "All": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    "To-do": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    "In Progress": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    "Done": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  };

  return (
    <div
      className={`${isMobile ? 'p-2 min-w-[40px] flex-1' : 'px-4 py-2'} rounded-full ${color} relative transition-all duration-150 cursor-pointer flex items-center justify-center`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      aria-label={label}
    >
      {/* Show icon for very small screens, text for larger screens */}
      {isMobile ? (
        <div className="flex flex-col items-center">
          {statusIcons[status]}
          <span className={`text-xs mt-1 truncate max-w-[60px] ${isActive ? "font-bold" : "font-normal"}`}>
            {label}
          </span>
        </div>
      ) : (
        <span className={`${isActive ? "font-bold" : "font-normal"}`}>
          {label}
        </span>
      )}

      {/* Active indicator underline */}
      {isActive && (
        <div
          className={`absolute bottom-0 left-0 right-0 mx-auto w-full h-0.5 ${activeColor.replace(
            "text",
            "bg"
          )}`}
        />
      )}
    </div>
  );
};

export default StatusFilterChip;
