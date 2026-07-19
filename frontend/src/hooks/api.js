import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
    baseURL: BASE_URL,
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
    logout: () => API.post('/auth/logout'),
    getMe: () => API.get('/auth/me'),
    verifyEmail: (token) => API.get(`/auth/verify-email?token=${token}`),
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

// Users
export const userAPI = {
    getMe: () => API.get('/users/me'),
    getOrders: () => API.get('/users/orders'),
    changePassword: (data) => API.put('/users/password', data),
    deleteAccount: () => API.delete('/users/account'),
};

// Admin
export const adminAPI = {
    getAuditLogs: (params) => API.get('/admin/audit-logs', { params }),
    getUsers: (params) => API.get('/admin/users', { params }),
    getUser: (id) => API.get(`/admin/users/${id}`),
    updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
    deleteUser: (id) => API.delete(`/admin/users/${id}`),
    getWhatsappNumber: () => API.get('/admin/settings/whatsapp'),
    updateWhatsappNumber: (number) => API.put('/admin/settings/whatsapp', { number }),
    getProfile: () => API.get('/admin/profile'),
    updateProfile: (data) => API.put('/admin/profile', data),
};

// Settings (public)
export const settingsAPI = {
    getWhatsappNumber: () => API.get('/admin/settings/whatsapp/public'),
};

export default API;
