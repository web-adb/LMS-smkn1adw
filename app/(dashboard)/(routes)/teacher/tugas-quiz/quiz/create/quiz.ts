export type Question = {
    text: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    options: string[];
    correctAnswer: number;
    points: number;
    correctShortAnswer?: string;
  };
  
  export type QuizData = {
    title: string;
    description: string;
    kelas: string;
    duration: number;
    deadline: string;
    isRandomized: boolean;
    showScore: boolean;
    questions: Question[];
  };