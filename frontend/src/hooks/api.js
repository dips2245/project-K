import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
});

API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('blissUser'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Auth
export const authAPI = {
    login: (data) => API.post('/auth/login', data),
    register: (data) => API.post('/auth/register', data),
    getMe: () => API.get('/auth/me'),
};

// Products
export const productAPI = {
    getAll: (params) => API.get('/products', { params }),
    getOne: (slug) => API.get(`/products/${slug}`),
    create: (formData) => API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, formData) => API.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => API.delete(`/products/${id}`),
};

// Categories
export const categoryAPI = {
    getAll: () => API.get('/categories'),
    getOne: (slug) => API.get(`/categories/${slug}`),
    create: (formData) => API.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, formData) => API.put(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => API.delete(`/categories/${id}`),
};

// Orders
export const orderAPI = {
    create: (data) => API.post('/orders', data),
    getAll: (params) => API.get('/orders', { params }),
    getOne: (id) => API.get(`/orders/${id}`),
    updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
    whatsappMessage: (data) => API.post('/orders/whatsapp-message', data),
};

export default API;
