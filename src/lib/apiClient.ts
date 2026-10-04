const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private getHeaders(): HeadersInit {
    // In a real app, you would retrieve the JWT token from localStorage or a cookie.
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async parseResponse<T>(res: Response, endpoint: string, method: string): Promise<T> {
    if (!res.ok) {
      let errorMsg = `${method} ${endpoint} failed: ${res.status} ${res.statusText}`;
      try {
        const errData = await res.json();
        if (errData?.detail) {
          errorMsg = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
        } else if (errData?.message) {
          errorMsg = errData.message;
        }
      } catch {
        // Fallback to default message
      }
      throw new Error(errorMsg);
    }
    if (res.status === 204) {
      return {} as T;
    }
    const text = await res.text();
    if (!text || text.trim() === '') {
      return {} as T;
    }
    try {
      return JSON.parse(text);
    } catch {
      return {} as T;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.parseResponse<T>(res, endpoint, 'GET');
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.parseResponse<T>(res, endpoint, 'POST');
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.parseResponse<T>(res, endpoint, 'PUT');
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.parseResponse<T>(res, endpoint, 'PATCH');
  }

  async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.parseResponse<T>(res, endpoint, 'DELETE');
  }
}

export const api = new ApiClient();
