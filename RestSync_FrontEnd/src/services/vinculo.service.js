import api from './api';

export const vinculoService = {
  async getVinculosByPaciente(pacienteId) {
    try {
      const response = await api.get(`/vinculos/paciente/${pacienteId}`);
      return response.data.data || [];
    } catch (error) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  async getMeusPacientes() {
    try {
      const response = await api.get('/vinculos/meus-pacientes');
      return response.data.data || [];
    } catch (error) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  async criarVinculo(pacienteId, usuarioId) {
    const response = await api.post('/vinculos', {
      paciente_id: pacienteId,
      usuario_id: usuarioId,
    });
    return response.data;
  },

  async removerVinculo(pacienteId, usuarioId) {
    const response = await api.delete(`/vinculos/${pacienteId}/${usuarioId}`);
    return response.data;
  },
};
