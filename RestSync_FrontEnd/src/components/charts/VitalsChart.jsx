import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Activity, Thermometer } from 'lucide-react';

const VitalsChart = ({ data = [] }) => {
  const [metric, setMetric] = useState('heartRate'); // 'heartRate' | 'temperature'

  // Format data for Recharts, sorted chronologically (oldest to newest)
  const chartData = [...data]
    .reverse() // Backend returns desc (newest first), chart needs asc (oldest first)
    .map(item => ({
      name: `${item.data.split('-').reverse().slice(0,2).join('/')} ${item.hora.slice(0,5)}`,
      heartRate: item.frequencia_cardiaca || 0,
      temperature: item.temperatura ? parseFloat(item.temperatura) : 0,
    }));

  const activeConfig = {
    heartRate: {
      key: 'heartRate',
      label: 'Frequência Cardíaca',
      unit: ' bpm',
      color: '#3B82F6', // Blue-500
      gradientId: 'colorFc',
      yDomain: [40, 160],
      icon: Activity,
    },
    temperature: {
      key: 'temperature',
      label: 'Temperatura',
      unit: ' °C',
      color: '#EF4444', // Red-500
      gradientId: 'colorTemp',
      yDomain: [34, 42],
      icon: Thermometer,
    },
  }[metric];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-100 bg-white/95 p-3 shadow-md backdrop-blur-sm">
          <p className="text-[10px] font-semibold text-slate-400">{payload[0].payload.name}</p>
          <p className="text-sm font-bold mt-1" style={{ color: activeConfig.color }}>
            {payload[0].value}
            <span className="text-xs font-semibold text-slate-500">{activeConfig.unit}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-white/70 border border-slate-200/80 rounded-2xl shadow-sm backdrop-blur-sm">
      {/* Metric Toggle Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-none">Histórico de Tendências</h3>
          <p className="text-xs font-medium text-slate-500 mt-1">Evolução dos sinais vitais ao longo do tempo</p>
        </div>
        
        <div className="flex rounded-xl bg-slate-100 p-1 self-start sm:self-center">
          <button
            onClick={() => setMetric('heartRate')}
            className={`flex items-center px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              metric === 'heartRate'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="h-3.5 w-3.5 mr-1.5" />
            Frequência Cardíaca
          </button>
          
          <button
            onClick={() => setMetric('temperature')}
            className={`flex items-center px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              metric === 'temperature'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Thermometer className="h-3.5 w-3.5 mr-1.5" />
            Temperatura
          </button>
        </div>
      </div>

      {/* Recharts Chart Area */}
      <div className="h-72 w-full min-w-0">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Sem registros históricos para exibir.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={288} minWidth={0}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={activeConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="name" 
                stroke="#94A3B8" 
                fontSize={10} 
                fontWeight={500}
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={10} 
                fontWeight={500}
                tickLine={false} 
                axisLine={false} 
                domain={activeConfig.yDomain}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={activeConfig.key}
                stroke={activeConfig.color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${activeConfig.gradientId})`}
                dot={{ stroke: activeConfig.color, strokeWidth: 1.5, r: 4, fill: '#FFFFFF' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: activeConfig.color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default VitalsChart;
