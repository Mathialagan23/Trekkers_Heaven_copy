import api from './api.js';

export const createExpense = async (data) => {
  const response = await api.post('/expenses', data);
  return response.data;
};

export const getExpenses = async (itineraryId) => {
  const response = await api.get(`/expenses/${itineraryId}`);
  const d = response.data;
  if (d && typeof d === 'object' && !Array.isArray(d)) {
    return { expenses: Array.isArray(d.expenses) ? d.expenses : [], totals: d.totals || {} };
  }
  return { expenses: [], totals: {} };
};

export const updateExpense = async (id, data) => {
  const response = await api.put(`/expenses/${id}`, data);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};
