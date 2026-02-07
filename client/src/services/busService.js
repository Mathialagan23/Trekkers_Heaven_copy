import api from './api.js';

export const getBuses = async () => {
  const response = await api.get('/buses');
  return response.data;
};

export const getBus = async (id) => {
  const response = await api.get(`/buses/${id}`);
  return response.data;
};

export const createBus = async (data) => {
  const itinerary = localStorage.getItem('activeItineraryId');
  if (!itinerary) return Promise.reject({ response: { data: { message: 'No active itinerary selected' } } });
  const payload = { ...data, itinerary };
  const response = await api.post('/buses', payload);
  return response.data;
};

export const updateBus = async (id, data) => {
  const response = await api.put(`/buses/${id}`, data);
  return response.data;
};

export const deleteBus = async (id) => {
  const response = await api.delete(`/buses/${id}`);
  return response.data;
};
