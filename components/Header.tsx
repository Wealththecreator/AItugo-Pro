import React from 'react';
import { LogoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-950/80 backdrop-blur-sm border-b border-slate-900/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-brand-orange/30 blur-3xl" />
              <LogoIcon className="relative w-12 h-12 text-brand-orange drop-shadow-[0_0_20px_rgba(255,122,0,0.6)]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                AITugo Intelligence
              </h1>
              <p className="text-sm sm:text-base text-slate-400 font-medium">
                Turning the AI signal into strategic leverage for creators & entrepreneurs.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl px-4 py-3">
              <p className="uppercase tracking-[0.25em] text-brand-orange text-[0.6rem]">Learn</p>
              <p className="mt-1 font-semibold text-slate-100">AI Skills</p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl px-4 py-3">
              <p className="uppercase tracking-[0.25em] text-brand-orange text-[0.6rem]">Scan</p>
              <p className="mt-1 font-semibold text-slate-100">Signals</p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl px-4 py-3">
              <p className="uppercase tracking-[0.25em] text-brand-orange text-[0.6rem]">Ship</p>
              <p className="mt-1 font-semibold text-slate-100">Products</p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl px-4 py-3">
              <p className="uppercase tracking-[0.25em] text-brand-orange text-[0.6rem]">Scale</p>
              <p className="mt-1 font-semibold text-slate-100">Revenue</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
