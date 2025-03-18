import { toast } from "sonner";

export const handleApiError = (error: unknown) => {
  console.error("API Error:", error);
  if (error instanceof Error) {
    toast.error(`API Error: ${error.message}`);
  } else {
    toast.error("An unexpected error occurred.");
  }
};

export interface SillyQuestion {
  question: string;
  date: string;
}

export interface MostLikelyQuestion {
  questionText: string;
  imageUrl?: string;
  date: string;
}

export interface ThisOrThatPairing {
  option1Text: string;
  option2Text: string;
  date: string;
}

const credentialsKey = 'admin_credentials';

export const dailyGamesApi = {
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
  
  postSillyQuestion: async (data: SillyQuestion) => {
    const credentials = dailyGamesApi.getCredentials();
    if (!credentials) {
      throw new Error("API credentials not found");
    }
    
    try {
      const response = await fetch('http://localhost:8080/admin/daily-games/silly-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': credentials.apiKey,
          'X-Signature': credentials.signature
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to post silly question:', error);
      throw error;
    }
  },
  
  postMostLikelyQuestion: async (data: MostLikelyQuestion) => {
    const credentials = dailyGamesApi.getCredentials();
    if (!credentials) {
      throw new Error("API credentials not found");
    }
    
    try {
      const response = await fetch('http://localhost:8080/admin/daily-games/most-likely/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': credentials.apiKey,
          'X-Signature': credentials.signature
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to post most likely question:', error);
      throw error;
    }
  },
  
  postThisOrThatPairing: async (data: ThisOrThatPairing) => {
    const credentials = dailyGamesApi.getCredentials();
    if (!credentials) {
      throw new Error("API credentials not found");
    }
    
    try {
      const response = await fetch('http://localhost:8080/admin/daily-games/this-or-that/pairings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': credentials.apiKey,
          'X-Signature': credentials.signature
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to post this or that pairing:', error);
      throw error;
    }
  }
};
