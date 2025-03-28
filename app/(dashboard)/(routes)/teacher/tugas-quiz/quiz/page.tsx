"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, FileUp, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { Quiz, QuizStats } from "./types";
import { QuizStatsCards } from "./QuizStatsCards";
import { QuizTable } from "./QuizTable";
import { DeleteQuizModal } from "./DeleteQuizModal";
import { prepareQuizExportData, exportToCSV } from "./exportUtils";

export default function QuizPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [stats, setStats] = useState<QuizStats>({
    totalQuizzes: 0,
    activeQuizzes: 0,
    quizzesNeedGrading: 0,
    averageScore: 0,
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/quizzes?withStats=true");

      if (!response.ok) {
        throw new Error("Gagal memuat data quiz");
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
      toast.error("Gagal memuat data quiz");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const exportData = prepareQuizExportData(quizzes);
      exportToCSV(exportData, `data-quiz-${new Date().toISOString().slice(0,10)}.csv`);
      toast.success("Data berhasil diexport");
    } catch (error) {
      toast.error("Gagal mengexport data");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const openDeleteModal = (quiz: Quiz) => {
    setQuizToDelete(quiz);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setQuizToDelete(null);
  };

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/quizzes/${quizToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus quiz");
      }

      await fetchQuizzes();
      toast.success("Quiz berhasil dihapus");
      closeDeleteModal();
    } catch (error) {
      toast.error("Gagal menghapus quiz");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <DeleteQuizModal
        isOpen={deleteModalOpen}
        quiz={quizToDelete}
        isDeleting={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteQuiz}
      />

      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Pusat Evaluasi Pembelajaran
                </h1>
                <p className="text-blue-100 mt-1 text-sm md:text-base">
                  Kelola dan pantau seluruh aktivitas penilaian siswa
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-4 w-full">
            <Button 
                variant="outline"
                className="gap-2 bg-white/10 text-white hover:bg-white/20 border-white"
                onClick={handleExport}
              >
                <FileUp className="w-4 h-4" />
                <span>Export Data</span>
              </Button>
              <Button
                className="gap-2 bg-white text-indigo-700 hover:bg-white/90 hover:text-indigo-800 shadow-md transition-all"
                onClick={() => router.push("/teacher/tugas-quiz/quiz/create")}
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Quiz</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari quiz (ID, judul, kelas, atau mata pelajaran)..."
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
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Aktif
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("ended")}>
                Selesai
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <QuizStatsCards stats={stats} />

      <QuizTable
        quizzes={quizzes}
        loading={loading}
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        onDeleteClick={openDeleteModal}
      />
    </div>
  );
}