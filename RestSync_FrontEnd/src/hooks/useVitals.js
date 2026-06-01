import { useState, useEffect, useCallback } from 'react';
import { vitalsService } from '../services/vitals.service';

export const useVitals = (pacienteId) => {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVitals = useCallback(async () => {
    if (!pacienteId) {
      setHistorico([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await vitalsService.getHistorico(pacienteId);
      setHistorico(data);
    } catch (err) {
      console.error('Error fetching vitals:', err);
      // Suppress toast/error if it is just a 404 (no vitals yet)
      if (err.response?.status === 404) {
        setHistorico([]);
      } else {
        setError(err.response?.data?.message || 'Falha ao carregar dados vitais.');
      }
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  // Load and start polling
  useEffect(() => {
    fetchVitals();

    if (!pacienteId) return;

    // Automatic simple polling every 30 seconds
    const interval = setInterval(() => {
      fetchVitals();
    }, 30000);

    return () => clearInterval(interval);
  }, [pacienteId, fetchVitals]);

  // Extract latest vitals reading
  const latestVitals = historico.length > 0 ? historico[0] : null;

  // Calculate status for metrics based on rules
  const getHeartRateStatus = (fc) => {
    if (!fc) return 'normal';
    if (fc > 120) return 'critical';
    if (fc >= 90) return 'attention';
    return 'normal';
  };

  const getTemperatureStatus = (temp) => {
    if (!temp) return 'normal';
    const t = parseFloat(temp);
    if (t >= 38.0 || t <= 35.0) return 'critical';
    if (t >= 37.2) return 'attention';
    return 'normal';
  };

  // Compute anomalies queue from recent history
  const anomalies = historico
    .slice(0, 15) // Look at the last 15 readings
    .map(reading => {
      const fcStatus = getHeartRateStatus(reading.frequencia_cardiaca);
      const tempStatus = getTemperatureStatus(reading.temperatura);
      
      const list = [];
      if (fcStatus === 'critical') {
        list.push({
          status: 'critical',
          message: `Frequência cardíaca crítica detectada: ${reading.frequencia_cardiaca} bpm.`,
          timestamp: `${reading.data.split('-').reverse().slice(0,2).join('/')} às ${reading.hora.slice(0,5)}`,
        });
      } else if (fcStatus === 'attention') {
        list.push({
          status: 'attention',
          message: `Frequência cardíaca alterada: ${reading.frequencia_cardiaca} bpm.`,
          timestamp: `${reading.data.split('-').reverse().slice(0,2).join('/')} às ${reading.hora.slice(0,5)}`,
        });
      }

      if (tempStatus === 'critical') {
        list.push({
          status: 'critical',
          message: `Temperatura corporal crítica detectada: ${reading.temperatura} °C.`,
          timestamp: `${reading.data.split('-').reverse().slice(0,2).join('/')} às ${reading.hora.slice(0,5)}`,
        });
      } else if (tempStatus === 'attention') {
        list.push({
          status: 'attention',
          message: `Temperatura corporal alterada: ${reading.temperatura} °C.`,
          timestamp: `${reading.data.split('-').reverse().slice(0,2).join('/')} às ${reading.hora.slice(0,5)}`,
        });
      }

      return list;
    })
    .flat()
    .slice(0, 8); // Display top 8 most recent anomalies

  return {
    historico,
    latestVitals,
    anomalies,
    loading,
    error,
    refetch: fetchVitals,
    getHeartRateStatus,
    getTemperatureStatus,
  };
};
