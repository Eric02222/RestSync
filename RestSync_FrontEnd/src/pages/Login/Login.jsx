import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/context';
import { toast } from 'react-toastify';
import { HeartPulse, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      toast.warning('Por favor, preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      await login(email, senha);
      toast.success('Login realizado com sucesso! Bem-vindo(a).');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error.response?.data?.message || 'Falha ao autenticar. Verifique suas credenciais.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 px-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Home
      </button>

      <div className="w-full max-w-md">
        {/* Logo Banner */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/25 mb-4">
            <HeartPulse className="h-7 w-7 animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Rest<span className="text-blue-600">Sync</span> Portal
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Insira suas credenciais para gerenciar residentes
          </p>
        </div>

        {/* Login Card Panel */}
        <div className="bg-white/80 border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100/50 backdrop-blur-md p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 tracking-wide">
                Endereço de E-mail
              </label>
              <div className="relative mt-2 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@restsync.com"
                  className="block w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="senha" className="block text-sm font-semibold text-slate-700 tracking-wide">
                  Senha de Acesso
                </label>
              </div>
              <div className="relative mt-2 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 hover:shadow-blue-700/20 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
