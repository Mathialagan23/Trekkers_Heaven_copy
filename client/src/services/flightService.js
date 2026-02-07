import api from './api.js';

export const getFlights = async () => {
  const response = await api.get('/flights');
  return response.data;
};

export const getFlight = async (id) => {
  const response = await api.get(`/flights/${id}`);
  return response.data;
};

export const createFlight = async (data) => {
  const itinerary = localStorage.getItem('activeItineraryId');
  if (!itinerary) return Promise.reject({ response: { data: { message: 'No active itinerary selected' } } });
  const payload = { ...data, itinerary };
  const response = await api.post('/flights', payload);
  // maintain backward compatibility: response may include { flight, totals }
  return response.data.flight || response.data;
};

export const updateFlight = async (id, data) => {
  const response = await api.put(`/flights/${id}`, data);
  return response.data;
};

export const deleteFlight = async (id) => {
  const response = await api.delete(`/flights/${id}`);
  return response.data;
};

