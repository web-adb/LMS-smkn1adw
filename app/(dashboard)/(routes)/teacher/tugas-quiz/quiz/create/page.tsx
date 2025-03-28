// app/create/page.tsx
"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash, Clock, Calendar, BookOpen, Save, X, ChevronDown, ChevronUp, Share2, Copy, Check, X as XIcon, Upload, FileText, File, FileInput } from "lucide-react";
import { toast } from 'react-hot-toast';
import { QuizData, Question } from "./quiz";
import { readTextFile, readPdfFile, readDocxFile, parseQuestionsFromText } from "./fileImport";
import { QuizDetailsForm } from "./QuizDetailsForm";
import { QuestionList } from "./QuestionList";
import { NewQuestionForm } from "./NewQuestionForm";
import { QuizPreview } from "./QuizPreview";
import { ShareQuizDialog } from "./ShareQuizDialog";

export default function CreateQuizPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [quizData, setQuizData] = useState<QuizData>({
    title: '',
    description: '',
    kelas: '',
    duration: 60,
    deadline: '',
    isRandomized: false,
    showScore: true,
    questions: []
  });

  const [activeTab, setActiveTab] = useState('details');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [quizLink, setQuizLink] = useState('');

  const addQuestion = (question: Question) => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, question]
    });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions.splice(index, 1);
    setQuizData({...quizData, questions: updatedQuestions});
  };

  const moveQuestionUp = (index: number) => {
    if (index > 0) {
      const updatedQuestions = [...quizData.questions];
      [updatedQuestions[index], updatedQuestions[index-1]] = [updatedQuestions[index-1], updatedQuestions[index]];
      setQuizData({...quizData, questions: updatedQuestions});
    }
  };

  const moveQuestionDown = (index: number) => {
    if (index < quizData.questions.length - 1) {
      const updatedQuestions = [...quizData.questions];
      [updatedQuestions[index], updatedQuestions[index+1]] = [updatedQuestions[index+1], updatedQuestions[index]];
      setQuizData({...quizData, questions: updatedQuestions});
    }
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuizData({...quizData, questions: updatedQuestions});
  };

  const handleCorrectAnswerChange = (qIndex: number, correctIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].correctAnswer = correctIndex;
    setQuizData({...quizData, questions: updatedQuestions});
  };

  const addOption = (qIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options.push('');
    setQuizData({...quizData, questions: updatedQuestions});
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options.splice(optIndex, 1);
    if (updatedQuestions[qIndex].correctAnswer >= optIndex) {
      updatedQuestions[qIndex].correctAnswer = Math.max(0, updatedQuestions[qIndex].correctAnswer - 1);
    }
    setQuizData({...quizData, questions: updatedQuestions});
  };

  const handleSaveQuiz = async () => {
    if (!quizData.title || !quizData.kelas || !quizData.deadline || quizData.questions.length === 0) {
      toast.error('Harap lengkapi semua field yang diperlukan');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...quizData,
          deadline: new Date(quizData.deadline).toISOString(),
          questions: quizData.questions.map(q => ({
            text: q.text,
            type: q.type,
            options: q.type === 'short_answer' ? [q.correctShortAnswer || q.options[0] || ''] : q.options.filter(opt => opt.trim() !== ''),
            correctAnswer: q.correctAnswer,
            points: q.points
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan quiz');
      }

      const data = await response.json();
      toast.success('Quiz berhasil disimpan!');
      
      const link = `${window.location.origin}/quiz/${data.id}`;
      setQuizLink(link);
      setShowShareDialog(true);
    } catch (error: any) {
      console.error('Error saving quiz:', error);
      toast.error(error.message || 'Terjadi kesalahan saat menyimpan quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      let textContent = '';

      if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        textContent = await readTextFile(file);
      } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        textContent = await readPdfFile(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 fileName.endsWith('.docx')) {
        textContent = await readDocxFile(file);
      } else {
        toast.error('Format file tidak didukung. Gunakan TXT, DOCX, atau PDF.');
        return;
      }

      const questions = parseQuestionsFromText(textContent);
      if (questions.length > 0) {
        setQuizData(prev => ({
          ...prev,
          questions: [...prev.questions, ...questions]
        }));
        toast.success(`Berhasil mengimpor ${questions.length} pertanyaan`);
      } else {
        toast.error('Tidak ditemukan pertanyaan dalam file');
      }
    } catch (error) {
      console.error('Error importing file:', error);
      toast.error('Gagal mengimpor pertanyaan dari file');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buat Quiz Baru</h1>
          <p className="text-gray-600 mt-2">
            Buat evaluasi pembelajaran untuk peserta didik
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
            Batal
          </Button>
          <Button 
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={handleSaveQuiz}
            disabled={isLoading}
          >
            {isLoading ? (
              'Menyimpan...'
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Quiz
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm p-6">
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Detail Quiz
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'questions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('questions')}
            >
              Pertanyaan ({quizData.questions.length})
            </button>
          </div>

          {activeTab === 'details' ? (
            <QuizDetailsForm quizData={quizData} setQuizData={setQuizData} />
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Pertanyaan ({quizData.questions.length})</h3>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileImport}
                    accept=".txt,.pdf,.docx"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="gap-2"
                  >
                    {isImporting ? (
                      'Mengimpor...'
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Impor Pertanyaan
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Format file yang didukung:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <span className="font-medium">TXT:</span> Pertanyaan diawali angka/Q) dan opsi diawali huruf (A), jawaban benar diawali *
                    <pre className="bg-gray-100 p-2 mt-1 rounded text-xs">
                      1) Pertanyaan contoh?<br />
                      *A) Jawaban benar<br />
                      B) Jawaban salah<br />
                      C) Jawaban lain
                    </pre>
                  </li>
                  <li>
                    <span className="font-medium">DOCX/PDF:</span> Format sama dengan TXT atau pertanyaan per baris
                  </li>
                </ul>
              </div>

              <QuestionList
                questions={quizData.questions}
                removeQuestion={removeQuestion}
                moveQuestionUp={moveQuestionUp}
                moveQuestionDown={moveQuestionDown}
                handleOptionChange={handleOptionChange}
                handleCorrectAnswerChange={handleCorrectAnswerChange}
                addOption={addOption}
                removeOption={removeOption}
              />

              <NewQuestionForm addQuestion={addQuestion} />
            </div>
          )}
        </div>

        <QuizPreview quizData={quizData} />
      </div>

      <ShareQuizDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        quizLink={quizLink}
        onViewQuiz={() => {
          setShowShareDialog(false);
          router.push(quizLink.replace(window.location.origin, ''));
        }}
      />
    </div>
  );
}