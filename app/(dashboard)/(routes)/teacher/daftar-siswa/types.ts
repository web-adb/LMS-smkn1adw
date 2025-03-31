export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string;
    status: 'active' | 'inactive';
    courses?: string[];
    weeklyStudyTime?: number;
  }
  
  export interface StatsData {
    totalStudents: number;
    activeStudents: number;
    coursesTaken: number;
    averageTime: string;
  }

  export interface AiAnalysis {
    summary: string;
    recommendations: string[];
    studentNeedingAttention: {
      id: string;
      reason: string;
    } | null;
  }