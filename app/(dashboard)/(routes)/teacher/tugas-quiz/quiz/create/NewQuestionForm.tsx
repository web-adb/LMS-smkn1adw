// components/NewQuestionForm.tsx
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash, Check, X as XIcon } from "lucide-react";
import { Question } from "./quiz";
import { toast } from 'react-hot-toast';


interface NewQuestionFormProps {
  addQuestion: (question: Question) => void;
}

export const NewQuestionForm = ({ addQuestion }: NewQuestionFormProps) => {
  const [newQuestion, setNewQuestion] = useState<Question>({
    text: '',
    type: 'multiple_choice',
    options: ['', '', ''],
    correctAnswer: 0,
    points: 1,
    correctShortAnswer: ''
  });

  const handleQuestionTypeChange = (type: 'multiple_choice' | 'true_false' | 'short_answer') => {
    setNewQuestion({
      ...newQuestion,
      type,
      options: type === 'multiple_choice' ? ['', '', ''] : type === 'true_false' ? ['Benar', 'Salah'] : [],
      correctAnswer: 0,
      correctShortAnswer: type === 'short_answer' ? newQuestion.correctShortAnswer : ''
    });
  };

  const handleAddQuestion = () => {
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

      addQuestion(questionToAdd);

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

  return (
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
        onClick={handleAddQuestion}
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
  );
};