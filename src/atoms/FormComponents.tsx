import { t } from "i18next";
import React, { forwardRef } from "react";

// Field Label Component
interface FieldLabelProps {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
  htmlFor,
  required = false,
  children,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-medium text-gray-500 mb-1 block"
      aria-required={required ? "true" : "false"}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

// Input Base Component
interface InputBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl border ${
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:ring-purple-200"
          } focus:ring-2 focus:outline-none transition-all duration-150 ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

InputBase.displayName = "InputBase";

// Text Area Base Component
interface TextareaBaseProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  characterCount?: number;
  maxLength?: number;
}

export const TextareaBase = forwardRef<HTMLTextAreaElement, TextareaBaseProps>(
  ({ error, characterCount, maxLength, className = "", ...props }, ref) => {
    const showCount = characterCount !== undefined && maxLength !== undefined;
    const isNearLimit =
      maxLength && characterCount && characterCount > maxLength * 0.9;

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl border ${
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:ring-purple-200"
          } focus:ring-2 focus:outline-none transition-all duration-150 h-28 resize-none ${className}`}
          {...props}
        />
        <div className="flex justify-between items-center mt-1">
          {error && <p className="text-xs text-red-500">{error}</p>}
          {showCount && (
            <p
              className={`text-xs ${
                isNearLimit ? "text-orange-500" : "text-gray-400"
              } ml-auto`}
            >
              {characterCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextareaBase.displayName = "TextareaBase";

// Dropdown Button Component
interface DropdownBtnProps {
  label: string;
  isOpen: boolean;
  onClick: () => void;
  error?: string;
}

export const DropdownBtn: React.FC<DropdownBtnProps> = ({
  label,
  isOpen,
  onClick,
  error,
}) => {
  return (
    <div className="w-full">
      <button
        type="button"
        className={`w-full px-4 py-3 rounded-xl border ${
          error ? "border-red-500" : "border-gray-200"
        } focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-200" : "focus:ring-purple-200"
        } flex items-center justify-between transition-all duration-150`}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span
          className={`${
            label === "Select task group" ? "text-gray-400" : "text-gray-800"
          }`}
        >
          {label}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-400 transition-transform duration-150 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Date Button Component
interface DateBtnProps {
  date: string | null;
  onClick: () => void;
  placeholder: string;
  error?: string;
}

export const DateBtn: React.FC<DateBtnProps> = ({
  date,
  onClick,
  placeholder,
  error,
}) => {
  return (
    <div className="w-full">
      <button
        type="button"
        className={`w-full px-4 py-3 rounded-xl border ${
          error ? "border-red-500" : "border-gray-200"
        } focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-200" : "focus:ring-purple-200"
        } flex items-center justify-between transition-all duration-150`}
        onClick={onClick}
      >
        <span className={`${!date ? "text-gray-400" : "text-gray-800"}`}>
          {date || placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Logo Tile Component
interface LogoTileProps {
  logo?: string | null;
  onClick: () => void;
  onLongPress?: () => void;
}

export const LogoTile: React.FC<LogoTileProps> = ({
  logo,
  onClick,
  onLongPress,
}) => {
  // For long press detection
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const [pressing, setPressing] = React.useState(false);

  const handleMouseDown = () => {
    setPressing(true);
    timer.current = setTimeout(() => {
      if (onLongPress) onLongPress();
      setPressing(false);
    }, 800);
  };

  const handleMouseUp = () => {
    if (pressing && timer.current) {
      clearTimeout(timer.current);
      setPressing(false);
      onClick();
    }
  };

  const handleMouseLeave = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      setPressing(false);
    }
  };

  return (
    <div
      className="flex items-center gap-3"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseLeave}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
        {logo ? (
          <img
            src={logo}
            alt="Project Logo"
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        )}
      </div>
      <button
        type="button"
        className="text-sm text-purple-600 hover:text-purple-700 transition-colors duration-150"
        onClick={onClick}
      >
        {t("changeLogo")}
      </button>
    </div>
  );
};

// Primary CTA Button
interface PrimaryCTAProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const PrimaryCTA: React.FC<PrimaryCTAProps> = ({
  isLoading,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`w-full bg-purple-600 text-white rounded-xl py-4 font-semibold transition-all duration-150 
        ${
          disabled || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-purple-700 active:scale-95"
        }
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="opacity-75">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
