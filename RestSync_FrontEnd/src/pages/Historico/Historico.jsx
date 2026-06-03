import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/context';
import { usePacientes } from '../../hooks/usePacientes';
import { useVitals } from '../../hooks/useVitals';
import { 
  History, 
  Heart, 
  Thermometer, 
  Activity, 
  Wind,
  Calendar,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import VitalsChart from '../../components/charts/VitalsChart';
import Badge from '../../components/ui/Badge';

const Historico = () => {
  const { user } = useAuth();
  const { pacientes, loading: loadingPacientes } = usePacientes();
  const [selectedPacienteId, setSelectedPacienteId] = useState('');
  
  const { 
    historico, 
    loading: loadingVitals,
    getHeartRateStatus,
    getTemperatureStatus
  } = useVitals(selectedPacienteId);

  // Set initial resident
  useEffect(() => {
    if (pacientes.length > 0 && !selectedPacienteId) {
      setSelectedPacienteId(pacientes[0].id);
    }
  }, [pacientes, selectedPacienteId]);

  const selectedPaciente = pacientes.find(p => p.id === parseInt(selectedPacienteId));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.slice(0, 5);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm backdrop-blur-sm transition-colors duration-300">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <History className="mr-3 h-6 w-6 text-blue-600 dark:text-blue-400" />
            Histórico Clínico
          </h2>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Consulte a evolução temporal completa e os relatórios de medições dos residentes
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="relative">
          <select
            value={selectedPacienteId}
            onChange={(e) => setSelectedPacienteId(e.target.value)}
            className="block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 pr-8 cursor-pointer"
          >
            {pacientes.length === 0 ? (
              <option value="">Nenhum residente cadastrado</option>
            ) : (
              pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  Residente: {p.nome}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {pacientes.length === 0 ? (
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
          <History className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Sem registros de histórico</h3>
          <p className="text-xs text-slate-400 mt-1">
            {user?.tipo_usuario === 'familiar'
              ? 'Nenhum residente vinculado à sua conta. Solicite o acesso à equipe da casa de repouso.'
              : 'Cadastre residentes no sistema para visualizar os relatórios e tabelas clínicas.'}
          </p>
        </div>
      ) : !selectedPacienteId ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : (
        <>
          {/* Recharts Vital Sign Analytics Chart */}
          <div>
            <VitalsChart data={historico} />
          </div>

          {/* Historical Data Table List */}
          <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/85 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm transition-colors duration-300">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-none">Registros de Sinais Vitais</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Lista completa das últimas medições do residente</p>
              </div>
              <Badge variant="secondary">
                {historico.length} medições
              </Badge>
            </div>

            {loadingVitals && historico.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
            ) : historico.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Nenhum sinal vital registrado para este residente. Use o simulador no Dashboard para enviar as primeiras medições!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-4">Data e Hora</th>
                      <th className="px-6 py-4">Frequência Cardíaca</th>
                      <th className="px-6 py-4">Temperatura</th>
                      <th className="px-6 py-4">Pressão Arterial</th>
                      <th className="px-6 py-4">Oxigenação (SpO2)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {historico.map((reading) => {
                      const fcStatus = getHeartRateStatus(reading.frequencia_cardiaca);
                      const tempStatus = getTemperatureStatus(reading.temperatura);

                      return (
                        <tr key={reading.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center text-slate-400 dark:text-slate-500">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>{formatDate(reading.data)}</span>
                              </div>
                              <div className="flex items-center text-slate-400 dark:text-slate-500">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span>{formatTime(reading.hora)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2.5">
                              <Heart className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                              <span className="text-slate-900 dark:text-white">{reading.frequencia_cardiaca || '--'} bpm</span>
                              <Badge 
                                variant={
                                  fcStatus === 'critical' ? 'danger' :
                                  fcStatus === 'attention' ? 'warning' : 'success'
                                }
                              >
                                {fcStatus === 'critical' ? 'crítico' :
                                 fcStatus === 'attention' ? 'alerta' : 'normal'}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2.5">
                              <Thermometer className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                              <span className="text-slate-900 dark:text-white">
                                {reading.temperatura ? `${parseFloat(reading.temperatura).toFixed(1)} °C` : '--'}
                              </span>
                              <Badge 
                                variant={
                                  tempStatus === 'critical' ? 'danger' :
                                  tempStatus === 'attention' ? 'warning' : 'success'
                                }
                              >
                                {tempStatus === 'critical' ? 'crítico' :
                                 tempStatus === 'attention' ? 'alerta' : 'normal'}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2.5">
                              <Activity className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                              <span className="text-slate-900 dark:text-white">{reading.pressao_arterial || '--'} mmHg</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2.5">
                              <Wind className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                              <span className="text-slate-900 dark:text-white">98%</span>
                              <Badge variant="success">normal</Badge>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Historico;
