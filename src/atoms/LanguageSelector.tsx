import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  const currentLanguage = i18n.language;

  const languages = [
    { code: "pt-BR", label: "Português" },
    { code: "en-US", label: "English" }
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className={`text-center ${className}`}>
      <p className="text-sm font-medium text-gray-700 mb-2">
        {t("selectLanguage")}
      </p>
      <div className="relative">
        <select
          value={currentLanguage}
          onChange={handleLanguageChange}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
          aria-label={t("selectLanguage")}
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
