"use client";

import { BookOpen, Clock, FileUp, BarChart } from "lucide-react";
import { QuizStats } from "./types";

interface QuizStatsCardsProps {
  stats: QuizStats;
}

export function QuizStatsCards({ stats }: QuizStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Quiz</p>
            <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
          </div>
          <div className="p-3 rounded-full bg-blue-50 text-blue-600">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Aktif</p>
            <p className="text-2xl font-bold">{stats.activeQuizzes}</p>
          </div>
          <div className="p-3 rounded-full bg-green-50 text-green-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Perlu Dinilai</p>
            <p className="text-2xl font-bold">{stats.quizzesNeedGrading}</p>
          </div>
          <div className="p-3 rounded-full bg-amber-50 text-amber-600">
            <FileUp className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Rata-rata Nilai</p>
            <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</p>
          </div>
          <div className="p-3 rounded-full bg-purple-50 text-purple-600">
            <BarChart className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}