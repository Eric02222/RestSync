import React, { useState } from 'react';
import { usePacientes } from '../../hooks/usePacientes';
import { pacienteService } from '../../services/paciente.service';
import { useAuth } from '../../context/context';
import { toast } from 'react-toastify';
import {
  Users,
  UserPlus,
  Search,
  MapPin,
  Phone,
  CreditCard,
  Edit2,
  X,
  Plus,
  Loader2,
  Trash
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import VinculoManager from '../../components/vinculos/VinculoManager';

const Pacientes = () => {
  const { user } = useAuth();
  const { pacientes, loading, refetch } = usePacientes();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletMode, setIsDeletMode] = useState(false);
  const [deletId, setDeletId] = useState(null);

  // Form Fields
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formatCpf = (rawCpf) => {
    if (!rawCpf) return '';
    const str = String(rawCpf).replace(/\D/g, '');
    if (str.length !== 11) return str;
    return str.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setNome('');
    setCpf('');
    setEndereco('');
    setTelefone('');
    setShowModal(true);
  };

  const openExcluirModal = (paciente) => {
    setIsDeletMode(true);
    setShowModalDelete(true);
    setDeletId(paciente.id)
  }

  const openEditModal = (paciente) => {
    setIsEditMode(true);
    setEditingId(paciente.id);
    setNome(paciente.nome);
    setCpf(formatCpf(paciente.cpf));
    setEndereco(paciente.endereco);
    setTelefone(paciente.telefone);
    setShowModal(true);
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Numbers only
    if (value.length <= 11) {
      // Apply CPF format: 000.000.000-00
      value = value
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      setCpf(value);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      // Apply Phone format: (00) 00000-0000
      value = value
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2');
      setTelefone(value);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (deletMode) {
        await pacienteService.deletePaciente(deletId);
        toast.success('Cadastro do residente deletado com sucesso!');
      } else {
        toast.success('Erro ao deletar cadastro de residente!');
      }

      setShowModal(false);
      setShowModalDelete(false);
      refetch();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Falha ao deletar dados do residente.';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !cpf || !endereco || !telefone) {
      toast.warning('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        await pacienteService.editPaciente(editingId, { nome, cpf, endereco, telefone });
        toast.success('Cadastro do residente atualizado com sucesso!');
      } else if (deletMode) {
        await pacienteService.deletePaciente(deletId);
        toast.success('Cadastro do residente deletado com sucesso!');
      } else {
        await pacienteService.createPaciente({ nome, cpf, endereco, telefone });
        toast.success('Residente cadastrado com sucesso!');
      }
      setShowModal(false);
      setShowModalDelete(false);
      refetch();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Falha ao salvar dados do residente.';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter patients by name or CPF
  const filteredPacientes = pacientes.filter(p =>
    String(p.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.cpf || '').includes(searchTerm)
  );

  const canManage = ['admin', 'medico'].includes(user?.tipo_usuario);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/70 border border-slate-200/80 p-6 rounded-2xl shadow-sm backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <Users className="mr-3 h-6 w-6 text-blue-600" />
            Gestão de Residentes
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Cadastre, edite e gerencie as informações pessoais dos idosos assistidos
          </p>
        </div>

        {canManage && (
          <Button
            onClick={openAddModal}
            variant="primary"
            className="flex items-center text-xs py-2.5 px-4 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Adicionar Residente
          </Button>
        )}
      </div>

      {/* Search Filter Toolbar */}
      <div className="relative max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar residente por nome ou CPF..."
          className="block w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-xs font-semibold"
        />
      </div>

      {/* Grid List View */}
      {loading && pacientes.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredPacientes.length === 0 ? (
        <div className="bg-white/70 border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm">
          <Users className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700">Nenhum residente encontrado</h3>
          <p className="text-xs text-slate-400 mt-1">Experimente alterar os termos de busca ou cadastre um novo residente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacientes.map((paciente) => (
            <div
              key={paciente.id}
              className="bg-white/70 border border-slate-200/85 hover:border-slate-300 rounded-2xl p-6 shadow-sm hover:shadow transition-all duration-300 relative group flex flex-col justify-between"
            >
              {/* Header block with actions */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                    {paciente.nome}
                  </h3>
                  <span className="inline-flex items-center text-[10px] font-semibold text-slate-400 mt-1">
                    ID: #{paciente.id}
                  </span>
                </div>

                {canManage && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => openExcluirModal(paciente)}
                      className="p-2 rounded-lg border border-slate-100 bg-red-100 hover:bg-white hover:text-red-600 hover:border-red-100 transition-colors duration-200 cursor-pointer"
                      title="Excluir cadastro"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => openEditModal(paciente)}
                      className="p-2 rounded-lg border border-slate-100 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-colors duration-200 cursor-pointer"
                      title="Editar cadastro"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Data blocks */}
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center">
                  <CreditCard className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  <span>CPF: {formatCpf(paciente.cpf)}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  <span>Tel: {paciente.telefone}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-3.5 w-3.5 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                  <span className="line-clamp-2 leading-relaxed">{paciente.endereco}</span>
                </div>
              </div>

              {/* Vínculo Manager — admin/medico only */}
              {canManage && (
                <VinculoManager
                  pacienteId={paciente.id}
                  pacienteNome={paciente.nome}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* CRUD Form Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-scale-up">
            {/* Modal Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-6">
              {isEditMode ? 'Editar Cadastro de Residente' : 'Cadastrar Novo Residente'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="Nome Completo"
                  id="nome"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="CPF"
                    id="cpf"
                    required
                    value={cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <Input
                    label="Telefone de Contato"
                    id="telefone"
                    required
                    value={telefone}
                    onChange={handlePhoneChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <Input
                  label="Endereço de Residência"
                  id="endereco"
                  required
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Ex: Rua das Flores, 123 - Centro"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  className="shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  {isEditMode ? 'Salvar Alterações' : 'Cadastrar Residente'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModalDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-scale-up">
            {/* Modal Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="flex justify-center text-lg font-bold text-slate-900 mb-6">
              Deseja deletar residente?
            </h3>

            <form onSubmit={handleDeleteSubmit} className="flex justify-center gap-100 ">

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <Button
                  onClick={() => setShowModalDelete(false)}
                  variant="outline"
                  className="cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  loading={submitting}
                  className="shadow-md shadow-red-500/10 cursor-pointer"
                >
                  Deletar resitente
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pacientes;
