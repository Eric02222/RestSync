import React, { useState } from 'react';
import { useAuth } from '../../context/context';
import { userService } from '../../services/user.service';
import { toast } from 'react-toastify';
import {
  User,
  Mail,
  Shield,
  Lock,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const roleLabel = (tipo) => {
  if (tipo === 'admin') return 'Administrador';
  if (tipo === 'medico') return 'Médico / Cuidador';
  if (tipo === 'familiar') return 'Familiar';
  return tipo;
};

const roleColor = (tipo) => {
  if (tipo === 'admin') return 'bg-red-50 text-red-700 border-red-200';
  if (tipo === 'medico') return 'bg-blue-50 text-blue-700 border-blue-200';
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

const Perfil = () => {
  const { user, setUser } = useAuth();

  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [submittingInfo, setSubmittingInfo] = useState(false);
  const [submittingSenha, setSubmittingSenha] = useState(false);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (!nome || !email) {
      toast.warning('Nome e e-mail são obrigatórios.');
      return;
    }
    setSubmittingInfo(true);
    try {
      await userService.editUser(user.sub, { nome, email });
      // Update local auth context
      const updatedUser = { ...user, nome, email };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Informações atualizadas com sucesso!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao atualizar informações.');
    } finally {
      setSubmittingInfo(false);
    }
  };

  const handleUpdateSenha = async (e) => {
    e.preventDefault();
    if (!novaSenha || novaSenha.length < 6) {
      toast.warning('A nova senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }
    setSubmittingSenha(true);
    try {
      await userService.editUser(user.sub, { nome, email, senha: novaSenha });
      toast.success('Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao alterar senha.');
    } finally {
      setSubmittingSenha(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/70 border border-slate-200/80 p-6 rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl font-bold shadow-md shadow-blue-500/20 flex-shrink-0">
          {user?.nome?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{user?.nome}</h2>
          <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mt-2 ${roleColor(user?.tipo_usuario)}`}>
            <Shield className="h-3 w-3 mr-1" />
            {roleLabel(user?.tipo_usuario)}
          </span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">Sessão Ativa</span>
        </div>
      </div>

      {/* Personal Info Form */}
      <div className="bg-white/70 border border-slate-200/80 rounded-2xl shadow-sm p-6 backdrop-blur-sm">
        <div className="mb-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <User className="h-4 w-4 mr-2 text-blue-600" />
            Informações Pessoais
          </h3>
          <p className="text-xs text-slate-500 mt-1">Atualize seu nome e e-mail de acesso</p>
        </div>
        <form onSubmit={handleUpdateInfo} className="space-y-4">
          <Input
            label="Nome Completo"
            id="perfil-nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome completo"
          />
          <Input
            label="E-mail"
            id="perfil-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
          <div>
            <label className="block text-sm font-semibold text-slate-700 tracking-wide mb-1.5">
              Perfil de Acesso
            </label>
            <div className={`inline-flex items-center rounded-xl border px-4 py-2.5 text-sm font-semibold ${roleColor(user?.tipo_usuario)}`}>
              <Shield className="h-4 w-4 mr-2" />
              {roleLabel(user?.tipo_usuario)}
              <span className="ml-2 text-xs font-medium opacity-60">(não editável)</span>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={submittingInfo}
              className="shadow-md shadow-blue-500/10 cursor-pointer"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações
            </Button>
          </div>
        </form>
      </div>

      {/* Password Form */}
      <div className="bg-white/70 border border-slate-200/80 rounded-2xl shadow-sm p-6 backdrop-blur-sm">
        <div className="mb-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <Lock className="h-4 w-4 mr-2 text-blue-600" />
            Alterar Senha
          </h3>
          <p className="text-xs text-slate-500 mt-1">Escolha uma senha forte com pelo menos 6 caracteres</p>
        </div>
        <form onSubmit={handleUpdateSenha} className="space-y-4">
          <div className="relative">
            <Input
              label="Nova Senha"
              id="perfil-nova-senha"
              type={showSenha ? 'text' : 'password'}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Input
            label="Confirmar Nova Senha"
            id="perfil-confirmar-senha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="••••••••"
          />
          {novaSenha && confirmarSenha && (
            <p className={`text-xs font-semibold ${novaSenha === confirmarSenha ? 'text-emerald-600' : 'text-red-500'}`}>
              {novaSenha === confirmarSenha ? '✓ As senhas coincidem' : '✗ As senhas não coincidem'}
            </p>
          )}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={submittingSenha}
              className="shadow-md shadow-blue-500/10 cursor-pointer"
            >
              <Lock className="h-4 w-4 mr-2" />
              Alterar Senha
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Perfil;
