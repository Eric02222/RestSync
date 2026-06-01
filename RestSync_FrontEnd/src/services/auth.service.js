import api from './api';

export const authService = {
  async login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    const { token, usuario } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
    }
    if (usuario) {
      localStorage.setItem('user', JSON.stringify(usuario));
    }
    
    return { token, user: usuario };
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Backend logout failed or not available:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  }
};
