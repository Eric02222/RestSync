import React, { useState } from 'react';
import { useAuditoria } from '../../hooks/useAuditoria';
import { 
  ScrollText, 
  Search, 
  User, 
  Activity, 
  Globe, 
  Clock, 
  Loader2,
  RefreshCcw,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Logs = () => {
  const { logs, loading, refetch } = useAuditoria();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter((log) =>
    String(log.usuario || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(log.tipo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(log.descricao || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLogTypeVariant = (tipo) => {
    const t = tipo?.toLowerCase();
    if (t?.includes('erro') || t?.includes('falha') || t?.includes('delete')) return 'danger';
    if (t?.includes('login') || t?.includes('create') || t?.includes('update')) return 'primary';
    return 'secondary';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm backdrop-blur-sm transition-colors duration-300">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <ScrollText className="mr-3 h-6 w-6 text-blue-600 dark:text-blue-400" />
            Auditoria do Sistema
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Rastreamento de ações, mudanças e logs de segurança
          </p>
        </div>
        <Button
          onClick={refetch}
          variant="outline"
          className="flex items-center text-xs py-2.5 px-4 cursor-pointer dark:border-slate-700 dark:hover:bg-slate-800"
          disabled={loading}
        >
          <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar Logs
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
          placeholder="Buscar por usuário, tipo ou descrição..."
          className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 py-2.5 pl-10 pr-4 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-xs font-semibold"
        />
      </div>

      {/* Table */}
      {loading && logs.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
          <ScrollText className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhum registro encontrado</h3>
          <p className="text-xs text-slate-400 mt-1">Não há logs que correspondam aos seus critérios de busca.</p>
        </div>
      ) : (
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/85 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">Data e Hora</th>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Evento</th>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-slate-800 dark:text-slate-200 font-bold">{log.usuario}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getLogTypeVariant(log.tipo)}>
                        {log.tipo}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-400 truncate max-w-xs" title={log.descricao}>
                          {log.descricao}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Globe className="h-3.5 w-3.5" />
                        <span>{log.ip}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50/50 dark:bg-slate-800/50 px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">
              Mostrando {filteredLogs.length} de {logs.length} registros
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;
