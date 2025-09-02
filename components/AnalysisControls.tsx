import React, { useState } from 'react';
import { BeakerIcon } from './icons';

interface AnalysisControlsProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export const AnalysisControls: React.FC<AnalysisControlsProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && url) {
        onAnalyze(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analyze Social Media Post</h2>
      <div>
        <label htmlFor="post-url" className="block text-sm font-semibold text-slate-700">
          Public Post URL
        </label>
        <input
          type="url"
          id="post-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 shadow-sm sm:text-sm focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange"
          placeholder="e.g., https://www.instagram.com/p/..."
          required
          aria-label="Social media post URL"
        />
        <p className="mt-2 text-xs text-slate-500">Paste a link from Instagram, TikTok, Twitter/X, etc.</p>
      </div>
      <button
        type="submit"
        disabled={isLoading || !url}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-md text-base font-semibold text-white bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <BeakerIcon className="w-5 h-5 text-brand-orange" />
            Analyze Post
          </>
        )}
      </button>
    </form>
  );
};