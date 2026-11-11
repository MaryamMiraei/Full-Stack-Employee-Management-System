import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  type,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "text-white bg-indigo-500 hover:bg-indigo-600",
    secondary: "bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      className={`
        disabled:cursor-not-allowed disabled:opacity-50 rounded-sm text-sm tracking-tight px-3 py-2 font-medium drop-shadow-xl cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
