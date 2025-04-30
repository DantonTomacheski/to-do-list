import React from 'react';
import BackIconBtn from '../atoms/BackIconBtn';
import PageTitle from '../atoms/PageTitle';
import { useTranslation } from 'react-i18next';

interface HeaderBarProps {
  title: string;
  onBack: () => void;
  showBell?: boolean;
  onBellClick?: () => void;
  titleId?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  onBack,
  showBell = false,
  onBellClick,
  titleId,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-4 bg-white">
      <BackIconBtn onClick={onBack} ariaLabel={t('back')} />
      <PageTitle id={titleId}>{title}</PageTitle>
      
      {showBell && (
        <button
          className="w-6 h-6 p-1 rounded-full active:bg-black/10 transition-colors duration-150"
          onClick={onBellClick}
          aria-label={t('notifications')}
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      )}

      {!showBell && <div className="w-6" />} {/* Spacer for alignment */}
    </div>
  );
};

export default HeaderBar;
