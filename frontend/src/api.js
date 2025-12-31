import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Resilience: Ensure protocol is present
if (baseURL && !baseURL.startsWith('http')) {
    baseURL = `https://${baseURL}`;
}

// Resilience: Ensure it ends with /api (as expected by server.js routes)
if (baseURL && !baseURL.endsWith('/api') && !baseURL.endsWith('/api/')) {
    baseURL = baseURL.endsWith('/') ? `${baseURL}api` : `${baseURL}/api`;
}

const API = axios.create({
    baseURL
});

export default API;
