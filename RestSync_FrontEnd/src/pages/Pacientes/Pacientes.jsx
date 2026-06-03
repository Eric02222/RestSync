import React, { useState } from 'react';
import { usePacientes } from '../../hooks/usePacientes';
import { pacienteService } from '../../services/paciente.service';
import { toast } from 'react-toastify';
import {
  Users,
  UserPlus,
  Search,
  Calendar,
  Edit2,
  Trash2,
  X,
  Loader2,
  PlusCircle,
  AlertCircle,
  MapPin,
  Phone,
  FileText,
  Fingerprint,
  User
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Pacientes = () => {
  const { pacientes, loading, refetch } = usePacientes();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingPaciente, setDeletingPaciente] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  
  // Virtual fields (stored in dados_vitais JSON)
  const [idade, setIdade] = useState('');
  const [genero, setGenero] = useState('feminino');
  const [observacao, setObservacao] = useState('');

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setNome('');
    setCpf('');
    setEndereco('');
    setTelefone('');
    setIdade('');
    setGenero('feminino');
    setObservacao('');
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setIsEditMode(true);
    setEditingId(p.id);
    setNome(p.nome);
    setCpf(p.cpf || '');
    setEndereco(p.endereco || '');
    setTelefone(p.telefone || '');
    
    // Parse dados_vitais if it exists
    let dv = {};
    try {
      dv = typeof p.dados_vitais === 'string' ? JSON.parse(p.dados_vitais) : (p.dados_vitais || {});
    } catch (e) {
      dv = {};
    }
    
    setIdade(dv.idade || '');
    setGenero(dv.genero || 'feminino');
    setObservacao(dv.observacao || '');
    setShowModal(true);
  };

  const openDeleteModal = (p) => {
    setDeletingPaciente(p);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setDeletingPaciente(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !cpf || !endereco || !telefone) {
      toast.warning('Preencha os campos obrigatórios: Nome, CPF, Endereço e Telefone.');
      return;
    }
    
    const payload = {
      nome,
      cpf,
      endereco,
      telefone,
      dados_vitais: {
        idade,
        genero,
        observacao
      }
    };

    setSubmitting(true);
    try {
      if (isEditMode) {
        await pacienteService.editPaciente(editingId, payload);
        toast.success('Residente atualizado com sucesso!');
      } else {
        await pacienteService.createPaciente(payload);
        toast.success('Residente cadastrado com sucesso!');
      }
      closeModal();
      refetch();
    } catch (err) {
      console.error('Erro ao salvar residente:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erro inesperado ao salvar.';
      toast.error(`Erro ao salvar residente: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPaciente) return;
    setSubmitting(true);
    try {
      await pacienteService.deletePaciente(deletingPaciente.id);
      toast.success('Residente excluído com sucesso!');
      closeModal();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao excluir residente.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm backdrop-blur-sm transition-colors duration-300">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <Users className="mr-3 h-6 w-6 text-blue-600 dark:text-blue-400" />
            Gestão de Residentes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Cadastre e gerencie as informações de saúde dos residentes
          </p>
        </div>
        <Button
          onClick={openAddModal}
          variant="primary"
          className="flex items-center text-xs py-2.5 px-4 shadow-md shadow-blue-500/10 dark:shadow-blue-900/20 cursor-pointer"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Residente
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
          placeholder="Buscar residente por nome..."
          className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 py-2.5 pl-10 pr-4 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-xs font-semibold"
        />
      </div>

      {/* Table */}
      {loading && pacientes.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
          <Users className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhum residente encontrado</h3>
          <p className="text-xs text-slate-400 mt-1">Tente alterar os termos de busca ou cadastre um novo residente.</p>
        </div>
      ) : (
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/85 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">Residente</th>
                  <th className="px-6 py-4">Informações</th>
                  <th className="px-6 py-4">Observações Médicas</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {filtered.map((p) => {
                  let dv = {};
                  try {
                    dv = typeof p.dados_vitais === 'string' ? JSON.parse(p.dados_vitais) : (p.dados_vitais || {});
                  } catch (e) {
                    dv = {};
                  }
                  
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/50 transition-colors">
                            {p.nome[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{p.nome}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">CPF: {p.cpf}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span>{dv.idade || '??'} anos</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-400 font-medium text-[10px]">
                            <Phone className="h-3 w-3" />
                            <span>{p.telefone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                          {dv.observacao || 'Nenhuma observação registrada.'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-800 transition-colors duration-200 cursor-pointer"
                            title="Editar residente"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(p)}
                            className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-red-50 dark:bg-red-900/20 hover:bg-white dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-800 transition-colors duration-200 cursor-pointer"
                            title="Excluir residente"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative animate-scale-up overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              {isEditMode ? 'Editar Residente' : 'Cadastrar Novo Residente'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  id="pac-nome"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Maria Oliveira"
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  icon={User}
                />
                <Input
                  label="CPF"
                  id="pac-cpf"
                  required
                  mask="###.###.###-##"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="Ex: 123.456.789-01"
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  icon={Fingerprint}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Telefone"
                  id="pac-telefone"
                  required
                  mask="(##) #####-####"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Ex: (11) 98888-7777"
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  icon={Phone}
                />
                <Input
                  label="Endereço"
                  id="pac-endereco"
                  required
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Ex: Rua das Flores, 123"
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  icon={MapPin}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <Input
                  label="Idade"
                  id="pac-idade"
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  placeholder="Ex: 85"
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
                <div>
                  <label htmlFor="pac-genero" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide mb-1.5">
                    Gênero
                  </label>
                  <select
                    id="pac-genero"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                  >
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="pac-obs" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide mb-1.5">
                  Observações / Histórico Médico
                </label>
                <textarea
                  id="pac-obs"
                  rows={3}
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Alergias, condições crônicas, medicações..."
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 resize-none"
                />
              </div>
              
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
                  {isEditMode ? 'Salvar Alterações' : 'Cadastrar Residente'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingPaciente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-scale-up">
            <button onClick={closeModal} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Excluir Residente?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Você está prestes a excluir <span className="font-bold text-slate-800 dark:text-slate-200">{deletingPaciente.nome}</span>. Esta ação removerá todos os vínculos e históricos de saúde e não pode ser desfeita.
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

export default Pacientes;
