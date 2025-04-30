import React from 'react';

interface BackIconBtnProps {
  onClick: () => void;
  ariaLabel?: string;
}

const BackIconBtn: React.FC<BackIconBtnProps> = ({ 
  onClick, 
  ariaLabel = 'Back' 
}) => {
  return (
    <button
      className="w-6 h-6 p-1 rounded-full active:bg-black/10 transition-colors duration-150"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full text-gray-800"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
};

export default BackIconBtn;
