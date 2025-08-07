
import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const isLanguageLoaded = () => {
    return i18n.isInitialized;
  };

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    isLanguageLoaded,
    i18n
  };
};
