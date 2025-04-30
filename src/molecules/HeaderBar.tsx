import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackIconBtn from '../atoms/BackIconBtn';
import PageTitle from '../atoms/PageTitle';
import LanguageSwitcher from '../atoms/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface HeaderBarProps {
  title: string;
  onBack?: () => void; // Made optional since we'll use default navigation
  titleId?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  onBack,
  titleId,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white">
      <BackIconBtn onClick={handleBackClick} ariaLabel={t('back')} />
      <PageTitle id={titleId}>{title}</PageTitle>
      <LanguageSwitcher />
    </div>
  );
};

export default HeaderBar;
