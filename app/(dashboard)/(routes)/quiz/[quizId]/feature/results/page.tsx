"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Clock, Users, Check, X, ArrowLeft, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from 'react-hot-toast';

type QuizResult = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  score: number;
  submittedAt: string;
  answers: Array<{
    questionId: string;
    questionText: string;
    userAnswer: any;
    correctAnswer: any;
    isCorrect: boolean;
    points: number;
    maxPoints: number;
  }>;
};

type QuizDetails = {
  id: string;
  title: string;
  description: string;
  kelas: string;
  deadline: string;
  participants: number;
  averageScore: number;
};

export default function QuizResultsPage() {
  const { quizId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizDetails | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);

  // Fetch quiz results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        // Fetch quiz details
        const quizResponse = await fetch(`/api/quizzes/${quizId}`);
        if (!quizResponse.ok) throw new Error('Gagal memuat detail quiz');
        const quizData = await quizResponse.json();
        
        // Fetch results
        const resultsResponse = await fetch(`/api/quizzes/${quizId}/results`);
        if (!resultsResponse.ok) throw new Error('Gagal memuat hasil quiz');
        const resultsData = await resultsResponse.json();

        // Parse answers if they're stored as JSON strings
        const parsedResults = resultsData.results.map((result: any) => ({
          ...result,
          answers: typeof result.answers === 'string' 
            ? JSON.parse(result.answers) 
            : result.answers
        }));

        setQuiz({
          id: quizData.id,
          title: quizData.title,
          description: quizData.description,
          kelas: quizData.kelas,
          deadline: quizData.deadline,
          participants: quizData._count?.results || 0,
          averageScore: resultsData.averageScore || 0
        });

        setResults(parsedResults);
      } catch (error) {
        toast.error('Gagal memuat hasil quiz');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  const handleExportResults = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}/results/export`);
      if (!response.ok) throw new Error('Gagal mengekspor hasil');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hasil-quiz-${quiz?.title || quizId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      toast.success('Hasil berhasil diekspor');
    } catch (error) {
      toast.error('Gagal mengekspor hasil');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <p>Memuat hasil quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Quiz tidak ditemukan</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/quiz')}
          >
            Kembali ke Daftar Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.push('/quiz')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleExportResults}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Ekspor Hasil
          </Button>
        </div>
      </div>

      {/* Quiz Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Judul Quiz</CardDescription>
            <CardTitle className="text-lg">{quiz.title}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Kelas</CardDescription>
            <CardTitle className="text-lg">{quiz.kelas}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Peserta</CardDescription>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <CardTitle className="text-lg">{quiz.participants}</CardTitle>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rata-rata Nilai</CardDescription>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{quiz.averageScore.toFixed(1)}%</CardTitle>
              <Progress value={quiz.averageScore} className="h-2 w-full" />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Hasil Quiz</CardTitle>
          <CardDescription>
            Daftar peserta dan nilai yang diperoleh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Peserta</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead>Waktu Submit</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Belum ada hasil yang tercatat
                  </TableCell>
                </TableRow>
              ) : (
                results.map((result, index) => (
                  <TableRow key={result.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{result.user.name}</TableCell>
                    <TableCell>{result.user.email}</TableCell>
                    <TableCell>
                      <Badge variant={result.score >= 70 ? 'default' : result.score >= 50 ? 'secondary' : 'destructive'}>
                        {result.score}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(result.submittedAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedResult(result)}
                      >
                        Detail Jawaban
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Answer Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Detail Jawaban</CardTitle>
              <CardDescription>
                {selectedResult.user.name} - Nilai: {selectedResult.score}%
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedResult.answers.map((answer, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      {answer.isCorrect ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {index + 1}. {answer.questionText}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Jawaban peserta:</span> {String(answer.userAnswer)}
                        </p>
                        {!answer.isCorrect && (
                          <p className="text-sm">
                            <span className="font-medium">Jawaban benar:</span> {String(answer.correctAnswer)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {answer.points}/{answer.maxPoints} poin
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setSelectedResult(null)}>
                Tutup
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}