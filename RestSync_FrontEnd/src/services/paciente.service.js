import api from './api';

export const pacienteService = {
  async getPacientes() {
    const response = await api.get('/pacientes');
    // Note: backend returns { message: "...", data: [...] }
    return response.data.data || [];
  },

  async createPaciente(pacienteData) {
    // fields: nome, cpf, endereco, telefone, dados_vitais
    const response = await api.post('/pacientes', pacienteData);
    return response.data;
  },

  async editPaciente(id, pacienteData) {
    // fields: nome, cpf, endereco, telefone, dados_vitais
    const response = await api.put(`/pacientes/${id}`, pacienteData);
    return response.data;
  }
};
