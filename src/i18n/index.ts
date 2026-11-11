import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fa from "../i18n/locales/fa.json";
import en from "../i18n/locales/en.json";

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      fa: { translation: fa },
      en: { translation: en },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
