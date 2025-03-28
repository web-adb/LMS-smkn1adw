// components/QuizPreview.tsx
import { QuizData } from "./quiz";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Calendar } from "lucide-react";

interface QuizPreviewProps {
  quizData: QuizData;
}

export const QuizPreview = ({ quizData }: QuizPreviewProps) => {
  return (
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
  );
};