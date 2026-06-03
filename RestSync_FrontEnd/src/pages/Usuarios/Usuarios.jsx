import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { userService } from '../../services/user.service';
import { useAuth } from '../../context/context';
import { toast } from 'react-toastify';
import {
  UserCog,
  UserPlus,
  Search,
  Mail,
  Shield,
  Edit2,
  Trash2,
  X,
  Loader2,
  CreditCard,
  Stethoscope,
  Users,
  ShieldCheck,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const roleBadgeVariant = (tipo) => {
  if (tipo === 'admin') return 'danger';
  if (tipo === 'medico') return 'primary';
  return 'secondary';
};

const roleLabel = (tipo) => {
  if (tipo === 'admin') return 'Administrador';
  if (tipo === 'medico') return 'Médico / Cuidador';
  if (tipo === 'familiar') return 'Familiar';
  return tipo;
};

const roleIcon = (tipo) => {
  if (tipo === 'admin') return <ShieldCheck className="h-4 w-4 text-red-500" />;
  if (tipo === 'medico') return <Stethoscope className="h-4 w-4 text-blue-500" />;
  return <Users className="h-4 w-4 text-slate-400" />;
};

const Usuarios = () => {
  const { user: currentUser } = useAuth();
  const { users, loading, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('familiar');
  const [crm, setCrm] = useState('');

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setNome('');
    setEmail('');
    setSenha('');
    setTipoUsuario('familiar');
    setCrm('');
    setShowModal(true);
  };

  const openEditModal = (u) => {
    setIsEditMode(true);
    setEditingId(u.id);
    setNome(u.nome);
    setEmail(u.email);
    setSenha('');
    setTipoUsuario(u.tipo_usuario);
    setCrm(u.crm || '');
    setShowModal(true);
  };

  const openDeleteModal = (u) => {
    setDeletingUser(u);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !email || (!isEditMode && !senha)) {
      toast.warning('Preencha todos os campos obrigatórios.');
      return;
    }
    setSubmitting(true);
    try {
      if (isEditMode) {
        const payload = { nome, email, tipo_usuario: tipoUsuario };
        if (senha) payload.senha = senha;
        if (tipoUsuario === 'medico' && crm) payload.crm = crm;
        await userService.editUser(editingId, payload);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        const payload = { nome, email, senha, tipo_usuario: tipoUsuario };
        if (tipoUsuario === 'medico' && crm) payload.crm = crm;
        await userService.createUser(payload);
        toast.success('Usuário cadastrado com sucesso!');
      }
      closeModal();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar usuário.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setSubmitting(true);
    try {
      await userService.deleteUser(deletingUser.id);
      toast.success('Usuário excluído com sucesso!');
      closeModal();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao excluir usuário.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = users.filter((u) =>
    String(u.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(u.tipo_usuario || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm backdrop-blur-sm transition-colors duration-300">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <UserCog className="mr-3 h-6 w-6 text-blue-600 dark:text-blue-400" />
            Gestão de Usuários
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Cadastre, edite e gerencie todos os usuários do sistema
          </p>
        </div>
        <Button
          onClick={openAddModal}
          variant="primary"
          className="flex items-center text-xs py-2.5 px-4 shadow-md shadow-blue-500/10 dark:shadow-blue-900/20 cursor-pointer"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Usuário
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, email ou perfil..."
          className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 py-2.5 pl-10 pr-4 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-xs font-semibold"
        />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Administradores', count: users.filter(u => u.tipo_usuario === 'admin').length, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' },
          { label: 'Médicos / Cuidadores', count: users.filter(u => u.tipo_usuario === 'medico').length, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30' },
          { label: 'Familiares', count: users.filter(u => u.tipo_usuario === 'familiar').length, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/10 border-slate-100 dark:border-slate-800/30' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl border p-4 ${stat.bg} text-center transition-colors duration-300`}>
            <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.count}</p>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading && users.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
          <UserCog className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhum usuário encontrado</h3>
          <p className="text-xs text-slate-400 mt-1">Tente alterar os termos de busca ou cadastre um novo usuário.</p>
        </div>
      ) : (
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/85 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Perfil</th>
                  <th className="px-6 py-4">CRM</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex-shrink-0 transition-colors">
                          {roleIcon(u.tipo_usuario)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{u.nome}</p>
                          <p className="text-[10px] text-slate-400">ID: #{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        u.tipo_usuario === 'admin' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/50' :
                        u.tipo_usuario === 'medico' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50' :
                        'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}>
                        {roleLabel(u.tipo_usuario)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {u.crm ? (
                        <div className="flex items-center space-x-1">
                          <CreditCard className="h-3 w-3 text-slate-400" />
                          <span>{u.crm}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-800 transition-colors duration-200 cursor-pointer"
                          title="Editar usuário"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(u)}
                          disabled={u.id === currentUser?.sub}
                          className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-red-50 dark:bg-red-900/20 hover:bg-white dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-800 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title={u.id === currentUser?.sub ? 'Não é possível excluir sua própria conta' : 'Excluir usuário'}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-scale-up">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              {isEditMode ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome Completo"
                id="user-nome"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João da Silva"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <Input
                label="E-mail"
                id="user-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: joao@restsync.com"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <Input
                label={isEditMode ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                id="user-senha"
                type="password"
                required={!isEditMode}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder={isEditMode ? '••••••••' : 'Mínimo 6 caracteres'}
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <div>
                <label htmlFor="user-tipo" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide mb-1.5">
                  Perfil de Acesso <span className="text-red-500">*</span>
                </label>
                <select
                  id="user-tipo"
                  value={tipoUsuario}
                  onChange={(e) => setTipoUsuario(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                >
                  <option value="familiar">Familiar</option>
                  <option value="medico">Médico / Cuidador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              {tipoUsuario === 'medico' && (
                <Input
                  label="CRM (opcional)"
                  id="user-crm"
                  type="number"
                  value={crm}
                  onChange={(e) => setCrm(e.target.value)}
                  placeholder="Ex: 123456"
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              )}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <Button onClick={closeModal} variant="outline" className="cursor-pointer dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  className="shadow-md shadow-blue-500/10 dark:shadow-blue-900/20 cursor-pointer"
                >
                  {isEditMode ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-scale-up">
            <button onClick={closeModal} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Excluir Usuário?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Você está prestes a excluir <span className="font-bold text-slate-800 dark:text-slate-200">{deletingUser.nome}</span>. Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <Button onClick={closeModal} variant="outline" className="cursor-pointer dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                loading={submitting}
                className="shadow-md shadow-red-500/10 dark:shadow-red-900/20 cursor-pointer"
              >
                Sim, excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
