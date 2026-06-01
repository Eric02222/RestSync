import { useState, useEffect, useCallback } from 'react';
import { pacienteService } from '../services/paciente.service';
import { toast } from 'react-toastify';

export const usePacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPacientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pacienteService.getPacientes();
      setPacientes(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      const errMsg = err.response?.data?.message || 'Falha ao carregar lista de residentes.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  return {
    pacientes,
    loading,
    error,
    refetch: fetchPacientes,
  };
};
