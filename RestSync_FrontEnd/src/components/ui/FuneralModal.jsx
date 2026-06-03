import React, { useEffect, useState } from 'react';
import { Skull, AlertTriangle, Zap, Flame, Radiation } from 'lucide-react';
import Button from './Button';

const FuneralModal = ({ isOpen }) => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setGlitch(prev => !prev);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-0 transition-colors duration-75 ${glitch ? 'bg-red-600' : 'bg-black'}`}>
      {/* Glitch Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uWUicG6A/giphy.gif')] bg-cover mix-blend-overlay" />
      
      <div className="relative z-10 w-full max-w-2xl p-8 text-center animate-pulse">
        {/* Critical Warning Icons */}
        <div className="flex justify-center gap-8 mb-8">
          <Radiation className="h-16 w-16 text-yellow-400 animate-spin" />
          <Skull className="h-24 w-24 text-white" />
          <Radiation className="h-16 w-16 text-yellow-400 animate-spin" />
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase mb-4 shadow-red-500 text-shadow-lg">
          CRITICAL <span className="text-yellow-400">FAILURE</span>
        </h1>
        
        <div className="bg-white text-black font-black text-2xl py-2 px-4 inline-block mb-8 skew-x-[-10deg]">
          SINAIS VITAIS INCOMPATÍVEIS COM A EXISTÊNCIA
        </div>

        <p className="text-xl md:text-2xl text-white font-bold mb-12 uppercase tracking-widest leading-tight">
          O residente atingiu o status de <span className="underline decoration-red-500">supernova</span> <br/> 
          ou foi de arrasta pra cima.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
          <Button
            onClick={() => window.open('https://www.google.com/search?q=funeraria+proxima+agora', '_blank')}
            variant="danger"
            className="h-20 text-xl font-black uppercase border-4 border-white animate-bounce flex items-center justify-center gap-3 cursor-pointer"
          >
            <Flame className="h-6 w-6" />
            AGENDAR FUNERAL
          </Button>

          <Button
            onClick={() => window.open('https://www.google.com/search?q=como+explicar+morte+ao+chefe', '_blank')}
            variant="outline"
            className="h-20 text-xl font-black uppercase border-4 border-white text-white hover:bg-white hover:text-black flex items-center justify-center gap-3 cursor-pointer"
          >
            <Zap className="h-6 w-6" />
            PEDIR DEMISSÃO
          </Button>
        </div>

        <div className="mt-12 space-y-2">
          <div className="flex justify-center gap-2">
            {[...Array(10)].map((_, i) => (
              <AlertTriangle key={i} className="h-6 w-6 text-yellow-400" />
            ))}
          </div>
          <p className="text-xs font-mono text-white/50 animate-pulse">
            ERRO: SYSTEM_RESIDENT_OVERHEATED_CORE_MELTDOWN // CODE: 0xDEADBEEF
          </p>
        </div>
      </div>

      {/* Extreme Flashing Borders */}
      <div className="absolute inset-0 border-[20px] border-yellow-400 pointer-events-none animate-ping opacity-30" />
      <div className="absolute inset-0 border-[40px] border-red-500 pointer-events-none animate-pulse opacity-20" />
    </div>
  );
};

export default FuneralModal;
