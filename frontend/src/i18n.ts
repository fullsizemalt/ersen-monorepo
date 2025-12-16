import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEn from './locales/en/common.json';
import dashboardEn from './locales/en/dashboard.json';
import widgetsEn from './locales/en/widgets.json';

// Combine resources
const resources = {
    en: {
        common: commonEn,
        dashboard: dashboardEn,
        widgets: widgetsEn,
    },
    // Future languages will be added here
    // es: { ... }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        defaultNS: 'common',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes by default
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
