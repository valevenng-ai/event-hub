import axios from 'axios';
import { getToken, isAuthed } from '../store/authStore';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE
})

// Pour ajouter automatiquement le token dans les requête
api.interceptors.request.use((config) => {
  const token = getToken();
  if (isAuthed()) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (username, password) =>
  api.post('/auth/login/', { username, password });
 
export const logout = () =>
  api.post('/auth/logout/');

export const register = (data) =>
  api.post('/auth/register/', data);

export default api;

 
// GET /events/
export const getEvents = (filters = {}) =>
  api.get('/events/', { params: filters });
// Exemple : getEvents({ status: 'active', date: '2026-04-21' })
 
// GET /events/:id/
export const getEvent = (id) =>
  api.get(`/events/${id}/`);
 
// POST /events/
export const createEvent = (data) =>
  api.post('/events/', data);
 
// PUT /events/:id/
export const updateEvent = (id, data) =>
  api.put(`/events/${id}/`, data);
 
// DELETE /events/:id/
export const deleteEvent = (id) =>
  api.delete(`/events/${id}/`);
 
 
 
// GET /participants/
export const getParticipants = (filters = {}) =>
  api.get('/participants/', { params: filters });
// Exemple : getParticipants({ search: 'alice' })
 
// GET /participants/:id/
export const getParticipant = (id) =>
  api.get(`/participants/${id}/`);
 
// POST /participants/
export const createParticipant = (data) =>
  api.post('/participants/', data);
 
// PUT /participants/:id/
export const updateParticipant = (id, data) =>
  api.put(`/participants/${id}/`, data);
 
// DELETE /participants/:id/
export const deleteParticipant = (id) =>
  api.delete(`/participants/${id}/`);

 
// GET /registrations/
export const getRegistrations = (filters = {}) =>
  api.get('/registrations/', { params: filters });
// Exemple : getRegistrations({ event: 1 })
 
// POST /registrations/
export const createRegistration = (data) =>
  api.post('/registrations/', data);
 
// DELETE /registrations/:id/
export const deleteRegistration = (id) =>
  api.delete(`/registrations/${id}/`);