"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, Users, BookOpen, BarChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/components/ui/use-toast';

type QuizResult = {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  score: number;
  answers: {
    questionId: string;
    questionText: string;
    userAnswer: any;
    correctAnswer: any;
    isCorrect: boolean;
    points: number;
    maxPoints: number;
  }[];
  submittedAt: string;
};

type QuizDetails = {
  id: string;
  title: string;
  description: string;
  kelas: string;
  course?: {
    title: string;
  };
  questions: {
    id: string;
    text: string;
    points: number;
  }[];
};

export default function QuizResultsPage() {
  const { quizId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [quiz, setQuiz] = useState<QuizDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);

  // Fetch quiz results and details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch quiz details
        const quizResponse = await fetch(`/api/quizzes/${quizId}`);
        if (!quizResponse.ok) throw new Error('Failed to fetch quiz details');
        const quizData = await quizResponse.json();
        setQuiz(quizData);

        // Fetch results
        const resultsResponse = await fetch(`/api/quizzes/${quizId}/results`);
        if (!resultsResponse.ok) throw new Error('Failed to fetch results');
        const resultsData = await resultsResponse.json();
        
        // Parse answers if they're stored as JSON string
        const parsedResults = resultsData.map((result: any) => ({
          ...result,
          answers: typeof result.answers === 'string' 
            ? JSON.parse(result.answers) 
            : result.answers
        }));
        
        setResults(parsedResults);
        
        // Select the first result by default
        if (parsedResults.length > 0) {
          setSelectedResult(parsedResults[0]);
        }

      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat hasil quiz",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId, toast]);

  // Calculate statistics
  const calculateStats = () => {
    if (!results.length) return null;

    const totalParticipants = results.length;
    const averageScore = results.reduce((sum, result) => sum + result.score, 0) / totalParticipants;
    const highestScore = Math.max(...results.map(r => r.score));
    const lowestScore = Math.min(...results.map(r => r.score));

    return {
      totalParticipants,
      averageScore,
      highestScore,
      lowestScore,
    };
  };

  const stats = calculateStats();

  // Export to CSV
  const handleExport = () => {
    if (!results.length) return;

    const headers = ["Nama", "Email", "Skor", "Tanggal Submit"];
    const csvContent = [
      headers.join(","),
      ...results.map(result => 
        [
          `"${result.user.name}"`,
          `"${result.user.email}"`,
          result.score,
          new Date(result.submittedAt).toLocaleString()
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hasil-quiz-${quiz?.title || quizId}.csv`);
    link.click();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
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
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.push(`/quiz/${quizId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Cetak
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Judul Quiz</CardTitle>
            <BookOpen className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.title}</div>
            {quiz.description && (
              <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kelas</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.kelas}</div>
            {quiz.course && (
              <p className="text-sm text-gray-500 mt-1">{quiz.course.title}</p>
            )}
          </CardContent>
        </Card>

        {stats && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Statistik</CardTitle>
              <BarChart className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Peserta:</span>
                  <span className="font-medium">{stats.totalParticipants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rata-rata Nilai:</span>
                  <span className="font-medium">{stats.averageScore.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Nilai Tertinggi:</span>
                  <span className="font-medium">{stats.highestScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Nilai Terendah:</span>
                  <span className="font-medium">{stats.lowestScore}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Daftar Peserta */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Peserta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {results.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada peserta</p>
                ) : (
                  results.map(result => (
                    <div 
                      key={result.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedResult?.id === result.id 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedResult(result)}
                    >
                      <div className="font-medium">{result.user.name}</div>
                      <div className="text-sm text-gray-500">{result.user.email}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm">Skor:</span>
                        <Badge variant={result.score >= 70 ? 'default' : 'destructive'}>
                          {result.score}%
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detail Hasil */}
        <div className="lg:col-span-3">
          {selectedResult ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Detail Hasil</CardTitle>
                    <div className="text-sm text-gray-500">
                      {selectedResult.user.name} • {selectedResult.user.email}
                    </div>
                  </div>
                  <Badge variant={selectedResult.score >= 70 ? 'default' : 'destructive'}>
                    Skor: {selectedResult.score}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span>Progress</span>
                    <span>{selectedResult.score}%</span>
                  </div>
                  <Progress value={selectedResult.score} />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pertanyaan</TableHead>
                      <TableHead>Jawaban</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Poin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedResult.answers.map((answer, index) => {
                      const question = quiz.questions.find(q => q.id === answer.questionId);
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {question?.text || answer.questionText}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">Jawaban:</div>
                              <div className="text-sm">
                                {typeof answer.userAnswer === 'boolean' 
                                  ? answer.userAnswer ? 'Benar' : 'Salah'
                                  : answer.userAnswer}
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="font-medium">Kunci Jawaban:</div>
                              <div className="text-sm">
                                {typeof answer.correctAnswer === 'boolean'
                                  ? answer.correctAnswer ? 'Benar' : 'Salah'
                                  : answer.correctAnswer}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={answer.isCorrect ? 'default' : 'destructive'}>
                              {answer.isCorrect ? 'Benar' : 'Salah'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {answer.points}/{answer.maxPoints}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Detail Hasil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Pilih peserta untuk melihat detail hasil</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}