import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99] font-sans';

  const variants = {
    primary: 'bg-[#5B5FEF] hover:bg-[#484BD1] active:bg-[#383AB8] text-white shadow-sm hover:shadow focus:ring-[#5B5FEF]',
    secondary: 'bg-[#F0EFFF] hover:bg-[#E4E2FF] text-[#5B5FEF] border border-[#E4E2FF] focus:ring-[#5B5FEF]',
    outline: 'bg-white hover:bg-[#F7F9FC] text-[#202B42] border border-[#E5EAF2] shadow-subtle hover:border-[#D1D8E2] focus:ring-[#5B5FEF]',
    danger: 'bg-rose-50 hover:bg-rose-100 text-[#DC5265] border border-rose-200 focus:ring-[#DC5265]',
    ghost: 'bg-transparent hover:bg-[#F0EFFF] text-[#68758B] hover:text-[#5B5FEF] focus:ring-[#5B5FEF]',
    cyan: 'bg-[#EAF2FF] hover:bg-[#D9EAFE] text-[#3984E8] border border-[#BFDBFE] focus:ring-[#3984E8]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 gap-2 rounded-xl',
    lg: 'text-base px-5 py-2.5 gap-2.5 rounded-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" strokeWidth={2.2} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
