import api from './api.js';

export const getPublicBlogs = async () => {
  const response = await api.get('/blogs/public');
  return response.data;
};

export const getUserBlogs = async () => {
  const response = await api.get('/blogs');
  return response.data;
};

export const getBlog = async (id) => {
  const response = await api.get(`/blogs/${id}`);
  return response.data;
};

export const createBlog = async (data) => {
  const response = await api.post('/blogs', data);
  return response.data;
};

export const updateBlog = async (id, data) => {
  const response = await api.put(`/blogs/${id}`, data);
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
};

