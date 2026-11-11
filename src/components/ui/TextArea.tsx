import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={id}
          className={`
            w-full resize-y px-2 py-1 border-2 border-slate-500/10 rounded-md
            focus-within:ring-1 focus-within:ring-indigo-500/50 outline-none
            font-medium text-[12px] bg-slate-100
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
        />

        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
