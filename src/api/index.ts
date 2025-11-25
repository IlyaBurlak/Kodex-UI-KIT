import axios from 'axios';

import type { Comment } from '@store/CommentsSlice/commentsTypes';
import type { Post } from '@store/PostSlice/postsTypes';
import type { User } from '@store/UsersSlice/usersTypes';
import type { AxiosResponse } from 'axios';

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

export const getUsers = (): Promise<AxiosResponse<User[]>> => api.get('/users');

export const getPosts = (params?: Record<string, unknown>): Promise<AxiosResponse<Post[]>> =>
  api.get('/posts', { params });

export const getPost = (id: number): Promise<AxiosResponse<Post>> => api.get(`/posts/${id}`);

export const getComments = (params?: Record<string, unknown>): Promise<AxiosResponse<Comment[]>> =>
  api.get('/comments', { params });

export const createPost = (payload: Omit<Post, 'id'>): Promise<AxiosResponse<Post>> =>
  api.post('/posts', payload);

export const updatePost = (
  id: number,
  payload: Partial<Omit<Post, 'id'>>,
): Promise<AxiosResponse<Post>> => api.patch(`/posts/${id}`, payload);

export const deletePost = (id: number): Promise<AxiosResponse<unknown>> =>
  api.delete(`/posts/${id}`);
