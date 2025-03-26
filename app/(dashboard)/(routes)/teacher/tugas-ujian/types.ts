export interface Tugas {
    id: string;
    judul: string;
    deskripsi: string;
    deadline: Date;
    lampiran?: string;
    selesai: boolean;
    dikumpulkan: boolean;
    nilai?: number;
  }
  
  export interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | undefined;
  }
  
  export type TabType = 'buat' | 'daftar' | 'nilai';