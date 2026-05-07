import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <label className="mb-2 text-sm font-bold tracking-wide text-gray-300 uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`bg-zinc-900 border ${
            error ? "border-primary" : "border-zinc-700"
          } text-white px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50 ${className}`}
          {...props}
        />
        {error && <span className="mt-1 text-xs text-primary">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
