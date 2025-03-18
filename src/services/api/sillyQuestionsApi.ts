
import { apiClient } from './client';
import { SillyQuestion, SillyQuestionResponse } from './models';

export const sillyQuestionsApi = {
  postSillyQuestion: async (data: SillyQuestion) => {
    try {
      const response = await apiClient.fetchWithAuth('http://localhost:8080/admin/daily-games/silly-questions', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      return await apiClient.handleResponse(response);
    } catch (error) {
      console.error('Failed to post silly question:', error);
      throw error;
    }
  },
  
  getSillyQuestions: async (date: string): Promise<SillyQuestionResponse> => {
    try {
      const response = await apiClient.fetchWithAuth(`http://localhost:8080/daily-games/silly-questions/daily?date=${date}`, {
        method: 'GET'
      });
      
      return await apiClient.handleResponse(response);
    } catch (error) {
      console.error('Failed to get silly questions:', error);
      throw error;
    }
  },
  
  deleteSillyQuestion: async (questionId: string) => {
    try {
      const response = await apiClient.fetchWithAuth(`http://localhost:8080/admin/daily-games/silly-questions/${questionId}`, {
        method: 'DELETE'
      });
      
      return await apiClient.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete silly question:', error);
      throw error;
    }
  }
};
