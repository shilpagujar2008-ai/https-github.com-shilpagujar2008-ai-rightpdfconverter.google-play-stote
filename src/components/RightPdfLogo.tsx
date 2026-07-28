import React from 'react';
import rightPdfImg from '../assets/images/rightpdf_logo_1785161490211.jpg';

interface RightPdfLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const RightPdfLogo: React.FC<RightPdfLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 sm:w-12 sm:h-12 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 rounded-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} overflow-hidden shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30 flex-shrink-0 relative group transition-transform hover:scale-105 bg-blue-600`}
      >
        <img
          src={rightPdfImg}
          alt="RightPDF Converter Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">
              RIGHT<span className="text-blue-600 dark:text-blue-400">PDF</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm uppercase tracking-wider">
              PRO
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase -mt-0.5">
            Converter
          </span>
        </div>
      )}
    </div>
  );
};

