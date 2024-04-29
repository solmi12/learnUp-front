export interface QuizDto {
    quizId?: number;
    courId: number;
    questions: string[]; 
    correctResponses: string[][];
    falseResponses: string[][];
    userResponses: string[];
    isCorrect: boolean[];
  }
  