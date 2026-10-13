import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  required = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {label && (
        <label htmlFor={inputId} className="text-xs sm:text-sm font-semibold text-[#202B42] flex items-center justify-between">
          <span>
            {label} {required && <span className="text-[#DC5265]">*</span>}
          </span>
        </label>
      )}

      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#96A0B2]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full rounded-xl bg-white border ${
            error
              ? 'border-[#DC5265] focus:border-[#DC5265] focus:ring-[#DC5265]/20'
              : 'border-[#E5EAF2] focus:border-[#5B5FEF] focus:ring-[#5B5FEF]/15'
          } text-[#202B42] placeholder-[#96A0B2] text-sm px-3.5 py-2.5 ${
            Icon ? 'pl-10' : ''
          } focus:outline-none focus:ring-2 transition-all duration-150 disabled:opacity-60 disabled:bg-[#F7F9FC] font-medium shadow-subtle ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-[#DC5265] font-semibold">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#68758B]">{helperText}</p>
      ) : null}
    </div>
  );
};
