import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'https://mom-skitchen-backend.onrender.com';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://mom-skitchen-backend.onrender.com/api'
});

// Interceptor to add JWT token
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default API;
