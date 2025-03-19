import { apiClient } from './client';
import { ThisOrThatPairing, ThisOrThatPairingResponse } from './models';

export const thisOrThatApi = {
  postThisOrThatPairing: async (data: ThisOrThatPairing) => {
    try {
      const response = await apiClient.fetchWithAuth('https://api.staging.miloapp.in/admin/daily-games/this-or-that/pairings', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      return await apiClient.handleResponse(response);
    } catch (error) {
      console.error('Failed to post this or that pairing:', error);
      throw error;
    }
  },
  
  getThisOrThatPairings: async (date: string): Promise<ThisOrThatPairingResponse[]> => {
    try {
      const response = await apiClient.fetchWithAuth(`https://api.staging.miloapp.in/admin/daily-games/this-or-that/pairings?date=${date}`, {
        method: 'GET'
      });
      
      return await apiClient.handleResponse(response);
    } catch (error) {
      console.error('Failed to get this or that pairings:', error);
      throw error;
    }
  },
  
  deleteThisOrThatPairing: async (pairingId: string) => {
    try {
      const response = await apiClient.fetchWithAuth(`https://api.staging.miloapp.in/admin/daily-games/this-or-that/pairings/${pairingId}`, {
        method: 'DELETE'
      });
      
      return await apiClient.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete this or that pairing:', error);
      throw error;
    }
  }
};
