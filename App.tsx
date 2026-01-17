import React from 'react';
import { Header } from './components/Header';
import { IntelligenceDashboard } from './components/IntelligenceDashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <IntelligenceDashboard />
      </main>
      <footer className="text-center px-4 py-8 text-xs text-slate-500 border-t border-slate-900/60">
        <p>
          Built for the next wave of AI creators & entrepreneurs. Data refreshed manually from trusted public sources.
        </p>
      </footer>
    </div>
  );
};

export default App;
