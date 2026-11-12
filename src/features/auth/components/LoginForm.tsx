"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useLogin from "../hooks/useLogin";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import i18n from "@/i18n";
import Link from "next/link";

type UserRole = "admin" | "employee";

interface ILoginFormProps {
  role: UserRole;
}

const LoginForm = ({ role }: ILoginFormProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  const { mutate: login, isPending, isError, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>();

  const handleLogin = (data: ILoginRequest) => {
    login(
      { ...data, role_type: `${role}` },
      {
        onSuccess: (response) => {
          if (response.user.role === "admin") {
            router.replace("/admin/dashboard");
          } else {
            router.replace("/employee/dashboard");
          }
        },
      },
    );
  };
  return (
    <div className="w-full md:w-1/2 relative overflow-y-auto min-h-screen">
      <div className="p-5 flex justify-end">
        <LanguageSwitcher />
      </div>
      <div
        className=" flex flex-col items-center justify-center p-2 sm:p-8 lg:p-12"
        dir={i18n.language === "fa" ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-md animate-fade-in">
          <Link
            href={"/login"}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-10 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
              aria-hidden="true"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            {t("login.share.buttonTitle")}
          </Link>
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium text-zinc-800">
              {t(`login.${role}.title`)}
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              {t(`login.${role}.description`)}
            </p>
          </div>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            {/* Email */}
            <Input
              id="email"
              label={t(`login.share.email`)}
              type="email"
              dir="ltr"
              placeholder="john@example.com"
              autoComplete="username"
              error={errors.email?.message}
              {...register("email", {
                required: t(`login.share.errorEmailRequired`),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t(`login.share.errorEmailValidation`),
                },
              })}
            />

            {/* Password */}
            <div className="relative">
              <Input
                id="password"
                label={t(`login.share.password`)}
                dir="ltr"
                type={isShowPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register("password", {
                  required: t(`login.share.errorPasswordRequired`),
                  minLength: {
                    value: 6,
                    message: t(`login.share.errorPasswordValidation`),
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setIsShowPassword((prev) => !prev)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 flex justify-end items-center"
                aria-label={isShowPassword ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon icon={isShowPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              disabled={isPending}
              className="min-w-full"
            >
              {isPending && (
                <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}

              {isPending
                ? t("login.share.submitting")
                : t("login.share.submit")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
