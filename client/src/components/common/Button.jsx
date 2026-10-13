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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B1020] disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'aurora-button-gradient text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 focus:ring-[#8B5CF6]',
    secondary: 'bg-[#17233B] hover:bg-[#1E2D4A] text-[#F8FAFC] border border-[#263449] focus:ring-[#22D3EE]',
    outline: 'bg-transparent hover:bg-[#17233B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#263449] focus:ring-[#8B5CF6]',
    danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-[#FB7185] border border-rose-500/30 focus:ring-[#FB7185]',
    ghost: 'bg-transparent hover:bg-[#17233B]/50 text-[#94A3B8] hover:text-[#F8FAFC] focus:ring-[#8B5CF6]',
    cyan: 'bg-cyan-500/10 hover:bg-cyan-500/20 text-[#22D3EE] border border-cyan-500/30 focus:ring-[#22D3EE]',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
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
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};
