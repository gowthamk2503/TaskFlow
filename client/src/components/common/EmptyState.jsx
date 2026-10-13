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
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#263449] bg-[#111B30]/40 my-4">
      {Icon && (
        <div className="p-4 rounded-2xl bg-[#17233B] border border-[#263449] text-[#8B5CF6] mb-4 shadow-lg shadow-purple-500/5">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[#F8FAFC]">{title}</h3>
      <p className="text-sm text-[#94A3B8] max-w-sm mt-1 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
