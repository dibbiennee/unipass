import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body-sm text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-brand border border-neutral-200 bg-white px-4 py-2.5 text-body-md text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-10",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-caption text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
