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
      className={`bg-[#111B30] border border-[#263449] rounded-xl p-5 transition-all duration-200 ${
        hoverEffect ? 'hover:border-[#384c6c] hover:bg-[#14203a] hover:shadow-card cursor-pointer' : ''
      } ${
        glow ? 'shadow-glow-violet border-purple-500/40' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
