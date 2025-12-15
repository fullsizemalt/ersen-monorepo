import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // Send cookies
});

export default api;
