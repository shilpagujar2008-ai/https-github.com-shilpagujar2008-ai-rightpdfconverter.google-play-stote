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
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} overflow-hidden shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30 flex-shrink-0 relative group transition-transform hover:scale-105`}
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
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">
              RIGHT<span className="text-blue-600 dark:text-blue-400 font-black">PDF</span>
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase -mt-1">
            Converter PRO
          </span>
        </div>
      )}
    </div>
  );
};
