import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  return (
    <div className="w-full space-y-4 animate-pulse font-sans">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-subtle ${
            type === 'card' ? 'h-36' : 'h-16'
          } flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-[#F1F4F9] rounded-md w-1/3"></div>
            <div className="h-4 bg-[#F1F4F9] rounded-full w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-[#F1F4F9] rounded-md w-3/4"></div>
            <div className="h-3 bg-[#F1F4F9] rounded-md w-1/2"></div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-3 bg-[#F1F4F9] rounded-md w-20"></div>
            <div className="h-6 w-6 rounded-full bg-[#F1F4F9]"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
