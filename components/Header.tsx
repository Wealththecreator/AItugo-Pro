import React from 'react';
import { LogoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-50 text-center py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3">
          <LogoIcon className="w-10 h-10 sm:w-12 sm:h-12 text-brand-orange" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            ViralFlow
          </h1>
        </div>
        <p className="mt-2 text-md sm:text-lg font-medium text-slate-500">
          The Social Media Growth Genius
        </p>
      </div>
    </header>
  );
};