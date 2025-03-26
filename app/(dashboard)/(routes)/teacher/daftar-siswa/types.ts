export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string;
  }
  
  export interface StatsData {
    totalStudents: number;
    activeStudents: number;
    coursesTaken: number;
    averageTime: string;
  }