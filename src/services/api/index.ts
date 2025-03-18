export * from './client';
export * from './models';
export * from './sillyQuestionsApi';
export * from './mostLikelyApi';
export * from './thisOrThatApi';

import { apiClient, handleApiError } from './client';
import { sillyQuestionsApi } from './sillyQuestionsApi';
import { mostLikelyApi } from './mostLikelyApi';
import { thisOrThatApi } from './thisOrThatApi';

// Create a combined API object that maintains the original interface
export const dailyGamesApi = {
  // Auth methods from apiClient
  hasCredentials: apiClient.hasCredentials,
  getCredentials: apiClient.getCredentials,
  setCredentials: apiClient.setCredentials,
  clearCredentials: apiClient.clearCredentials,
  
  // Silly Questions API
  postSillyQuestion: sillyQuestionsApi.postSillyQuestion,
  getSillyQuestions: sillyQuestionsApi.getSillyQuestions,
  deleteSillyQuestion: sillyQuestionsApi.deleteSillyQuestion,
  
  // Most Likely API
  postMostLikelyQuestion: mostLikelyApi.postMostLikelyQuestion,
  getMostLikelyQuestions: mostLikelyApi.getMostLikelyQuestions,
  deleteMostLikelyQuestion: mostLikelyApi.deleteMostLikelyQuestion,
  getMostLikelyImageUploadUrl: mostLikelyApi.getMostLikelyImageUploadUrl,
  
  // This or That API
  postThisOrThatPairing: thisOrThatApi.postThisOrThatPairing,
  getThisOrThatPairings: thisOrThatApi.getThisOrThatPairings,
  deleteThisOrThatPairing: thisOrThatApi.deleteThisOrThatPairing
};
