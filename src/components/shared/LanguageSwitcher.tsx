"use client";

import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = () => {
    const nextLanguage = i18n.language === "fa" ? "en" : "fa";

    void i18n.changeLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = nextLanguage === "fa" ? "rtl" : "ltr";
  };

  return (
    <button
      onClick={changeLanguage}
      className="font-medium px-2 py-1 border border-gray-300 text-gray-400 rounded-xl cursor-pointer"
    >
      {i18n.language === "fa" ? "English" : "فارسی"}
    </button>
  );
};

export default LanguageSwitcher;
