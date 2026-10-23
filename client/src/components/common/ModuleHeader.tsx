import React from 'react';

interface ModuleHeaderProps {
  children: React.ReactNode;
  className?: string;
  tabs?: React.ReactNode;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({ children, className = '', tabs }) => {
  return (
    <div className="sticky top-0 z-20 bg-neutral-100 pt-4 sm:pt-6 pb-2 -mt-4 sm:-mt-6 space-y-3">
      <div className={`bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs ${className}`}>
        {children}
      </div>
      {tabs && (
        <div className="bg-neutral-100">
          {tabs}
        </div>
      )}
    </div>
  );
};
