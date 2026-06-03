import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const PrivateLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-300">
      {/* Premium Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Modern, Simple Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
          <p>© {new Date().getFullYear()} RestSync. Monitoramento inteligente para casas de repouso.</p>
          <p className="mt-2 md:mt-0">Desenvolvido como solução para idosos, atletas, pacientes e pessoas com arritimias cardíacas.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivateLayout;
