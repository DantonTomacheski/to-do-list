import React from "react";
import { useTranslation } from "react-i18next";
import WelcomeIllustration from "../atoms/WelcomeIllustration";

interface WelcomeHeaderProps {
  className?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ className = "" }) => {
  const { t } = useTranslation();

  return (
    <div className={`text-center ${className}`}>
      <div className="flex justify-center mb-6">
        <WelcomeIllustration size="lg" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        {t("welcomeTitle")}
      </h1>
      <p className="text-gray-600 max-w-md mx-auto">{t("welcomeSubtitle")}</p>
    </div>
  );
};

export default WelcomeHeader;
