"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type UserRole = "admin" | "employee";

interface ILoginFormProps {
  role: UserRole;
}

const LoginForm = ({ role }: ILoginFormProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISigninData>();

//   const { mutate: login, isPending } = useMutation({
//     mutationFn: signin,
//     mutationKey: ["signin"],

//     onSuccess: (dataLogin) => {
//       localStorage.setItem("token", dataLogin.token);

//       const redirectPath =
//         role === "admin" ? "/admin/dashboard" : "/employee/dashboard";

//       router.push(redirectPath);
//     },
//   });

  const onSubmit = (data: ISigninData) => {
    // login({
    //   ...data,
    //   role_type: role,
    // });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <Input
        id="email"
        label={t(`login.${role}.email`)}
        type="email"
        dir="ltr"
        placeholder="john@example.com"
        autoComplete="username"
        error={errors.email?.message}
        {...register("email", {
          required: t(`login.${role}.errorEmailRequired`),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t(`login.${role}.errorEmailValidation`),
          },
        })}
      />

      {/* Password */}
      <div className="relative">
        <Input
          id="password"
          label={t(`login.${role}.password`)}
          dir="ltr"
          type={isShowPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password", {
            required: t(`login.${role}.errorPasswordRequired`),
            minLength: {
              value: 6,
              message: t(`login.${role}.errorPasswordValidation`),
            },
          })}
        />

        <button
          type="button"
          onClick={() => setIsShowPassword((prev) => !prev)}
          className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
          aria-label={isShowPassword ? "Hide password" : "Show password"}
        >
          <FontAwesomeIcon icon={isShowPassword ? faEyeSlash : faEye} />
        </button>
      </div>

      {/* Submit */}
      <Button type="submit" fullWidth disabled={isPending} className="py-3">
        {isPending && (
          <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}

        {isPending ? t(`login.${role}.submitting`) : t(`login.${role}.submit`)}
      </Button>
    </form>
  );
};

export default LoginForm;
