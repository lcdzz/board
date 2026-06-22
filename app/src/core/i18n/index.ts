import boardsEn from '@features/boards/locales/en.json';
import boardsFr from '@features/boards/locales/fr.json';
import homeEn from '@features/home/locales/en.json';
import homeFr from '@features/home/locales/fr.json';
import sharedEn from '@shared/locales/en.json';
import sharedFr from '@shared/locales/fr.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: { ...sharedEn, ...boardsEn, ...homeEn },
    },
    fr: {
      translation: { ...sharedFr, ...boardsFr, ...homeFr },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
