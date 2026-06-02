import api from './api';

export const vitalsService = {
  async getHistorico(pacienteId) {
    const response = await api.get(`/historico/${pacienteId}`);
    return response.data.dados || [];
  },

  async enviarDadosVitais(vitalsData) {
    // fields: paciente_id, frequencia_cardiaca, pressao_arterial, temperatura, data, hora
    const response = await api.post('/dispositivo', vitalsData);
    return response.data;
  }
};
