import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  placeholderShow?: boolean;
}

const Select = ({
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
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
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
