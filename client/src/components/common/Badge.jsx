import React from 'react';

export const Badge = ({ variant = 'default', size = 'sm', children, className = '' }) => {
  const styles = {
    // Task & Project Statuses
    todo: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    in_progress: 'bg-cyan-500/10 text-[#22D3EE] border-cyan-500/30',
    in_review: 'bg-purple-500/10 text-[#8B5CF6] border-purple-500/30',
    completed: 'bg-emerald-500/10 text-[#34D399] border-emerald-500/30',
    planning: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    active: 'bg-cyan-500/10 text-[#22D3EE] border-cyan-500/30',
    on_hold: 'bg-amber-500/10 text-[#FBBF24] border-amber-500/30',

    // Priorities
    low: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    medium: 'bg-amber-500/10 text-[#FBBF24] border-amber-500/30',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    urgent: 'bg-rose-500/10 text-[#FB7185] border-rose-500/30 animate-pulse',

    // General
    default: 'bg-[#17233B] text-[#94A3B8] border-[#263449]',
    primary: 'bg-purple-500/10 text-[#8B5CF6] border-purple-500/30',
    success: 'bg-emerald-500/10 text-[#34D399] border-emerald-500/30',
    warning: 'bg-amber-500/10 text-[#FBBF24] border-amber-500/30',
    danger: 'bg-rose-500/10 text-[#FB7185] border-rose-500/30',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const formattedVariant = (variant || '').toLowerCase().replace(/[\s-]/g, '_');
  const variantClass = styles[formattedVariant] || styles.default;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium uppercase tracking-wider ${sizes[size] || sizes.sm} ${variantClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {children}
    </span>
  );
};
