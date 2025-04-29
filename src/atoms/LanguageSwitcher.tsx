import React from 'react'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher: React.FC = () => {
  const { i18n: i18nInstance } = useTranslation()
  
  const toggleLanguage = () => {
    const newLanguage = i18nInstance.language === 'pt-BR' ? 'en-US' : 'pt-BR'
    i18nInstance.changeLanguage(newLanguage)
  }
  
  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center text-xs text-gray-600 hover:text-gray-800 transition-colors"
      aria-label="Toggle language"
    >
      <span className="font-medium mr-1">{i18nInstance.language === 'pt-BR' ? '🇧🇷' : '🇺🇸'}</span>
      <span>{i18nInstance.language === 'pt-BR' ? 'PT' : 'EN'}</span>
    </button>
  )
}

export default LanguageSwitcher
