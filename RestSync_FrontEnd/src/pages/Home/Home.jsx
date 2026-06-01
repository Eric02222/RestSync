import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 text-white flex flex-col justify-between">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30">
            <HeartPulse className="h-6 w-6 animate-pulse text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Rest<span className="text-blue-400">Sync</span>
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2 rounded-xl text-sm font-medium border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm cursor-pointer"
        >
          Acessar Portal
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              🏥 Monitoramento de Saúde Confiável
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none text-slate-100">
              Tranquilidade para familiares, segurança para residentes.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              O RestSync conecta casas de repouso e familiares em tempo real, monitorando batimentos cardíacos, temperatura e pressão arterial de forma inteligente e contínua.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center px-6 py-3.5 rounded-xl bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:shadow-blue-600/40 transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer"
              >
                Acessar Plataforma
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Features Grid Panel */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-48 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-100">Tempo Real</h3>
                <p className="text-xs text-slate-400 mt-2">Dados vitais atualizados dinamicamente a cada 30 segundos.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-48 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-100">Alertas Críticos</h3>
                <p className="text-xs text-slate-400 mt-2">Detecção automática de anomalias cardíacas imediatas.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-48 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-100">Histórico Completo</h3>
                <p className="text-xs text-slate-400 mt-2">Tabelas e gráficos interativos de tendência de saúde.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-48 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-100">Gestão Simples</h3>
                <p className="text-xs text-slate-400 mt-2">Cadastro rápido de residentes para equipes de cuidadores.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 space-y-2 sm:space-y-0">
        <p>© {new Date().getFullYear()} RestSync. Desenvolvido para fins de apresentação acadêmica.</p>
        <p>RestSync Front-End MVP • Apple Health inspired</p>
      </footer>
    </div>
  );
};

export default Home;
