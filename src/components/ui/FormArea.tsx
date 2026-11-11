import type { FormHTMLAttributes, ReactNode } from "react";

interface IFormProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

const FormArea = ({ title, children, icon }: IFormProps) => {
  return (
    <section className="border border-slate-200/70 shadow-2xl rounded-xl p-5 bg-white">
      <h1 className="text-base  font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
        {icon}
        {title}
      </h1>
      <div className="space-y-5">{children}</div>
    </section>
  );
};

export default FormArea;
