import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const BackBtn: React.FC<{ to: string }> = ({ to }) => {
  return (
    <Link
      to={to}
      className="w-8 h-8 flex items-center justify-center text-gray-700 active:bg-black/10 rounded-full"
      aria-label="Go back"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
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
    </Link>
  );
};

export const NotifBell: React.FC = () => {
  return (
    <button
      className="w-8 h-8 flex items-center justify-center text-gray-700 active:bg-black/10 rounded-full relative"
      aria-label="Notifications"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {/* Notification badge would go here if needed */}
    </button>
  );
};

export const PageTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <h1
      id="projectTitle"
      className="text-lg font-semibold truncate flex-1 px-3"
    >
      {title}
    </h1>
  );
};

interface DayChipProps {
  date: Date;
  isActive: boolean;
  onClick: () => void;
}

export const DayChip: React.FC<DayChipProps> = ({ date, isActive, onClick }) => {
  // Format the day name and number
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  const dayNumber = date.getDate();
  const isToday = new Date().getDate() === dayNumber &&
    new Date().getMonth() === date.getMonth() &&
    new Date().getFullYear() === date.getFullYear();

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center px-4 py-2 rounded-2xl transition-colors
        ${isActive ? 'bg-purple-600 text-white scale-105' : 'bg-gray-50 text-gray-800'}
        ${isToday && !isActive ? 'border border-purple-300' : ''}
      `}
    >
      <span className="text-xs font-medium">{dayName}</span>
      <span className="text-base font-semibold">{dayNumber}</span>
    </button>
  );
};

import { TaskStatus as StoreTaskStatus } from '../store/taskStore';

// Extended TaskStatus that includes 'All' for filtering
export type TaskStatus = StoreTaskStatus | 'All';

interface StatusChipProps {
  status: TaskStatus;
  isActive: boolean;
  onClick: () => void;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-1 rounded-full text-sm font-medium transition-colors
        ${isActive
          ? 'bg-purple-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-purple-100'}
      `}
    >
      {status}
    </button>
  );
};

export const ClockIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 text-purple-600/70"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export const getStatusColor = (status: Exclude<TaskStatus, 'All'>) => {
  switch (status) {
    case 'To-do':
      return 'bg-blue-100 text-blue-800';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'Done':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface BadgeProps {
  status: Exclude<TaskStatus, 'All'>;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  return (
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusColor(status)}`}
    >
      {status}
    </span>
  );
};

export const FabAdd: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [fabStyle, setFabStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const updateFabPosition = () => {
      const screenWidth = window.innerWidth;
      const contentMaxWidth = 900; // Max width set in index.css
      const fabOffset = 16; // Equivalent to Tailwind's 'right-4' (1rem)

      if (screenWidth <= contentMaxWidth) {
        // On smaller screens, stick to the edge
        setFabStyle({ right: `${fabOffset}px` });
      } else {
        // On wider screens, calculate offset from content edge
        const margin = (screenWidth - contentMaxWidth) / 2;
        setFabStyle({ right: `${margin + fabOffset}px` });
      }
    };

    updateFabPosition(); // Initial calculation
    window.addEventListener("resize", updateFabPosition);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", updateFabPosition);
  }, []);

  return (
    <button
      // Removed fixed horizontal positioning classes (right-4)
      className="w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg active:scale-90 transition transform fixed bottom-20 z-10 flex items-center justify-center"
      style={fabStyle} // Apply dynamic style
      onClick={onClick}
      aria-label="Add new task"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
};
