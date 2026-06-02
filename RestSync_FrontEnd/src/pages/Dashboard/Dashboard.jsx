import React, { useState, useEffect } from 'react';
import { usePacientes } from '../../hooks/usePacientes';
import { useVitals } from '../../hooks/useVitals';
import { vitalsService } from '../../services/vitals.service';
import { useAuth } from '../../context/context';
import { toast } from 'react-toastify';
import { 
  Heart, 
  Thermometer, 
  Activity, 
  Wind, 
  RefreshCw, 
  PlusCircle, 
  AlertCircle,
  HelpCircle,
  Play
} from 'lucide-react';

// Components
import MetricCard from '../../components/cards/MetricCard';
import AlertCard from '../../components/cards/AlertCard';
import VitalsChart from '../../components/charts/VitalsChart';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ExecutiveSummary from '../../components/dashboard/ExecutiveSummary';


const Dashboard = () => {
  const { user } = useAuth();
  const { pacientes, loading: loadingPacientes, refetch: refetchPacientes } = usePacientes();
  const [selectedPacienteId, setSelectedPacienteId] = useState('');
  
  // Vitals custom hook for the active resident
  const {
    historico,
    latestVitals,
    anomalies,
    loading: loadingVitals,
    refetch: refetchVitals,
    getHeartRateStatus,
    getTemperatureStatus
  } = useVitals(selectedPacienteId);

  // Simulation Form States
  const [showSimulator, setShowSimulator] = useState(false);
  const [simFc, setSimFc] = useState('75');
  const [simTemp, setSimTemp] = useState('36.5');
  const [simPa, setSimPa] = useState('120/80');
  const [simulating, setSimulating] = useState(false);

  // Select the first patient automatically on load
  useEffect(() => {
    if (pacientes.length > 0 && !selectedPacienteId) {
      setSelectedPacienteId(pacientes[0].id);
    }
  }, [pacientes, selectedPacienteId]);

  const selectedPaciente = pacientes.find(p => p.id === parseInt(selectedPacienteId));

  const handleRefresh = async () => {
    toast.info('Atualizando dados vitais...');
    await refetchPacientes();
    if (selectedPacienteId) {
      await refetchVitals();
    }
  };

  const handleSimulateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPacienteId) {
      toast.warning('Por favor, selecione um residente primeiro.');
      return;
    }

    const fcVal = parseInt(simFc);
    const tempVal = parseFloat(simTemp);

    if (isNaN(fcVal) || fcVal <= 0) {
      toast.error('Frequência cardíaca deve ser um número válido.');
      return;
    }
    if (isNaN(tempVal) || tempVal <= 0) {
      toast.error('Temperatura deve ser um número válido.');
      return;
    }

    setSimulating(true);
    try {
      await vitalsService.enviarDadosVitais({
        paciente_id: selectedPacienteId,
        frequencia_cardiaca: fcVal,
        pressao_arterial: simPa || '120/80',
        temperatura: tempVal,
      });
      
      toast.success('Sinal vital simulado com sucesso!');
      setShowSimulator(false);
      refetchVitals();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao simular envio de dados vitais.');
    } finally {
      setSimulating(false);
    }
  };

  // Preset simulator functions for quick testing
  const applyPreset = (type) => {
    if (type === 'normal') {
      setSimFc('72');
      setSimTemp('36.6');
      setSimPa('120/80');
    } else if (type === 'alert') {
      setSimFc('105');
      setSimTemp('37.5');
      setSimPa('135/88');
    } else if (type === 'critical') {
      setSimFc('132');
      setSimTemp('39.1');
      setSimPa('155/95');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Executive Summary — KPIs Globais */}
      {pacientes.length > 0 && (
        <ExecutiveSummary pacientes={pacientes} />
      )}

      {/* Greeting Banner */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/70 border border-slate-200/85 p-6 rounded-2xl shadow-sm backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Painel de Monitoramento
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Olá, <span className="text-blue-600 capitalize">{user?.nome}</span> • Acompanhamento em tempo real (atualização automática a cada 30s)
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Patient dropdown */}
          <div className="relative">
            <select
              value={selectedPacienteId}
              onChange={(e) => setSelectedPacienteId(e.target.value)}
              className="block rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 pr-8 cursor-pointer"
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

          {/* Action buttons */}
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center text-xs py-2 px-3 hover:bg-slate-100 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingPacientes || loadingVitals ? 'animate-spin' : ''}`} />
          </Button>

          {selectedPacienteId && (
            <Button
              onClick={() => {
                applyPreset('normal');
                setShowSimulator(true);
              }}
              variant="primary"
              className="flex items-center text-xs py-2.5 px-4 shadow-md shadow-blue-500/10 cursor-pointer"
            >
              <Play className="mr-1.5 h-3.5 w-3.5" />
              Simular Dispositivo
            </Button>
          )}
        </div>
      </div>

      {/* Simulator Quick Modal Form */}
      {showSimulator && (
        <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 text-white shadow-xl space-y-6 animate-slide-up border border-blue-900/40">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold tracking-tight">Simulador de Sinais Vitais (Hardware IoT)</h3>
              <p className="text-xs text-slate-400 mt-1">Injete medições no banco para testar o sistema instantaneamente</p>
            </div>
            <button 
              onClick={() => setShowSimulator(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded border border-white/10"
            >
              Fechar
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => applyPreset('normal')}
              className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
            >
              Preset Saudável
            </button>
            <button
              onClick={() => applyPreset('alert')}
              className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
            >
              Preset Alerta
            </button>
            <button
              onClick={() => applyPreset('critical')}
              className="px-3 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold"
            >
              Preset Crítico
            </button>
          </div>

          <form onSubmit={handleSimulateSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1">Batimentos (FC)</label>
              <input
                type="number"
                value={simFc}
                onChange={(e) => setSimFc(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Ex: 72"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1">Temperatura (°C)</label>
              <input
                type="text"
                value={simTemp}
                onChange={(e) => setSimTemp(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Ex: 36.5"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-1">Pressão Arterial</label>
              <input
                type="text"
                value={simPa}
                onChange={(e) => setSimPa(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Ex: 120/80"
                required
              />
            </div>
            <div>
              <Button
                type="submit"
                variant="primary"
                loading={simulating}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 border-none cursor-pointer"
              >
                Injetar Dados
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid View */}
      {pacientes.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 bg-white/70 border border-slate-200/80 rounded-2xl shadow-sm text-center">
          <AlertCircle className="h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Nenhum Residente Cadastrado</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            Para iniciar o monitoramento, acesse a página de Residentes para cadastrar o primeiro idoso.
          </p>
          {['admin', 'medico'].includes(user?.tipo_usuario) && (
            <Button
              onClick={() => window.location.href = '/pacientes'}
              variant="primary"
              className="mt-6 shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Cadastrar Primeiro Residente
            </Button>
          )}
        </div>
      ) : !selectedPacienteId ? (
        <div className="flex justify-center items-center h-48">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Vitals Grid Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Frequência Cardíaca"
              value={latestVitals?.frequencia_cardiaca || '--'}
              unit="bpm"
              status={getHeartRateStatus(latestVitals?.frequencia_cardiaca)}
              icon={Heart}
            />

            <MetricCard
              title="Temperatura Corporal"
              value={latestVitals?.temperatura ? `${parseFloat(latestVitals.temperatura).toFixed(1)}` : '--'}
              unit="°C"
              status={getTemperatureStatus(latestVitals?.temperatura)}
              icon={Thermometer}
            />

            <MetricCard
              title="Pressão Arterial"
              value={latestVitals?.pressao_arterial || '--'}
              unit="mmHg"
              status="normal" // Simple fallback
              icon={Activity}
            />

            <MetricCard
              title="Oxigenação (SpO2)"
              value={latestVitals ? '98' : '--'} // Oxygen mock
              unit="%"
              status="normal"
              icon={Wind}
            />
          </div>

          {/* Vitals Graph & Alerts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-8">
              <VitalsChart data={historico} />
            </div>

            {/* Alerts Queue Area */}
            <div className="lg:col-span-4 flex flex-col h-full bg-white/70 border border-slate-200/80 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900 leading-none">Notificações e Anomalias</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">Status calculados em tempo real</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 max-h-[268px] pr-1">
                {anomalies.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 text-center">
                    <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                      <Wind className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Estado Clínico Estável</span>
                    <p className="text-[10px] text-slate-500 mt-1">Nenhuma anomalia detectada no histórico recente.</p>
                  </div>
                ) : (
                  anomalies.map((anomaly, idx) => (
                    <AlertCard
                      key={idx}
                      pacienteNome={selectedPaciente?.nome}
                      status={anomaly.status}
                      message={anomaly.message}
                      timestamp={anomaly.timestamp}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
