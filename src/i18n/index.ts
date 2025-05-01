import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ptBR from './pt-BR.json';
import enUS from './en-US.json';

const resources = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

i18n.use(initReactI18next).init({
  resources,
  lng: navigator.language && (navigator.language === 'pt-BR' || navigator.language === 'en-US') 
       ? navigator.language 
       : 'pt-BR', 
  fallbackLng: "pt-BR", 
  interpolation: {
    escapeValue: false, 
  },
});

export default i18n;