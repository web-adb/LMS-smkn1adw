"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Check, Clock, AlertCircle, BookOpen } from "lucide-react";
import { toast } from 'react-hot-toast';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type Question = {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correctAnswer: number;
  points: number;
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  duration: number;
  deadline: string;
  questions: Question[];
};

type AnswerResult = {
  questionId: string;
  userAnswer: any;
  isCorrect: boolean;
  points: number;
};

type QuizResult = {
  id: string;
  score: number;
  correctAnswers: number;
  answers: AnswerResult[];
};

export default function StudentQuizPage() {
  const router = useRouter();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/quizzes/${quizId}`);
        
        if (!response.ok) {
          throw new Error('Gagal memuat quiz');
        }

        const data = await response.json();
        setQuiz(data);
        setTimeLeft(data.duration * 60);
        
        // Check if user already submitted
        const resultResponse = await fetch(`/api/quizzes/${quizId}/results`);
        if (resultResponse.ok) {
          const resultData = await resultResponse.json();
          if (resultData.results?.length > 0) {
            const submittedResult = resultData.results[0];
            
            // Parse answers safely
            let parsedAnswers: AnswerResult[] = [];
            try {
              parsedAnswers = typeof submittedResult.answers === 'string' 
                ? JSON.parse(submittedResult.answers)
                : submittedResult.answers || [];
            } catch (e) {
              console.error("Error parsing answers:", e);
              parsedAnswers = [];
            }
            
            setSubmitted(true);
            setResult({
              ...submittedResult,
              answers: parsedAnswers
            });

            // Pre-fill answers for review
            const prefilledAnswers: Record<string, string | number> = {};
            parsedAnswers.forEach((answer) => {
              prefilledAnswers[answer.questionId] = answer.userAnswer;
            });
            setAnswers(prefilledAnswers);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
        toast.error(err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (quiz && !submitted && timeLeft > 0) {
      const newTimer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(newTimer);
            handleSubmit(); // Auto submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(newTimer);

      return () => clearInterval(newTimer);
    }
  }, [quiz, submitted]);

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    
    try {
      setLoading(true);
      
      // Format answers for API
      const formattedAnswers = quiz?.questions.map(question => ({
        questionId: question.id,
        answer: answers[question.id] ?? ''
      })).filter(item => item.answer !== '') || [];

      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: formattedAnswers
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengumpulkan quiz');
      }

      const resultData = await response.json();
      
      // Parse answers safely
      let parsedAnswers: AnswerResult[] = [];
      try {
        parsedAnswers = typeof resultData.details === 'string' 
          ? JSON.parse(resultData.details)
          : resultData.details || [];
      } catch (e) {
        console.error("Error parsing result answers:", e);
      }

      setResult({
        ...resultData,
        answers: parsedAnswers
      });
      setSubmitted(true);
      
      if (timer) {
        clearInterval(timer);
      }
      
      toast.success('Quiz berhasil dikumpulkan!');
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      toast.error(error.message || 'Terjadi kesalahan saat mengumpulkan quiz');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading && !quiz) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="text-center">
          <p>Memuat quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-xl font-medium">{error}</p>
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

  if (!quiz) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="text-center">
          <p>Quiz tidak ditemukan</p>
          <Button className="mt-4" onClick={() => router.push('/quiz')}>
            Kembali ke Daftar Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quiz Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{quiz.title}</CardTitle>
              {quiz.description && (
                <CardDescription>{quiz.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  {quiz.questions.length} Pertanyaan
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  Durasi: {quiz.duration} menit
                </span>
              </div>

              <div>
                <Label>Batas Waktu:</Label>
                <p className="text-sm">
                  {new Date(quiz.deadline).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {!submitted && (
                <div className="space-y-2">
                  <Label>Waktu Tersisa:</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="font-medium">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <Progress 
                    value={(timeLeft / (quiz.duration * 60)) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              {submitted && result && (
                <div className="space-y-2">
                  <Label>Hasil:</Label>
                  <div className="flex items-center gap-2">
                    <Badge className="text-lg px-3 py-1">
                      {result.score}%
                    </Badge>
                  </div>
                  <p className="text-sm">
                    {result.correctAnswers} dari {quiz.questions.length} pertanyaan benar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {!submitted && (
            <Button 
              className="w-full"
              onClick={handleSubmit}
              disabled={loading || Object.keys(answers).length < quiz.questions.length}
            >
              {loading ? 'Mengirim...' : 'Kumpulkan Quiz'}
            </Button>
          )}
        </div>

        {/* Questions Section */}
        <div className="lg:col-span-3 space-y-6">
          {quiz.questions.map((question, index) => {
            const questionResult = result?.answers?.find(a => a.questionId === question.id);
            
            return (
              <Card key={question.id} className="relative">
                {submitted && questionResult && (
                  <div className="absolute top-4 right-4">
                    {questionResult.isCorrect ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : (
                      <span className="text-red-500">✕</span>
                    )}
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-lg">
                    Pertanyaan {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-medium">{question.text}</p>
                  
                  {question.type === 'multiple_choice' && (
                    <RadioGroup 
                      value={answers[question.id]?.toString() || ''}
                      onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                      disabled={submitted}
                    >
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={optIndex.toString()} 
                            id={`${question.id}-${optIndex}`}
                          />
                          <Label htmlFor={`${question.id}-${optIndex}`}>
                            {option}
                          </Label>
                          {submitted && question.correctAnswer === optIndex && (
                            <span className="ml-2 text-green-500">✓ Jawaban benar</span>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === 'true_false' && (
                    <RadioGroup 
                      value={answers[question.id]?.toString() || ''}
                      onValueChange={(value) => handleAnswerChange(question.id, value === 'true')}
                      disabled={submitted}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id={`${question.id}-true`} />
                        <Label htmlFor={`${question.id}-true`}>Benar</Label>
                        {submitted && question.correctAnswer === 1 && (
                          <span className="ml-2 text-green-500">✓ Jawaban benar</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id={`${question.id}-false`} />
                        <Label htmlFor={`${question.id}-false`}>Salah</Label>
                        {submitted && question.correctAnswer === 0 && (
                          <span className="ml-2 text-green-500">✓ Jawaban benar</span>
                        )}
                      </div>
                    </RadioGroup>
                  )}

                  {question.type === 'short_answer' && (
                    <div className="space-y-2">
                      <Input
                        value={answers[question.id]?.toString() || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Ketik jawaban Anda"
                        disabled={submitted}
                      />
                      {submitted && question.options && (
                        <p className="text-sm text-gray-600">
                          Jawaban benar: {question.options[question.correctAnswer]}
                        </p>
                      )}
                    </div>
                  )}

                  {submitted && questionResult && (
                    <div className="text-sm text-gray-600 mt-2">
                      Poin: {questionResult.points}/{question.points}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {!submitted && (
            <div className="flex justify-end">
              <Button 
                size="lg"
                onClick={handleSubmit}
                disabled={loading || Object.keys(answers).length < quiz.questions.length}
              >
                {loading ? 'Mengirim...' : 'Kumpulkan Quiz'}
              </Button>
            </div>
          )}

          {submitted && (
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold mb-2">
                Quiz Selesai!
              </h3>
              <p className="text-lg mb-4">
                Nilai Anda: <span className="font-bold">{result?.score}%</span>
              </p>
              <p className="mb-6">
                {result?.correctAnswers} dari {quiz.questions.length} pertanyaan benar
              </p>
              <Button onClick={() => router.push('/quiz')}>
                Kembali ke Daftar Quiz
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}