import axios from 'axios';

const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        let errorMessage = 'Произошла ошибка';
        let status = error.response?.status;

        if (error.code === 'ECONNABORTED') {
            errorMessage = 'Превышено время ожидания запроса';
            status = 408;
        } else if (error.response) {
            status = error.response.status;
            switch (status) {
                case 404:
                    errorMessage = 'Ресурс не найден';
                    break;
                case 500:
                    errorMessage = 'Ошибка сервера';
                    break;
                default:
                    errorMessage = `Ошибка ${status}`;
            }
        } else if (error.request) {
            errorMessage = 'Нет соединения с сервером';
            status = 0;
        }
        console.error('API Error:', {
            message: errorMessage,
            status: status,
            url: error.config?.url?.replace(error.config.baseURL, '') || error.config?.url,
            method: error.config?.method?.toUpperCase()
        });

        return Promise.reject({
            message: errorMessage,
            status: status,
            originalError: {
                message: error.message,
                code: error.code
            }
        });
    }
);

export const getUsers = () => api.get('/users');
export const getPosts = (params?: Record<string, unknown>) => api.get('/posts', { params });
export const getPost = (id: number) => api.get(`/posts/${id}`);
export const getComments = (params?: Record<string, unknown>) => api.get('/comments', { params });
export const createPost = (payload: Record<string, unknown>) => api.post('/posts', payload);
export const updatePost = (id: number, payload: Record<string, unknown>) => api.put(`/posts/${id}`, payload);
export const deletePost = (id: number) => api.delete(`/posts/${id}`);