
import { toast } from "sonner";

// API URL - Replace with your actual API base URL
const API_BASE_URL = "https://your-api-url.com";

// Interfaces for our request payloads
export interface MostLikelyQuestion {
  questionText: string;
  imageUrl?: string;
  date: string;
}

export interface SillyQuestion {
  question: string;
  date: string;
}

export interface ThisOrThatPairing {
  option1Text: string;
  option2Text: string;
  date: string;
}

// Credentials for the API
interface ApiCredentials {
  apiKey: string;
  signature: string;
}

// API Service class for Daily Games
export class DailyGamesApi {
  private credentials: ApiCredentials | null = null;

  constructor() {
    // Try to load stored credentials
    this.loadCredentials();
  }

  // Set API credentials
  setCredentials(apiKey: string, signature: string) {
    this.credentials = { apiKey, signature };
    // Store the credentials in localStorage for persistence
    localStorage.setItem('gameAdminCredentials', JSON.stringify(this.credentials));
  }

  // Load stored credentials
  private loadCredentials() {
    const storedCredentials = localStorage.getItem('gameAdminCredentials');
    if (storedCredentials) {
      try {
        this.credentials = JSON.parse(storedCredentials);
      } catch (error) {
        console.error("Failed to parse stored credentials", error);
        localStorage.removeItem('gameAdminCredentials');
      }
    }
  }

  // Check if credentials are set
  hasCredentials(): boolean {
    return this.credentials !== null;
  }

  // Clear credentials
  clearCredentials() {
    this.credentials = null;
    localStorage.removeItem('gameAdminCredentials');
  }

  // Helper method for API requests
  private async request<T>(endpoint: string, data: any): Promise<T> {
    if (!this.credentials) {
      throw new Error("API credentials not set");
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.credentials.apiKey,
          'X-Signature': this.credentials.signature,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in API request to ${endpoint}:`, error);
      throw error;
    }
  }

  // Post a Most Likely question
  async postMostLikelyQuestion(data: MostLikelyQuestion): Promise<any> {
    return this.request<any>('/admin/daily-games/most-likely/questions', data);
  }

  // Post a Silly question
  async postSillyQuestion(data: SillyQuestion): Promise<any> {
    return this.request<any>('/admin/daily-games/silly-questions', data);
  }

  // Post a This or That pairing
  async postThisOrThatPairing(data: ThisOrThatPairing): Promise<any> {
    return this.request<any>('/admin/daily-games/this-or-that/pairings', data);
  }
}

// Create a singleton instance
export const dailyGamesApi = new DailyGamesApi();

// Helper function to handle API errors
export const handleApiError = (error: unknown, fallbackMessage = "An error occurred") => {
  const message = error instanceof Error ? error.message : fallbackMessage;
  toast.error(message);
  return message;
};
