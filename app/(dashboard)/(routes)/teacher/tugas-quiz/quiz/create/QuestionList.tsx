// components/QuestionList.tsx
import { Question } from "./quiz";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash, ChevronUp, ChevronDown, Check, X as XIcon, Plus  } from "lucide-react";

interface QuestionListProps {
  questions: Question[];
  removeQuestion: (index: number) => void;
  moveQuestionUp: (index: number) => void;
  moveQuestionDown: (index: number) => void;
  handleOptionChange: (qIndex: number, optIndex: number, value: string) => void;
  handleCorrectAnswerChange: (qIndex: number, correctIndex: number) => void;
  addOption: (qIndex: number) => void;
  removeOption: (qIndex: number, optIndex: number) => void;
}

export const QuestionList = ({
  questions,
  removeQuestion,
  moveQuestionUp,
  moveQuestionDown,
  handleOptionChange,
  handleCorrectAnswerChange,
  addOption,
  removeOption
}: QuestionListProps) => {
  return (
    <div className="space-y-6">
      {questions.map((question, qIndex) => (
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
              disabled={qIndex === questions.length - 1}
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
                  const updatedQuestions = [...questions];
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
                const updatedQuestions = [...questions];
                updatedQuestions[qIndex].points = parseInt(e.target.value) || 0;
                setQuizData({...quizData, questions: updatedQuestions});
              }}
              className="w-20 mt-1"
              min="1"
            />
          </div>
        </div>
      ))}
    </div>
  );
};