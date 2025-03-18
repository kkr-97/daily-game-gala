
import { apiClient } from './client';
import { MostLikelyQuestion, MostLikelyQuestionsResponse } from './models';

export const mostLikelyApi = {
  postMostLikelyQuestion: async (data: MostLikelyQuestion) => {
    try {
      const response = await apiClient.fetchWithAuth('http://localhost:8080/admin/daily-games/most-likely/questions', {
        method: 'POST',
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
      const response = await apiClient.fetchWithAuth(`http://localhost:8080/daily-games/most-likely/daily-questions?date=${date}`, {
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
      const response = await apiClient.fetchWithAuth(`http://localhost:8080/admin/daily-games/most-likely/${questionId}`, {
        method: 'DELETE'
      });
      
      return await apiClient.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete most likely question:', error);
      throw error;
    }
  }
};
