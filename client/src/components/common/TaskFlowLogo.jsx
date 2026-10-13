import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const TaskFlowLogo = ({
  size = 'md',
  showBadge = true,
  to,
  className = '',
}) => {
  const { isAuthenticated } = useAuth();
  const destination = to || (isAuthenticated ? '/dashboard' : '/login');

  const iconSizes = {
    sm: 'w-7 h-7 text-sm rounded-lg',
    md: 'w-8 h-8 sm:w-9 sm:h-9 text-base rounded-xl',
    lg: 'w-10 h-10 sm:w-11 sm:h-11 text-lg rounded-2xl',
  };

  const lucideSizes = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5 sm:w-5 sm:h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-[19px] sm:text-[20px] font-bold tracking-tight',
    lg: 'text-2xl font-bold tracking-tight',
  };

  return (
    <Link
      to={destination}
      className={`inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 select-none ${className}`}
      title="TaskFlow"
    >
      {/* Brand Icon: Rounded Square with Task Checkmark */}
      <div
        className={`bg-[#5B5FEF] text-white flex items-center justify-center shrink-0 shadow-sm ${iconSizes[size] || iconSizes.md}`}
      >
        <CheckSquare className={lucideSizes[size] || lucideSizes.md} strokeWidth={2.4} />
      </div>

      {/* Wordmark and Optional Badge */}
      <div className="flex items-center gap-1.5">
        <span className={`text-[#202B42] ${textSizes[size] || textSizes.md}`}>
          TaskFlow
        </span>
        {showBadge && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#F0EFFF] text-[#5B5FEF] rounded-md border border-[#E4E2FF]">
            Pro
          </span>
        )}
      </div>
    </Link>
  );
};
