import React, { useState, useEffect } from 'react';
import { vinculoService } from '../../services/vinculo.service';
import { userService } from '../../services/user.service';
import { toast } from 'react-toastify';
import { Link2, Link2Off, Users, Plus, Loader2, X } from 'lucide-react';
import Button from '../ui/Button';

const VinculoManager = ({ pacienteId, pacienteNome }) => {
  const [vinculos, setVinculos] = useState([]);
  const [familiares, setFamiliares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFamiliarId, setSelectedFamiliarId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vincsData, usersData] = await Promise.all([
        vinculoService.getVinculosByPaciente(pacienteId),
        userService.getUsers(),
      ]);
      setVinculos(vincsData);
      // Filter only familiares not already linked
      const vinculadosIds = vincsData.map((v) => v.id);
      const familiaresFiltrados = usersData.filter(
        (u) => u.tipo_usuario === 'familiar' && !vinculadosIds.includes(u.id)
      );
      setFamiliares(familiaresFiltrados);
    } catch (err) {
      // Silently fail — backend might not have endpoint yet
      setVinculos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pacienteId) fetchData();
  }, [pacienteId]);

  const handleVincular = async () => {
    if (!selectedFamiliarId) {
      toast.warning('Selecione um familiar para vincular.');
      return;
    }
    setSubmitting(true);
    try {
      await vinculoService.criarVinculo(pacienteId, selectedFamiliarId);
      toast.success('Familiar vinculado com sucesso!');
      setSelectedFamiliarId('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao vincular familiar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDesvincular = async (usuarioId, usuarioNome) => {
    setSubmitting(true);
    try {
      await vinculoService.removerVinculo(pacienteId, usuarioId);
      toast.success(`${usuarioNome} desvinculado com sucesso!`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao desvincular familiar.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="h-3.5 w-3.5 text-blue-500" />
        <span className="text-xs font-bold text-slate-700">Familiares Vinculados</span>
      </div>

      {/* Linked familiares */}
      {vinculos.length === 0 ? (
        <p className="text-[10px] text-slate-400 font-medium mb-3">Nenhum familiar vinculado.</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-3">
          {vinculos.map((v) => (
            <span
              key={v.id}
              className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1 text-[10px] font-semibold text-blue-700"
            >
              <Users className="h-3 w-3" />
              {v.nome}
              <button
                onClick={() => handleDesvincular(v.id, v.nome)}
                disabled={submitting}
                className="ml-0.5 text-blue-400 hover:text-red-500 transition-colors duration-150 cursor-pointer"
                title="Desvincular"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add new link */}
      {familiares.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            value={selectedFamiliarId}
            onChange={(e) => setSelectedFamiliarId(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="">Selecionar familiar...</option>
            {familiares.map((f) => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
          <button
            onClick={handleVincular}
            disabled={submitting || !selectedFamiliarId}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
          >
            {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
            Vincular
          </button>
        </div>
      )}
    </div>
  );
};

export default VinculoManager;
