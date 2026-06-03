import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/context';
import { userService } from '../../services/user.service';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  CreditCard,
  Camera,
  Save,
  Lock,
  Loader2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'react-toastify';

const Perfil = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Modals and form state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newSenha, setNewSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  // Profile data
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');

  // Sync state if user context updates
  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const roleLabel = (tipo) => {
    if (tipo === 'admin') return 'Administrador';
    if (tipo === 'medico') return 'Médico / Cuidador';
    if (tipo === 'familiar') return 'Familiar';
    return tipo;
  };

  const handleUpdatePassword = async () => {
    if (newSenha !== confirmSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }
    if (!newSenha) {
        toast.warning('A nova senha não pode estar vazia.');
        return;
    }

    const userId = user?.id || user?.sub;
    setLoading(true);
    try {
      await userService.editUser(userId, { nome, email, senha: newSenha });
      toast.success('Senha atualizada com sucesso!');
      setShowPasswordModal(false);
      setNewSenha('');
      setConfirmSenha('');
    } catch (err) {
      console.error('Erro ao atualizar senha:', err);
      toast.error('Erro ao atualizar senha.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Robustly find the user ID (try id then sub)
    const userId = user?.id || user?.sub;

    if (!userId) {
      toast.error('Erro de identificação do usuário. Tente fazer login novamente.');
      return;
    }

    if (!nome || !email) {
      toast.warning('Nome e e-mail são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const payload = { nome, email };
      
      await userService.editUser(userId, payload);
      
      // Update local auth context and storage
      const updatedUser = { ...user, nome, email };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      toast.error(err.response?.data?.message || 'Erro ao atualizar informações do perfil.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="animate-fade-in space-y-8">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 w-full bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-900 rounded-3xl" />
        <div className="absolute bottom-4 left-6 md:left-10 flex items-end space-x-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-black text-blue-600 dark:text-blue-400 overflow-hidden transition-colors shadow-xl">
              {user?.nome?.[0]?.toUpperCase() || 'U'}
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white dark:bg-slate-800 shadow-md text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-slate-100 dark:border-slate-700">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="pb-2">
            <h2 className="text-xl font-black text-white leading-none drop-shadow-sm">{user?.nome}</h2>
            <p className="text-xs font-bold text-blue-50 dark:text-blue-200 mt-1.5 flex items-center bg-blue-500/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
              <Shield className="h-3 w-3 mr-1.5 text-blue-100" />
              {roleLabel(user?.tipo_usuario)}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-sm backdrop-blur-sm transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Nome Completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                icon={User}
              />
              <Input
                label="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
              />
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                onClick={handleSave}
                variant="primary"
                className="flex items-center shadow-md shadow-blue-500/10 dark:shadow-blue-900/20 cursor-pointer"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Alterações
              </Button>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-sm backdrop-blur-sm transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center text-red-600 dark:text-red-400">
              <Lock className="mr-2 h-5 w-5" />
              Segurança
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Alterar Senha</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Recomendamos usar uma senha forte e única.</p>
              </div>
              <Button 
                onClick={() => setShowPasswordModal(true)}
                variant="outline" 
                className="text-xs px-4 py-2 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Atualizar Senha
              </Button>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 relative">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Alterar Senha</h3>
              <div className="space-y-4">
                <Input
                  label="Nova Senha"
                  type="password"
                  value={newSenha}
                  onChange={(e) => setNewSenha(e.target.value)}
                  icon={Lock}
                />
                <Input
                  label="Confirmar Senha"
                  type="password"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  icon={Lock}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button onClick={() => setShowPasswordModal(false)} variant="outline" className="cursor-pointer">Cancelar</Button>
                <Button onClick={handleUpdatePassword} variant="primary" loading={loading} className="cursor-pointer">Atualizar</Button>
              </div>
            </div>
          </div>
        )}

        {/* Account Details Widget */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl transition-colors duration-300">
            <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Detalhes da Conta</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">ID de Usuário</span>
                <span className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                  #{user?.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Membro desde</span>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-slate-400" />
                  Jan 2024
                </span>
              </div>
              {user?.crm && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">CRM Registro</span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center">
                    <CreditCard className="h-3 w-3 mr-1 text-slate-400" />
                    {user.crm}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-6 rounded-3xl transition-colors duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Shield className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Sessão Segura</p>
            </div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 leading-relaxed font-medium">
              Sua conexão está protegida por criptografia de ponta a ponta (AES-256).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
