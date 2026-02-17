export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id?: string;
  questionText: string;
  options: Option[];
  points: number;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  createdBy: string | User;
  questions: Question[];
  totalPoints: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attempt {
  _id: string;
  quizId: string | Quiz;
  userId: string | User;
  answers: {
    questionIndex: number;
    selectedOptionIndex: number;
  }[];
  score: number;
  totalPoints: number;
  percentage: number;
  completedAt: string;
  timeTaken: number;
}
