import API from './api';

export const authService = {
  login: async (credentials) => {
    const res = await API.post('/auth/login', credentials);
    return res.data;
  },

  register: async (userData) => {
    const res = await API.post('/auth/register', userData);
    return res.data;
  },

  getMe: async () => {
    const res = await API.get('/auth/me');
    return res.data;
  },

  updateProfile: async (formData) => {
    const res = await API.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
