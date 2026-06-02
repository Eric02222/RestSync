import { useState, useEffect, useCallback } from 'react';
import { auditoriaService } from '../services/auditoria.service';
import { toast } from 'react-toastify';

export const useAuditoria = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditoriaService.getLogs();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching logs:', err);
      const errMsg = err.response?.data?.message || 'Falha ao carregar logs de auditoria.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
};
