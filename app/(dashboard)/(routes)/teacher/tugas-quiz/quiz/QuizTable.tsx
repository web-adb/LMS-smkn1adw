"use client";

import { Calendar, Edit, BarChart, Trash, MoreVertical, Copy, Check, Loader2  } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Quiz } from "./types";
import { QuizSkeleton, QuizRowSkeleton } from "./QuizSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface QuizTableProps {
  quizzes: Quiz[];
  loading: boolean;
  searchTerm: string;
  filterStatus: string | null;
  onDeleteClick: (quiz: Quiz) => void;
  onDeleteMultiple?: (quizIds: string[]) => Promise<void>;
}

export function QuizTable({
  quizzes,
  loading,
  searchTerm,
  filterStatus,
  onDeleteClick,
  onDeleteMultiple,
}: QuizTableProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [currentlyDeletingId, setCurrentlyDeletingId] = useState<string | null>(null);

  const getQuizStatus = (deadline: string) => {
    return new Date(deadline) > new Date() ? "active" : "ended";
  };

  const getParticipantsCount = (quiz: Quiz) => {
    return quiz._count?.results || 0;
  };

  const getDeadlineStyle = (deadline: string) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let bgColor = "bg-gray-100";
    let textColor = "text-gray-800";
    let borderColor = "border-gray-200";
    
    if (daysDiff <= 0) {
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      borderColor = "border-red-100";
    } else if (daysDiff <= 1) {
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      borderColor = "border-red-100";
    } else if (daysDiff <= 3) {
      bgColor = "bg-amber-50";
      textColor = "text-amber-700";
      borderColor = "border-amber-100";
    } else if (daysDiff <= 7) {
      bgColor = "bg-blue-50";
      textColor = "text-blue-700";
      borderColor = "border-blue-100";
    } else {
      bgColor = "bg-green-50";
      textColor = "text-green-700";
      borderColor = "border-green-100";
    }

    return { bgColor, textColor, borderColor, daysDiff };
  };

  const getFormattedDeadline = (deadline: string, daysDiff: number) => {
    const dateStr = new Date(deadline).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (daysDiff <= 0) {
      return { date: dateStr, status: "Terlewat" };
    } else if (daysDiff === 1) {
      return { date: dateStr, status: "Besok" };
    } else if (daysDiff <= 3) {
      return { date: dateStr, status: `${daysDiff} hari` };
    } else {
      return { date: dateStr, status: "" };
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.kelas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      !filterStatus ||
      (filterStatus === "active" && new Date(quiz.deadline) > new Date()) ||
      (filterStatus === "ended" && new Date(quiz.deadline) <= new Date());
    return matchesSearch && matchesStatus;
  });

  const toggleQuizSelection = (quizId: string) => {
    setSelectedQuizzes(prev =>
      prev.includes(quizId)
        ? prev.filter(id => id !== quizId)
        : [...prev, quizId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedQuizzes.length === filteredQuizzes.length) {
      setSelectedQuizzes([]);
    } else {
      setSelectedQuizzes(filteredQuizzes.map(quiz => quiz.id));
    }
  };

  const handleDeleteMultiple = () => {
    setShowConfirmDialog(true);
  };

  const confirmDeleteMultiple = async () => {
    if (onDeleteMultiple && selectedQuizzes.length > 0) {
      try {
        setIsDeletingMultiple(true);
        await onDeleteMultiple(selectedQuizzes);
        setSelectedQuizzes([]);
      } finally {
        setIsDeletingMultiple(false);
        setShowConfirmDialog(false);
      }
    }
  };

  const cancelDeleteMultiple = () => {
    setShowConfirmDialog(false);
  };

  const handleSingleDelete = async (quiz: Quiz) => {
    setCurrentlyDeletingId(quiz.id);
    try {
      await onDeleteClick(quiz);
    } finally {
      setCurrentlyDeletingId(null);
    }
  };

  if (loading) {
    return <QuizSkeleton />;
  }

  return (
    <div className="relative">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-6">
              Apakah Anda yakin ingin menghapus {selectedQuizzes.length} quiz yang dipilih?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={cancelDeleteMultiple}
                disabled={isDeletingMultiple}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteMultiple}
                disabled={isDeletingMultiple}
              >
                {isDeletingMultiple ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash className="w-4 h-4 mr-2" />
                    Hapus
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {selectedQuizzes.length > 0 && (
          <div className="bg-gray-50 p-2 border-b flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedQuizzes.length} dipilih
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteMultiple}
              disabled={!onDeleteMultiple || selectedQuizzes.length === 0}
            >
              <Trash className="w-4 h-4 mr-2" />
              Hapus yang dipilih
            </Button>
          </div>
        )}
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    filteredQuizzes.length > 0 &&
                    selectedQuizzes.length === filteredQuizzes.length
                  }
                  onCheckedChange={toggleSelectAll}
                  className="translate-y-[2px]"
                />
              </TableHead>
              <TableHead className="w-[120px]">ID Quiz</TableHead>
              <TableHead>Judul Quiz</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead className="w-[180px]">Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Peserta</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {searchTerm || filterStatus
                    ? "Tidak ada quiz yang sesuai dengan filter"
                    : "Belum ada quiz"}
                </TableCell>
              </TableRow>
            ) : (
              filteredQuizzes.map((quiz) => {
                const status = getQuizStatus(quiz.deadline);
                const participants = getParticipantsCount(quiz);
                const { bgColor, textColor, borderColor, daysDiff } = getDeadlineStyle(quiz.deadline);
                const { date, status: deadlineStatus } = getFormattedDeadline(quiz.deadline, daysDiff);

                return (
                  <TableRow key={quiz.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedQuizzes.includes(quiz.id)}
                        onCheckedChange={() => toggleQuizSelection(quiz.id)}
                        className="translate-y-[2px]"
                      />
                    </TableCell>
                    <TableCell className="font-medium group">
                      <div className="flex items-center gap-2">
                        <span>{quiz.id.slice(0, 6)}...</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(quiz.id);
                            setCopiedId(quiz.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700"
                          title="Copy ID"
                        >
                          {copiedId === quiz.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.kelas}</TableCell>
                    <TableCell>
                      <div className={`flex flex-col space-y-1 ${textColor}`}>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{date}</span>
                        </div>
                        {deadlineStatus && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${bgColor} ${borderColor} border w-fit`}>
                            {deadlineStatus}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status === "active" ? "default" : "outline"}>
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
                            onClick={() =>
                              router.push(`/quiz/${quiz.id}/feature/edit`)
                            }
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() =>
                              router.push(`/quiz/${quiz.id}/feature/results`)
                            }
                          >
                            <BarChart className="w-4 h-4" />
                            Lihat Hasil
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-red-600"
                            onClick={() => handleSingleDelete(quiz)}
                            disabled={currentlyDeletingId === quiz.id}
                          >
                            {currentlyDeletingId === quiz.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash className="w-4 h-4" />
                            )}
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