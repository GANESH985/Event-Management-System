import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const profileService = {
  create: (name: string, timezone?: string) =>
    api.post('/profiles', { name, timezone }),
  getAll: () => api.get('/profiles'),
  getById: (id: string) => api.get(`/profiles/${id}`),
  update: (id: string, data: { name?: string; timezone?: string }) =>
    api.put(`/profiles/${id}`, data),
};

export const eventService = {
  create: (data: {
    title?: string;
    profiles: string[];
    timezone: string;
    startDate: Date;
    endDate: Date;
  }) => api.post('/events', data),
  getAll: () => api.get('/events'),
  getByProfile: (profileId: string) => api.get(`/events/profile/${profileId}`),
  update: (id: string, data: unknown) => api.put(`/events/${id}`, data),
  getUpdateHistory: (id: string) => api.get(`/events/${id}/history`),
};

export default api;
