// components/QuizDetailsForm.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { QuizData } from "./quiz";

interface QuizDetailsFormProps {
  quizData: QuizData;
  setQuizData: (data: QuizData) => void;
}

export const QuizDetailsForm = ({ quizData, setQuizData }: QuizDetailsFormProps) => {
  return (
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
  );
};