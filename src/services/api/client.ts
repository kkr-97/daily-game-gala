import { toast } from "sonner";

const credentialsKey = 'admin_credentials';

export const handleApiError = (error: unknown) => {
  console.error("API Error:", error);
  if (error instanceof Error) {
    toast.error(`API Error: ${error.message}`);
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    toast.error(`API Error: ${(error as { message: string }).message}`);
  } else {
    toast.error("An unexpected error occurred.");
  }
};

export const apiClient = {
  hasCredentials: () => {
    return localStorage.getItem(credentialsKey) !== null;
  },
  
  getCredentials: () => {
    const storedCredentials = localStorage.getItem(credentialsKey);
    return storedCredentials ? JSON.parse(storedCredentials) : null;
  },
  
  setCredentials: (apiKey: string, signature: string) => {
    const credentials = { apiKey, signature };
    localStorage.setItem(credentialsKey, JSON.stringify(credentials));
  },
  
  clearCredentials: () => {
    localStorage.removeItem(credentialsKey);
  },

  async fetchWithAuth(url: string, options: RequestInit = {}) {
    const credentials = apiClient.getCredentials();
    if (!credentials) {
      throw new Error("API credentials not found");
    }
    
    const headers = {
      ...options.headers,
      'X-API-Key': credentials.apiKey,
      'X-Signature': credentials.signature
    };
    
    if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method)) {
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    return response;
  },
  
  async handleResponse(response: Response) {
    if (response.status === 201) {
      const text = await response.text();
      return text.trim() ? JSON.parse(text) : { success: true };
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      const errorData = errorText ? JSON.parse(errorText) : { message: `API request failed with status ${response.status}` };
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
};
