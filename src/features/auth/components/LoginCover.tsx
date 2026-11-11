"use client"
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

const LoginCover = () => {
  const { t } = useTranslation();
  return (
    <div
      className="hidden md:flex w-1/2 min-h-screen bg-indigo-950  border-r border-slate-200"
      dir={i18n.language === "fa" ? "rtl" : "ltr"}
    >
      <div className="flex flex-col items-start justify-center p-12 lg:p-20">
        <h1 className="text-4xl lg:text-5xl font-medium text-white mb-6 leading-tight tracking-tight">
          {t("login.loginCover.title")}
        </h1>
        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
          {t("login.loginCover.description")}
        </p>
      </div>
    </div>
  );
};

export default LoginCover;
