import api from './api';

export const vitalsService = {
  async getHistorico(pacienteId) {
    try {
      const response = await api.get(`/historico/${pacienteId}`);
      // Note: backend returns { message: "...", dados: [...] }
      return response.data.dados || [];
    } catch (error) {
      // If the backend returns a 404 meaning "no vitals found", we can return an empty array
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  },

  async enviarDadosVitais(vitalsData) {
    // fields: paciente_id, frequencia_cardiaca, pressao_arterial, temperatura, data, hora
    const response = await api.post('/dispositivo', vitalsData);
    return response.data;
  }
};
