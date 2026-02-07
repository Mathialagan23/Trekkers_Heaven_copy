import api from './api.js';

export const getAccommodations = async () => {
  const response = await api.get('/accommodations');
  return response.data;
};

export const getAccommodation = async (id) => {
  const response = await api.get(`/accommodations/${id}`);
  return response.data;
};

export const createAccommodation = async (data) => {
  const itinerary = localStorage.getItem('activeItineraryId');
  if (!itinerary) return Promise.reject({ response: { data: { message: 'No active itinerary selected' } } });
  const payload = { ...data, itinerary };
  const response = await api.post('/accommodations', payload);
  return response.data.accommodation || response.data;
};

export const updateAccommodation = async (id, data) => {
  const response = await api.put(`/accommodations/${id}`, data);
  return response.data;
};

export const deleteAccommodation = async (id) => {
  const response = await api.delete(`/accommodations/${id}`);
  return response.data;
};

