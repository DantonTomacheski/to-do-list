import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  illustration?: 'rocket' | 'calendar' | 'task';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  illustration = 'rocket'
}) => {
  // Translation is handled by parent components passing in translated strings
  // const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 h-[calc(100vh-240px)]">
      {/* Illustration based on type */}
      <div className="w-48 h-48 mb-6">
        {illustration === 'rocket' && (
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M100 20C60 20 40 60 40 100C40 140 60 180 100 180C140 180 160 140 160 100C160 60 140 20 100 20Z" fill="#F3F4F6"/>
            <path d="M105 65C105 62.2386 107.239 60 110 60H120C122.761 60 125 62.2386 125 65V95C125 97.7614 122.761 100 120 100H110C107.239 100 105 97.7614 105 95V65Z" fill="#D1D5DB"/>
            <path d="M75 65C75 62.2386 77.2386 60 80 60H90C92.7614 60 95 62.2386 95 65V95C95 97.7614 92.7614 100 90 100H80C77.2386 100 75 97.7614 75 95V65Z" fill="#D1D5DB"/>
            <path d="M90 110H110L120 140H80L90 110Z" fill="#9CA3AF"/>
            <path d="M85 140H115L110 150H90L85 140Z" fill="#6B7280"/>
            <path d="M90 150H110L105 160H95L90 150Z" fill="#4B5563"/>
            <circle cx="100" cy="50" r="30" fill="#A855F7"/>
            <path d="M100 40L110 60H90L100 40Z" fill="#FFFFFF"/>
          </svg>
        )}
        
        {illustration === 'calendar' && (
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="40" y="50" width="120" height="120" rx="10" fill="#F3F4F6"/>
            <rect x="50" y="70" width="100" height="90" rx="5" fill="#FFFFFF"/>
            <rect x="60" y="30" width="5" height="30" rx="2.5" fill="#9CA3AF"/>
            <rect x="135" y="30" width="5" height="30" rx="2.5" fill="#9CA3AF"/>
            <rect x="50" y="50" width="100" height="10" fill="#A855F7"/>
            <circle cx="70" cy="90" r="5" fill="#A855F7"/>
            <circle cx="100" cy="90" r="5" fill="#A855F7"/>
            <circle cx="130" cy="90" r="5" fill="#A855F7"/>
            <circle cx="70" cy="110" r="5" fill="#A855F7"/>
            <circle cx="100" cy="110" r="5" fill="#A855F7"/>
            <circle cx="130" cy="110" r="5" fill="#A855F7"/>
            <circle cx="70" cy="130" r="5" fill="#A855F7"/>
            <circle cx="100" cy="130" r="5" fill="#A855F7"/>
            <circle cx="130" cy="130" r="5" fill="#A855F7"/>
          </svg>
        )}
        
        {illustration === 'task' && (
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="40" y="40" width="120" height="120" rx="10" fill="#F3F4F6"/>
            <rect x="50" y="60" width="100" height="90" rx="5" fill="#FFFFFF"/>
            <rect x="60" y="80" width="80" height="10" rx="5" fill="#E5E7EB"/>
            <rect x="60" y="100" width="60" height="10" rx="5" fill="#E5E7EB"/>
            <rect x="60" y="120" width="40" height="10" rx="5" fill="#E5E7EB"/>
            <circle cx="150" cy="50" r="20" fill="#A855F7"/>
            <path d="M142 50L148 56L158 46" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-xs">{description}</p>
      
      <button
        className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 active:scale-95 transition transform"
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default EmptyState;
