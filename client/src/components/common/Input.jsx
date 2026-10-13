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
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-[#94A3B8] flex items-center justify-between">
          <span>
            {label} {required && <span className="text-[#FB7185]">*</span>}
          </span>
        </label>
      )}

      <div className="relative rounded-lg">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full rounded-lg bg-[#0F172A] border ${
            error ? 'border-[#FB7185] focus:border-[#FB7185] focus:ring-[#FB7185]/30' : 'border-[#263449] focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/30'
          } text-[#F8FAFC] placeholder-[#64748B] text-sm px-3 py-2.5 ${
            Icon ? 'pl-9' : ''
          } focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:bg-[#111B30] ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-[#FB7185]">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#64748B]">{helperText}</p>
      ) : null}
    </div>
  );
};
