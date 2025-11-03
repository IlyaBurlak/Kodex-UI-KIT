import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  },
);

export const getUsers = () => api.get('/users');
export const getPosts = (params?: Record<string, unknown>) => api.get('/posts', { params });
export const getPost = (id: number) => api.get(`/posts/${id}`);
export const getComments = (params?: Record<string, unknown>) => api.get('/comments', { params });
