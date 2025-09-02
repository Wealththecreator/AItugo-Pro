import React from 'react';

interface LoaderProps {
  message?: string;
  subMessage?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  message = "Generating Virality...", 
  subMessage = "Our AI is crafting your content. This might take a moment." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[500px]">
      <div className="relative w-24 h-24">
        {/* Pulsing Core */}
        <div className="absolute inset-0 bg-brand-orange/20 rounded-full animate-pulse"></div>
        {/* Orbiting Elements */}
        <div className="absolute w-full h-full animate-[spin_4s_linear_infinite]">
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-brand-orange rounded-full -translate-x-1/2"></div>
        </div>
        <div className="absolute w-full h-full animate-[spin_5s_linear_infinite_reverse]">
          <div className="absolute top-1/2 left-0 w-4 h-4 bg-slate-800 rounded-full -translate-y-1/2"></div>
        </div>
         <div className="absolute w-full h-full animate-[spin_3s_linear_infinite]">
           <div className="absolute bottom-0 right-1/2 w-2 h-2 bg-slate-500 rounded-full translate-x-1/2"></div>
        </div>
      </div>
      <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-8">{message}</h2>
      <p className="text-slate-500 mt-2 text-center max-w-xs">{subMessage}</p>
    </div>
  );
};