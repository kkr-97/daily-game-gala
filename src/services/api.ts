
import { toast } from "sonner";

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

export interface SillyQuestion {
  question: string;
  date: string;
}

export interface SillyQuestionResponse {
  questionId: string;
  question: string;
  questionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MostLikelyQuestion {
  questionText: string;
  imageUrl?: string;
  date: string;
}

export interface MostLikelyQuestionResponse {
  questionId: string;
  questionText: string;
  imageUrl?: string;
}

export interface MostLikelyQuestionsResponse {
  todayMostLikelyQuestions: MostLikelyQuestionResponse[];
}

export interface ThisOrThatPairing {
  option1Text: string;
  option2Text: string;
  date: string;
}

export interface ThisOrThatOption {
  optionId: string;
  optionText: string;
  createdAt: string;
}

export interface ThisOrThatPairingResponse {
  pairingId: string;
  option1: ThisOrThatOption;
  option2: ThisOrThatOption;
  validDate: string;
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
      
      if (response.status === 201) {
        return await response.json();
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    } catch (error) {
      console.error('Failed to post silly question:', error);
      throw error;
    }
  },
  
  getSillyQuestions: async (date: string): Promise<SillyQuestionResponse> => {
    const credentials = dailyGamesApi.getCredentials();
    if (!credentials) {
      throw new Error("API credentials not found");
    }
    
    try {
      const response = await fetch(`http://localhost:8080/daily-games/silly-questions/daily?date=${date}`, {
        method: 'GET',
        headers: {
          'X-API-Key': credentials.apiKey,
          'X-Signature': credentials.signature
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get silly questions:', error);
      throw error;
    }
  },
  
  deleteSillyQuestion: async (questionId: string) => {
    const credentials = dailyGamesApi.getCredentials();
    if (!credentials) {
      throw new Error("API credentials not found");
    }
    
    try {
      const response = await fetch(`http://localhost:8080/admin/daily-games/silly-questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': credentials.apiKey,
          'X-Signature': credentials.signature
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to delete silly question:', error);
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
      
      if (response.status === 201) {
        return await response.json();
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    } catch (error) {
      console.error('Failed to post most likely question:', error);
      throw error;
    }
  },
  
  getMostLikelyQuestions: async (date: string): Promise<MostLikelyQuestionsResponse> => {
    const credentials = dailyGamesApi.getCredentials();
    if (!credentials) {
      throw new Error("API credentials not found");
    }
    
    try {
      const response = await fetch(`http://localhost:8080/daily-games/most-likely/daily-questions?date=${date}`, {
        method: 'GET',
        headers: {
          'X-API-Key': credentials.apiKey,
          'X-Signature': credentials.signature
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get most likely questions:', error);
      throw error;
    }
  },
  
  deleteMostLikelyQuestion: async (questionId: string) => {
    const credentials = dailyGamesApi.getCredentials();
    if (!credentials) {
      throw new Error("API credentials not found");
    }
    
    try {
      const response = await fetch(`http://localhost:8080/admin/daily-games/most-likely/${questionId}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': credentials.apiKey,
          'X-Signature': credentials.signature
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to delete most likely question:', error);
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
      
      if (response.status === 201) {
        return await response.json();
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    } catch (error) {
      console.error('Failed to post this or that pairing:', error);
      throw error;
    }
  },
  
  getThisOrThatPairings: async (date: string): Promise<ThisOrThatPairingResponse[]> => {
    const credentials = dailyGamesApi.getCredentials();
    if (!credentials) {
      throw new Error("API credentials not found");
    }
    
    try {
      const response = await fetch(`http://localhost:8080/daily-games/this-or-that/pairings?date=${date}`, {
        method: 'GET',
        headers: {
          'X-API-Key': credentials.apiKey,
          'X-Signature': credentials.signature
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get this or that pairings:', error);
      throw error;
    }
  },
  
  deleteThisOrThatPairing: async (pairingId: string) => {
    const credentials = dailyGamesApi.getCredentials();
    if (!credentials) {
      throw new Error("API credentials not found");
    }
    
    try {
      const response = await fetch(`http://localhost:8080/admin/daily-games/this-or-that/pairings/${pairingId}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': credentials.apiKey,
          'X-Signature': credentials.signature
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to delete this or that pairing:', error);
      throw error;
    }
  }
};
