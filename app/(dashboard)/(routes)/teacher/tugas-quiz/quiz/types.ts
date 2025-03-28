export type Quiz = {
    id: string;
    title: string;
    description: string;
    kelas: string;
    duration: number;
    deadline: string;
    isRandomized: boolean;
    showScore: boolean;
    courseId?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    _count: {
      results: number;
    };
    questions: {
      id: string;
      text: string;
      type: string;
      options: string[];
      correctAnswer: number;
      points: number;
      quizId: string;
      createdAt: string;
      updatedAt: string;
    }[];
    course?: {
      title: string;
      id: string;
    };
  };
  
  export type QuizStats = {
    totalQuizzes: number;
    activeQuizzes: number;
    quizzesNeedGrading: number;
    averageScore: number;
  };

  export type QuizExportData = {
    id: string;
    title: string;
    description: string;
    kelas: string;
    duration: number;
    deadline: string;
    status: string;
    participants: number;
    courseTitle: string;
  };