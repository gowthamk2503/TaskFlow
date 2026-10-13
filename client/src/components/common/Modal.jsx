import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#202B42]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-white border border-[#E5EAF2] rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden z-10 transition-all transform animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col text-[#202B42]`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E5EAF2]">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#202B42] tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs sm:text-sm text-[#68758B] mt-1 font-medium">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
