import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  placeholderShow?: boolean;
}

const Select = ({
  icon,
  label,
  error,
  id,
  options,
  placeholder = "Select an option",
  placeholderShow = true,
  className = "",
  ...props
}: SelectProps) => {
  return (
    <div className="flex w-full flex-col">
      {label && (
        <div className="flex gap-2 items-center mb-2">
          <div className="text-slate-400">{icon}</div>
          <div>
            <label
              htmlFor={id}
              className=" block text-sm font-medium text-slate-700"
            >
              {label}
            </label>
          </div>
        </div>
      )}

      <select
        id={id}
        className={`rounded-md border-2 border-slate-500/10 bg-slate-100 px-2 py-2 text-[12px] font-medium outline-none focus:ring-1 focus:ring-indigo-500/50 ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      >
        {placeholderShow && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
