import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Crucial for sending HttpOnly cookies (refresh_token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Inject auth token or API key if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const apiKey = typeof window !== 'undefined' ? localStorage.getItem('DATAPACT_API_KEY') : null;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }
    
    // Inject Workspace Header
    const workspaceId = typeof window !== 'undefined' ? localStorage.getItem('DATAPACT_WORKSPACE_ID') : null;
    if (workspaceId) {
      config.headers['X-Workspace-ID'] = workspaceId;
    }
    
    // Trace ID
    config.headers['X-Request-ID'] = crypto.randomUUID();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token using the HttpOnly cookie
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        
        if (res.data && res.data.access_token) {
          localStorage.setItem('access_token', res.data.access_token);
          // Update the failed request and retry
          originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;
          return apiClient(originalRequest);
        }
      } catch {
        // Refresh failed (e.g., cookie expired or revoked), logout user
        localStorage.removeItem('access_token');
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
