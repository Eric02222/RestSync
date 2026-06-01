import api from './api';

export const pacienteService = {
  async getPacientes() {
    const response = await api.get('/pacientes');
    // Note: backend returns { message: "...", data: [...] }
    return response.data.data || [];
  },

  async createPaciente(pacienteData) {
    // fields: nome, cpf, endereco, telefone, dados_vitais
    // Sanitize CPF by removing dots and dashes to avoid MySQL BIGINT insertion error (500)
    const sanitizedCpf = pacienteData.cpf ? pacienteData.cpf.replace(/\D/g, '') : '';
    const response = await api.post('/pacientes', {
      ...pacienteData,
      cpf: sanitizedCpf
    });
    return response.data;
  },

  async editPaciente(id, pacienteData) {
    // fields: nome, cpf, endereco, telefone, dados_vitais
    // Sanitize CPF by removing dots and dashes to avoid MySQL BIGINT insertion error (500)
    const sanitizedCpf = pacienteData.cpf ? pacienteData.cpf.replace(/\D/g, '') : '';
    const response = await api.put(`/pacientes/${id}`, {
      ...pacienteData,
      cpf: sanitizedCpf
    });
    return response.data;
  }
};
