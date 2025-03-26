"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus, 
  Trash, 
  Clock, 
  Calendar, 
  BookOpen, 
  Save, 
  X, 
  ChevronDown, 
  ChevronUp,
  Share2,
  Copy,
  Check,
  X as XIcon,
  Upload,
  FileText,
  File,
  FileInput
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { parse } from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

type Question = {
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correctAnswer: number;
  points: number;
  correctShortAnswer?: string;
};

type QuizData = {
  title: string;
  description: string;
  kelas: string;
  duration: number;
  deadline: string;
  isRandomized: boolean;
  showScore: boolean;
  questions: Question[];
};

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
  const [newQuestion, setNewQuestion] = useState<Question>({
    text: '',
    type: 'multiple_choice',
    options: ['', '', ''],
    correctAnswer: 0,
    points: 1,
    correctShortAnswer: ''
  });

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [quizLink, setQuizLink] = useState('');

  const addQuestion = () => {
    let isValid = true;
    
    if (!newQuestion.text.trim()) {
      toast.error('Harap isi pertanyaan');
      isValid = false;
    }

    if (newQuestion.type === 'multiple_choice') {
      if (newQuestion.options.some(opt => !opt.trim())) {
        toast.error('Harap isi semua opsi jawaban untuk pilihan ganda');
        isValid = false;
      }
    } else if (newQuestion.type === 'short_answer') {
      if (!newQuestion.correctShortAnswer?.trim()) {
        toast.error('Harap isi jawaban singkat yang benar');
        isValid = false;
      }
    }

    if (isValid) {
      const questionToAdd: Question = newQuestion.type === 'true_false' 
        ? {
            ...newQuestion,
            options: ['Benar', 'Salah'],
            correctAnswer: newQuestion.correctAnswer
          }
        : newQuestion.type === 'short_answer'
        ? {
            ...newQuestion,
            options: [newQuestion.correctShortAnswer || ''],
            correctAnswer: 0
          }
        : newQuestion;

      setQuizData({
        ...quizData,
        questions: [...quizData.questions, questionToAdd]
      });

      setNewQuestion({
        text: '',
        type: 'multiple_choice',
        options: ['', '', ''],
        correctAnswer: 0,
        points: 1,
        correctShortAnswer: ''
      });
    }
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

  const handleQuestionTypeChange = (type: 'multiple_choice' | 'true_false' | 'short_answer') => {
    setNewQuestion({
      ...newQuestion,
      type,
      options: type === 'multiple_choice' ? ['', '', ''] : type === 'true_false' ? ['Benar', 'Salah'] : [],
      correctAnswer: 0,
      correctShortAnswer: type === 'short_answer' ? newQuestion.correctShortAnswer : ''
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quizLink);
    toast.success('Link berhasil disalin!');
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

  // File import handlers
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

  // File readers
  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const readPdfFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let textContent = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContentObj = await page.getTextContent();
      const pageText = textContentObj.items.map(item => (item as any).str).join(' ');
      textContent += pageText + '\n';
    }

    return textContent;
  };

  const readDocxFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  // Text parsing to questions
  const parseQuestionsFromText = (text: string): Question[] => {
    const questions: Question[] = [];
    const lines = text.split('\n').filter(line => line.trim() !== '');

    let currentQuestion: Partial<Question> = {};
    let currentOptions: string[] = [];
    let correctAnswerIndex = -1;

    for (const line of lines) {
      // Detect question (starts with number or Q)
      if (/^\d+[.)]/.test(line) || /^Q\d*[:.)]/.test(line)) {
        // Save previous question if exists
        if (currentQuestion.text && currentOptions.length > 0) {
          questions.push({
            text: currentQuestion.text,
            type: 'multiple_choice',
            options: currentOptions,
            correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
            points: 1
          });
        }

        // Start new question
        currentQuestion = {
          text: line.replace(/^\d+[.)]\s*/, '').replace(/^Q\d*[:.)]\s*/, '').trim()
        };
        currentOptions = [];
        correctAnswerIndex = -1;
      } 
      // Detect options (starts with a letter or *)
      else if (/^[A-Za-z][.)]/.test(line) || /^\*[A-Za-z][.)]/.test(line)) {
        const isCorrect = line.startsWith('*');
        const optionText = line.replace(/^\*?[A-Za-z][.)]\s*/, '').trim();
        
        if (isCorrect) {
          correctAnswerIndex = currentOptions.length;
        }
        currentOptions.push(optionText);
      }
      // Detect true/false question
      else if (/benar|salah|true|false/i.test(line)) {
        currentQuestion = {
          text: line.trim(),
          type: 'true_false',
          options: ['Benar', 'Salah'],
          correctAnswer: /benar|true/i.test(line) ? 0 : 1,
          points: 1
        };
        questions.push(currentQuestion as Question);
        currentQuestion = {};
        currentOptions = [];
      }
      // Detect short answer (ends with ?)
      else if (line.trim().endsWith('?')) {
        currentQuestion = {
          text: line.trim(),
          type: 'short_answer',
          options: [''], // Will be replaced with correct answer
          correctAnswer: 0,
          points: 1,
          correctShortAnswer: '' // User needs to fill this
        };
        questions.push(currentQuestion as Question);
        currentQuestion = {};
        currentOptions = [];
      }
    }

    // Add last question if exists
    if (currentQuestion.text && currentOptions.length > 0) {
      questions.push({
        text: currentQuestion.text,
        type: 'multiple_choice',
        options: currentOptions,
        correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
        points: 1
      });
    }

    return questions;
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
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Judul Quiz</Label>
                <Input
                  id="title"
                  value={quizData.title}
                  onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                  placeholder="Misal: Quiz Matematika Bab 1"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={quizData.description}
                  onChange={(e) => setQuizData({...quizData, description: e.target.value})}
                  placeholder="Berikan instruksi atau penjelasan tentang quiz ini"
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="kelas">Kelas</Label>
                  <Select 
                    value={quizData.kelas}
                    onValueChange={(value) => setQuizData({...quizData, kelas: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="X IPA 1">X IPA 1</SelectItem>
                      <SelectItem value="X IPA 2">X IPA 2</SelectItem>
                      <SelectItem value="XI IPA 1">XI IPA 1</SelectItem>
                      <SelectItem value="XI IPA 2">XI IPA 2</SelectItem>
                      <SelectItem value="XII IPA 1">XII IPA 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Durasi (menit)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={quizData.duration}
                    onChange={(e) => setQuizData({...quizData, duration: parseInt(e.target.value) || 0})}
                    className="mt-2"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deadline">Batas Waktu</Label>
                <div className="flex items-center mt-2">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={quizData.deadline}
                    onChange={(e) => setQuizData({...quizData, deadline: e.target.value})}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="randomized">Acak Urutan Pertanyaan</Label>
                  <Switch
                    id="randomized"
                    checked={quizData.isRandomized}
                    onCheckedChange={(checked) => setQuizData({...quizData, isRandomized: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showScore">Tampilkan Nilai Setelah Selesai</Label>
                  <Switch
                    id="showScore"
                    checked={quizData.showScore}
                    onCheckedChange={(checked) => setQuizData({...quizData, showScore: checked})}
                  />
                </div>
              </div>
            </div>
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

              {quizData.questions.map((question, qIndex) => (
                <div key={qIndex} className="border rounded-lg p-4 relative">
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button 
                      onClick={() => moveQuestionUp(qIndex)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      disabled={qIndex === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => moveQuestionDown(qIndex)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      disabled={qIndex === quizData.questions.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => removeQuestion(qIndex)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-start">
                      <Label>Pertanyaan {qIndex + 1}</Label>
                      <Badge variant="outline" className="ml-2">
                        {question.type === 'multiple_choice' ? 'Pilihan Ganda' : 
                         question.type === 'true_false' ? 'Benar/Salah' : 'Jawaban Singkat'}
                      </Badge>
                    </div>
                    <p className="font-medium mt-1">{question.text}</p>
                  </div>

                  {question.type === 'multiple_choice' && (
                    <div className="space-y-2">
                      <Label>Pilihan Jawaban:</Label>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === optIndex}
                            onChange={() => handleCorrectAnswerChange(qIndex, optIndex)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                            className={`flex-1 ${question.correctAnswer === optIndex ? 'border-blue-500 bg-blue-50' : ''}`}
                            placeholder={`Opsi ${optIndex + 1}`}
                          />
                          {question.options.length > 1 && (
                            <button 
                              onClick={() => removeOption(qIndex, optIndex)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 mt-2"
                        onClick={() => addOption(qIndex)}
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Pilihan
                      </Button>
                    </div>
                  )}

                  {question.type === 'true_false' && (
                    <div className="space-y-2">
                      <Label>Pilihan Jawaban:</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === 0}
                          onChange={() => handleCorrectAnswerChange(qIndex, 0)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <div className={`flex-1 p-2 rounded ${question.correctAnswer === 0 ? 'bg-green-50 text-green-700 font-medium' : 'bg-gray-50'}`}>
                          <Check className="inline w-4 h-4 mr-2" />
                          Benar
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === 1}
                          onChange={() => handleCorrectAnswerChange(qIndex, 1)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <div className={`flex-1 p-2 rounded ${question.correctAnswer === 1 ? 'bg-green-50 text-green-700 font-medium' : 'bg-gray-50'}`}>
                          <XIcon className="inline w-4 h-4 mr-2" />
                          Salah
                        </div>
                      </div>
                    </div>
                  )}

                  {question.type === 'short_answer' && (
                    <div className="space-y-2">
                      <Label>Jawaban yang Benar:</Label>
                      <Input
                        value={question.options[0] || ''}
                        onChange={(e) => {
                          const updatedQuestions = [...quizData.questions];
                          updatedQuestions[qIndex].options = [e.target.value];
                          setQuizData({...quizData, questions: updatedQuestions});
                        }}
                        placeholder="Masukkan jawaban yang benar"
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <Label>Poin:</Label>
                    <Input
                      type="number"
                      value={question.points}
                      onChange={(e) => {
                        const updatedQuestions = [...quizData.questions];
                        updatedQuestions[qIndex].points = parseInt(e.target.value) || 0;
                        setQuizData({...quizData, questions: updatedQuestions});
                      }}
                      className="w-20 mt-1"
                      min="1"
                    />
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed rounded-lg p-6">
                <h3 className="font-medium mb-4">Tambah Pertanyaan Baru</h3>
                
                <div className="mb-4">
                  <Label htmlFor="question-text">Teks Pertanyaan</Label>
                  <Input
                    id="question-text"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                    placeholder="Masukkan pertanyaan"
                    className="mt-2"
                  />
                </div>

                <div className="mb-4">
                  <Label>Tipe Pertanyaan</Label>
                  <Select
                    value={newQuestion.type}
                    onValueChange={(value: 'multiple_choice' | 'true_false' | 'short_answer') => handleQuestionTypeChange(value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Pilihan Ganda</SelectItem>
                      <SelectItem value="true_false">Benar/Salah</SelectItem>
                      <SelectItem value="short_answer">Jawaban Singkat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newQuestion.type === 'multiple_choice' && (
                  <div className="space-y-2 mb-4">
                    <Label>Pilihan Jawaban</Label>
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct-new"
                          checked={newQuestion.correctAnswer === index}
                          onChange={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...newQuestion.options];
                            newOptions[index] = e.target.value;
                            setNewQuestion({...newQuestion, options: newOptions});
                          }}
                          placeholder={`Pilihan ${index + 1}`}
                        />
                        {newQuestion.options.length > 1 && (
                          <button 
                            onClick={() => {
                              const newOptions = [...newQuestion.options];
                              newOptions.splice(index, 1);
                              setNewQuestion({
                                ...newQuestion, 
                                options: newOptions,
                                correctAnswer: Math.min(newQuestion.correctAnswer, newOptions.length - 1)
                              });
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 mt-2"
                      onClick={() => setNewQuestion({
                        ...newQuestion, 
                        options: [...newQuestion.options, '']
                      })}
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Pilihan
                    </Button>
                  </div>
                )}

                {newQuestion.type === 'true_false' && (
                  <div className="space-y-2 mb-4">
                    <Label>Pilihan Jawaban</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct-new-tf"
                        checked={newQuestion.correctAnswer === 0}
                        onChange={() => setNewQuestion({...newQuestion, correctAnswer: 0})}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div className={`flex-1 p-2 rounded ${newQuestion.correctAnswer === 0 ? 'bg-green-50 text-green-700 font-medium' : 'bg-gray-50'}`}>
                        <Check className="inline w-4 h-4 mr-2" />
                        Benar
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct-new-tf"
                        checked={newQuestion.correctAnswer === 1}
                        onChange={() => setNewQuestion({...newQuestion, correctAnswer: 1})}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div className={`flex-1 p-2 rounded ${newQuestion.correctAnswer === 1 ? 'bg-green-50 text-green-700 font-medium' : 'bg-gray-50'}`}>
                        <XIcon className="inline w-4 h-4 mr-2" />
                        Salah
                      </div>
                    </div>
                  </div>
                )}

                {newQuestion.type === 'short_answer' && (
                  <div className="space-y-2 mb-4">
                    <Label>Jawaban Singkat yang Benar</Label>
                    <Input
                      value={newQuestion.correctShortAnswer || ''}
                      onChange={(e) => setNewQuestion({
                        ...newQuestion, 
                        correctShortAnswer: e.target.value
                      })}
                      placeholder="Masukkan jawaban yang benar"
                    />
                    <p className="text-xs text-gray-500">Peserta harus mengetik jawaban yang tepat untuk mendapatkan poin</p>
                  </div>
                )}

                <div className="mb-4">
                  <Label>Poin</Label>
                  <Input
                    type="number"
                    value={newQuestion.points}
                    onChange={(e) => setNewQuestion({
                      ...newQuestion, 
                      points: parseInt(e.target.value) || 0
                    })}
                    className="w-20 mt-1"
                    min="1"
                  />
                </div>

                <Button 
                  className="w-full gap-2"
                  onClick={addQuestion}
                  disabled={
                    !newQuestion.text.trim() || 
                    (newQuestion.type === 'multiple_choice' && newQuestion.options.some(opt => !opt.trim())) ||
                    (newQuestion.type === 'short_answer' && !newQuestion.correctShortAnswer?.trim())
                  }
                >
                  <Plus className="w-4 h-4" />
                  Tambahkan Pertanyaan
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Pratinjau Quiz</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">{quizData.title || 'Judul Quiz'}</h3>
              <p className="text-sm text-gray-600">{quizData.description || 'Deskripsi quiz'}</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>{quizData.kelas || 'Pilih Kelas'}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{quizData.duration} menit</span>
              </div>
            </div>

            {quizData.deadline && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Batas: {new Date(quizData.deadline).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Acak pertanyaan:</span>
                <Badge variant={quizData.isRandomized ? 'default' : 'outline'}>
                  {quizData.isRandomized ? 'Ya' : 'Tidak'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tampilkan nilai:</span>
                <Badge variant={quizData.showScore ? 'default' : 'outline'}>
                  {quizData.showScore ? 'Ya' : 'Tidak'}
                </Badge>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2">Pertanyaan ({quizData.questions.length})</h4>
              
              {quizData.questions.length > 0 ? (
                <div className="space-y-4">
                  {quizData.questions.map((question, index) => (
                    <div key={index} className="border rounded p-3">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{index + 1}. {question.text}</p>
                        <Badge variant="outline" className="ml-2">
                          {question.type === 'multiple_choice' ? 'Pilihan Ganda' : 
                           question.type === 'true_false' ? 'Benar/Salah' : 'Jawaban Singkat'}
                        </Badge>
                      </div>
                      
                      {question.type === 'multiple_choice' && (
                        <ul className="mt-2 space-y-1">
                          {question.options.map((option, optIndex) => (
                            <li 
                              key={optIndex} 
                              className={`text-sm p-1 rounded ${question.correctAnswer === optIndex ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600'}`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                              {question.correctAnswer === optIndex && (
                                <span className="ml-1 text-green-600">✓</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}

                      {question.type === 'true_false' && (
                        <div className="mt-2 space-y-1">
                          <div className={`text-sm p-1 rounded ${question.correctAnswer === 0 ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600'}`}>
                            A. Benar
                            {question.correctAnswer === 0 && (
                              <span className="ml-1 text-green-600">✓</span>
                            )}
                          </div>
                          <div className={`text-sm p-1 rounded ${question.correctAnswer === 1 ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600'}`}>
                            B. Salah
                            {question.correctAnswer === 1 && (
                              <span className="ml-1 text-green-600">✓</span>
                            )}
                          </div>
                        </div>
                      )}

                      {question.type === 'short_answer' && (
                        <div className="mt-2">
                          <div className="text-sm font-medium text-green-700 bg-green-50 p-1 rounded">
                            Jawaban: {question.options[0]}
                          </div>
                        </div>
                      )}

                      <div className="mt-2 text-xs text-gray-500">
                        Poin: {question.points}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Belum ada pertanyaan</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Bagikan Quiz
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Quiz Anda telah berhasil dibuat! Bagikan link berikut dengan peserta didik:
            </p>
            
            <div className="flex items-center gap-2">
              <Input
                value={quizLink}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Salin
              </Button>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowShareDialog(false)}
              >
                Tutup
              </Button>
              <Button
                onClick={() => {
                  setShowShareDialog(false);
                  router.push(quizLink.replace(window.location.origin, ''));
                }}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Lihat Quiz
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}