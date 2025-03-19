import { apiClient } from './client';
import { MostLikelyQuestion, MostLikelyQuestionsResponse, MostLikelyImageUploadUrlRequest, MostLikelyImageUploadUrlResponse } from './models';

export const mostLikelyApi = {
  postMostLikelyQuestion: async (data: MostLikelyQuestion) => {
    try {
      const response = await apiClient.fetchWithAuth('https://api.staging.miloapp.in/admin/daily-games/most-likely/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      return await apiClient.handleResponse(response);
    } catch (error) {
      console.error('Failed to post most likely question:', error);
      throw error;
    }
  },
  
  getMostLikelyQuestions: async (date: string): Promise<MostLikelyQuestionsResponse> => {
    try {
      const response = await apiClient.fetchWithAuth(`https://api.staging.miloapp.in/admin/daily-games/most-likely/questions?date=${date}`, {
        method: 'GET'
      });
      
      return await apiClient.handleResponse(response);
    } catch (error) {
      console.error('Failed to get most likely questions:', error);
      throw error;
    }
  },
  
  deleteMostLikelyQuestion: async (questionId: string) => {
    try {
      const response = await apiClient.fetchWithAuth(`https://api.staging.miloapp.in/admin/daily-games/most-likely/${questionId}`, {
        method: 'DELETE'
      });
      
      return await apiClient.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete most likely question:', error);
      throw error;
    }
  },

  getMostLikelyImageUploadUrl: async (contentType: string): Promise<MostLikelyImageUploadUrlResponse> => {
    console.log('Getting image upload URL for content type:', contentType);
    try {
      const response = await apiClient.fetchWithAuth(`https://api.staging.miloapp.in/admin/daily-games/most-likely/upload-url`, {
        method: 'GET',
        headers: {
          'Content-Type': contentType
        }
      });
      
      return await apiClient.handleResponse(response);
    } catch (error) {
      console.error('Failed to get image upload URL:', error);
      throw error;
    }
  }
};
