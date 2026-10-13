import React from 'react';

export const Badge = ({ variant = 'default', size = 'sm', children, className = '' }) => {
  const styles = {
    // Task & Project Statuses
    todo: 'bg-slate-100 text-[#68758B] border-slate-200',
    in_progress: 'bg-[#EAF2FF] text-[#3984E8] border-[#BFDBFE]',
    in_review: 'bg-[#F0EFFF] text-[#5B5FEF] border-[#E4E2FF]',
    completed: 'bg-[#E5F7EE] text-[#16A675] border-[#B8EED5]',
    planning: 'bg-[#F0EFFF] text-[#5B5FEF] border-[#E4E2FF]',
    active: 'bg-[#EAF2FF] text-[#3984E8] border-[#BFDBFE]',
    on_hold: 'bg-[#FFF1E5] text-[#D99118] border-[#FFE1CC]',

    // Priorities
    low: 'bg-[#EAF2FF] text-[#3984E8] border-[#BFDBFE]',
    medium: 'bg-[#FFF1E5] text-[#D99118] border-[#FFE1CC]',
    high: 'bg-orange-50 text-orange-600 border-orange-200',
    urgent: 'bg-rose-50 text-[#DC5265] border-rose-200 font-bold',

    // General
    default: 'bg-[#F7F9FC] text-[#68758B] border-[#E5EAF2]',
    primary: 'bg-[#F0EFFF] text-[#5B5FEF] border-[#E4E2FF]',
    success: 'bg-[#E5F7EE] text-[#16A675] border-[#B8EED5]',
    warning: 'bg-[#FFF1E5] text-[#D99118] border-[#FFE1CC]',
    danger: 'bg-rose-50 text-[#DC5265] border-rose-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  const formattedVariant = (variant || '').toLowerCase().replace(/[\s-]/g, '_');
  const variantClass = styles[formattedVariant] || styles.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wider select-none font-sans ${sizes[size] || sizes.sm} ${variantClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {children}
    </span>
  );
};
