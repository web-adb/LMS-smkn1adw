"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, FileUp, MoreVertical, Clock, Calendar, BookOpen, BarChart, Edit, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from 'react-hot-toast';

type Quiz = {
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

type QuizStats = {
  totalQuizzes: number;
  activeQuizzes: number;
  quizzesNeedGrading: number;
  averageScore: number;
};

export default function QuizPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [stats, setStats] = useState<QuizStats>({
    totalQuizzes: 0,
    activeQuizzes: 0,
    quizzesNeedGrading: 0,
    averageScore: 0,
  });

  // Fetch quizzes data with stats
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/quizzes?withStats=true');
      
      if (!response.ok) {
        throw new Error('Gagal memuat data quiz');
      }

      const data = await response.json();
      setQuizzes(data.quizzes);
      setStats({
        totalQuizzes: data.totalQuizzes,
        activeQuizzes: data.activeQuizzes,
        quizzesNeedGrading: data.quizzesNeedGrading,
        averageScore: data.averageScore,
      });
    } catch (error) {
      toast.error('Gagal memuat data quiz');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Handle quiz deletion
  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus quiz ini?')) return;

    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus quiz');
      }

      await fetchQuizzes(); // Refresh data after deletion
      toast.success('Quiz berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus quiz');
      console.error(error);
    }
  };

  // Filter quizzes based on search and status
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         quiz.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (quiz.course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'active' && new Date(quiz.deadline) > new Date()) ||
                         (filterStatus === 'ended' && new Date(quiz.deadline) <= new Date());
    return matchesSearch && matchesStatus;
  });

  // Get quiz status
  const getQuizStatus = (deadline: string) => {
    return new Date(deadline) > new Date() ? 'active' : 'ended';
  };

  // Calculate participants (assuming each result is one participant)
  const getParticipantsCount = (quiz: Quiz) => {
    return quiz._count?.results || 0;
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Quiz</h1>
          <p className="text-gray-600 mt-2">
            Kelola quiz, ujian, dan evaluasi pembelajaran
          </p>
        </div>
        <Button 
          className="gap-2"
          onClick={() => router.push('/quiz/new')}
        >
          <Plus className="w-4 h-4" />
          Buat Quiz Baru
        </Button>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari quiz (judul, kelas, atau mata pelajaran)..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                Semua
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                Aktif
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('ended')}>
                Selesai
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="gap-2">
            <FileUp className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Quiz</p>
              <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Aktif</p>
              <p className="text-2xl font-bold">{stats.activeQuizzes}</p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Perlu Dinilai</p>
              <p className="text-2xl font-bold">{stats.quizzesNeedGrading}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-50 text-amber-600">
              <FileUp className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rata-rata Nilai</p>
              <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-50 text-purple-600">
              <BarChart className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[120px]">ID Quiz</TableHead>
              <TableHead>Judul Quiz</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Peserta</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Memuat data quiz...
                </TableCell>
              </TableRow>
            ) : filteredQuizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {searchTerm || filterStatus ? 'Tidak ada quiz yang sesuai dengan filter' : 'Belum ada quiz'}
                </TableCell>
              </TableRow>
            ) : (
              filteredQuizzes.map((quiz) => {
                const status = getQuizStatus(quiz.deadline);
                const participants = getParticipantsCount(quiz);
                
                return (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.id.slice(0, 6)}...</TableCell>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.kelas}</TableCell>
                    <TableCell>
                      {quiz.course?.title || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {new Date(quiz.deadline).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          status === "active" 
                            ? "default" 
                            : "outline"
                        }
                      >
                        {status === "active" ? "Aktif" : "Selesai"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{participants}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => router.push(`/quiz/${quiz.id}/edit`)}
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => router.push(`/quiz/${quiz.id}/results`)}
                          >
                            <BarChart className="w-4 h-4" />
                            Lihat Hasil
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-red-600"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                          >
                            <Trash className="w-4 h-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}