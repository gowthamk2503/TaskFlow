import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E5EAF2] rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-card ${
        hoverEffect ? 'hover:border-[#D1D8E2] hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : ''
      } ${
        glow ? 'border-[#E4E2FF] ring-2 ring-[#5B5FEF]/15' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
