import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#E5EAF2] bg-white shadow-subtle my-4 font-sans">
      {Icon && (
        <div className="p-4 rounded-2xl bg-[#F0EFFF] border border-[#E4E2FF] text-[#5B5FEF] mb-4 shadow-subtle">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-base sm:text-lg font-bold text-[#202B42]">{title}</h3>
      <p className="text-sm text-[#68758B] max-w-sm mt-1.5 mb-6 font-medium leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
