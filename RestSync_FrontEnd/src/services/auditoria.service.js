import api from './api';

export const auditoriaService = {
  async getLogs() {
    const response = await api.get('/auditoria');
    return response.data.data || [];
  },
};
