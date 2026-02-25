import api from './api.js';

export const getItineraries = async () => {
  const response = await api.get('/itineraries');
  const d = response.data;
  return Array.isArray(d) ? d : [];
};

export const getItinerary = async (id) => {
  const response = await api.get(`/itineraries/${id}`);
  return response.data;
};

export const createItinerary = async (data) => {
  const response = await api.post('/itineraries', data);
  return response.data;
};

export const updateItinerary = async (id, data) => {
  const response = await api.put(`/itineraries/${id}`, data);
  return response.data;
};

export const deleteItinerary = async (id) => {
  const response = await api.delete(`/itineraries/${id}`);
  return response.data;
};

