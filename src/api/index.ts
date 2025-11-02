import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = () => api.get('/users');

export const getPosts = (params?: Record<string, unknown>) => api.get('/posts', { params });
export const getPost = (id: number) => api.get(`/posts/${id}`);
export const createPost = (payload: unknown) => api.post('/posts', payload);
export const updatePost = (id: number, payload: unknown) => api.put(`/posts/${id}`, payload);
export const deletePost = (id: number) => api.delete(`/posts/${id}`);

export const getComments = (params?: Record<string, unknown>) => api.get('/comments', { params });
export const createComment = (payload: unknown) => api.post('/comments', payload);
export const updateComment = (id: number, payload: unknown) => api.put(`/comments/${id}`, payload);
export const deleteComment = (id: number) => api.delete(`/comments/${id}`);
