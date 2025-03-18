
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
  mostLikelyQuestions: MostLikelyQuestionResponse[];
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
