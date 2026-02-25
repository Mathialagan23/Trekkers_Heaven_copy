import api from './api.js';

export const getTrains = async () => {
  const response = await api.get('/trains');
  const d = response.data;
  return Array.isArray(d) ? d : [];
};

export const getTrain = async (id) => {
  const response = await api.get(`/trains/${id}`);
  return response.data;
};

export const createTrain = async (data) => {
  const itinerary = localStorage.getItem('activeItineraryId');
  if (!itinerary) return Promise.reject({ response: { data: { message: 'No active itinerary selected' } } });
  const payload = { ...data, itinerary };
  const response = await api.post('/trains', payload);
  return response.data;
};

export const updateTrain = async (id, data) => {
  const response = await api.put(`/trains/${id}`, data);
  return response.data;
};

export const deleteTrain = async (id) => {
  const response = await api.delete(`/trains/${id}`);
  return response.data;
};