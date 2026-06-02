import { useState, useEffect, useCallback, useMemo } from 'react';
import { vitalsService } from '../services/vitals.service';
import {
  getHeartRateStatus,
  getTemperatureStatus,
  buildAnomaliesFromHistorico,
} from '../utils/vitalsRules';
import { VITALS_UPDATED_EVENT } from '../utils/vitalsEvents';

export const useVitals = (pacienteId) => {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVitals = useCallback(async (silent = false) => {
    if (!pacienteId) {
      setHistorico([]);
      return;
    }
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await vitalsService.getHistorico(pacienteId);
      setHistorico(data);
    } catch (err) {
      console.error('Error fetching vitals:', err);
      setHistorico([]);
      setError(err.response?.data?.message || 'Falha ao carregar dados vitais.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    fetchVitals(false);

    if (!pacienteId) return undefined;

    const interval = setInterval(() => fetchVitals(true), 30000);

    const onVitalsUpdated = (e) => {
      const updatedId = e.detail?.pacienteId;
      if (!updatedId || String(updatedId) === String(pacienteId)) {
        fetchVitals(true);
      }
    };
    window.addEventListener(VITALS_UPDATED_EVENT, onVitalsUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener(VITALS_UPDATED_EVENT, onVitalsUpdated);
    };
  }, [pacienteId, fetchVitals]);

  const latestVitals = historico.length > 0 ? historico[0] : null;
  const anomalies = useMemo(
    () => buildAnomaliesFromHistorico(historico),
    [historico]
  );

  return {
    historico,
    latestVitals,
    anomalies,
    loading,
    error,
    refetch: () => fetchVitals(false),
    getHeartRateStatus,
    getTemperatureStatus,
  };
};
