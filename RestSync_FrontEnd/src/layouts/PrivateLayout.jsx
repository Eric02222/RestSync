import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const PrivateLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Premium Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Modern, Simple Footer */}
      <footer className="border-t border-slate-200/60 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-medium tracking-wide">
          <p>© {new Date().getFullYear()} RestSync. Monitoramento inteligente para casas de repouso.</p>
          <p className="mt-2 md:mt-0">Desenvolvido como solução para idosos, atletas, pacientes e pessoas com arritimias cardíacas.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivateLayout;
