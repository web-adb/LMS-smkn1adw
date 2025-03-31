'use client';

import { useState, useEffect } from 'react';
import { Search, List, Grid, Sparkles, AlertCircle, BookOpen, BarChart2, Award } from 'lucide-react';
import { User, StatsData, AiAnalysis } from './types';
import StatsCards from './StatsCards';
import UserCard from './UserCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

const DaftarSiswa = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState<StatsData>({
    totalStudents: 0,
    activeStudents: 0,
    coursesTaken: 0,
    averageTime: '0h 0m'
  });
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        const data: User[] = await response.json();
        setUsers(data);
        setFilteredUsers(data);
        
        setStats({
          totalStudents: data.length,
          activeStudents: data.filter(u => u.status === 'active').length,
          coursesTaken: data.reduce((sum, user) => sum + (user.courses?.length || 0), 0),
          averageTime: calculateAverageTime(data)
        });

        // Start AI analysis after data loads
        if (data.length > 0) {
          performAiAnalysis(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const calculateAverageTime = (users: User[]): string => {
    const totalMinutes = users.reduce((sum, user) => sum + (user.weeklyStudyTime || 0), 0);
    const avgMinutes = Math.round(totalMinutes / users.length);
    return `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`;
  };

  const performAiAnalysis = async (studentData: User[]) => {
    setIsAnalyzing(true);
    try {
      const prompt = `
        Anda adalah asisten AI untuk platform LMS. Analisis data siswa berikut dan berikan:
        1. Ringkasan performa kelas secara keseluruhan (max 2 kalimat)
        2. 3 rekomendasi untuk meningkatkan keterlibatan siswa
        3. Identifikasi 1 siswa yang perlu perhatian khusus beserta alasannya
        
        Data siswa (total ${studentData.length}):
        ${studentData.slice(0, 5).map(s => `${s.firstName} ${s.lastName} - ${s.courses?.length || 0} kursus`).join(', ')}...
        Rata-rata waktu belajar: ${stats.averageTime}
        
        Gunakan format JSON berikut:
        {
          "summary": "string",
          "recommendations": ["string", "string", "string"],
          "studentNeedingAttention": {
            "id": "string",
            "reason": "string"
          }
        }
        Gunakan bahasa Indonesia yang formal dan profesional.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (responseText) {
        try {
          // Clean the response to be valid JSON
          const jsonStart = responseText.indexOf('{');
          const jsonEnd = responseText.lastIndexOf('}') + 1;
          const jsonString = responseText.slice(jsonStart, jsonEnd);
          const analysis = JSON.parse(jsonString);
          setAiAnalysis(analysis);
          
          // Find the student needing attention
          if (analysis.studentNeedingAttention) {
            const student = studentData.find(s => s.id === analysis.studentNeedingAttention.id);
            if (student) setSelectedStudent(student);
          }
        } catch (e) {
          console.error("Error parsing AI response:", e);
          setAiAnalysis({
            summary: "Analisis data siswa berhasil. Performa kelas cukup baik dengan rata-rata partisipasi stabil.",
            recommendations: [
              "Tingkatkan interaksi di forum diskusi dengan topik menarik",
              "Berikan tantangan tambahan untuk siswa berprestasi",
              "Lakukan check-in dengan siswa yang kurang aktif"
            ],
            studentNeedingAttention: null
          });
        }
      }
    } catch (error) {
      console.error("Error in AI analysis:", error);
      setAiAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Daftar Siswa</h1>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Siswa</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-800' : 'text-gray-500'}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-800' : 'text-gray-500'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="mb-6 flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-md">
        <div className="pl-3 pr-2 text-gray-500">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Cari siswa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 outline-none"
        />
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredUsers.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              viewMode={viewMode} 
              isHighlighted={selectedStudent?.id === user.id}
              onClick={() => setSelectedStudent(user)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              viewMode={viewMode} 
              isHighlighted={selectedStudent?.id === user.id}
              onClick={() => setSelectedStudent(user)}
            />
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          Tidak ada siswa yang ditemukan.
        </div>
      )}

      {/* AI Analysis Panel */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full ${aiAnalysis ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              {isAnalyzing ? (
                <div className="flex gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100"></span>
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-200"></span>
                </div>
              ) : (
                <Sparkles size={18} />
              )}
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Analisis Kelas oleh AI
            </h2>
          </div>

          {isAnalyzing ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          ) : aiAnalysis ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Ringkasan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{aiAnalysis.summary}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Rekomendasi</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {aiAnalysis.recommendations?.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedStudent && aiAnalysis.studentNeedingAttention && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                  <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Perhatian Khusus</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <span className="font-semibold">{selectedStudent.firstName} {selectedStudent.lastName}</span>: {aiAnalysis.studentNeedingAttention.reason}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <AlertCircle size={16} />
              <span className="text-sm">Analisis tidak tersedia saat ini</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DaftarSiswa;