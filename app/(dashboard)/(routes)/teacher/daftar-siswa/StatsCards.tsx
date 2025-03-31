import { Users, GraduationCap, BookOpen, Clock } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalStudents: number;
    activeStudents: number;
    coursesTaken: number;
    averageTime: string;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Students Card */}
      <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700/30 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mr-4 transition-colors">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
              Total Siswa
            </p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">
              {stats.totalStudents}
            </p>
          </div>
        </div>
      </div>

      {/* Active Students Card */}
      <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700/30 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 mr-4 transition-colors">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
              Siswa Aktif
            </p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">
              {stats.activeStudents}
            </p>
          </div>
        </div>
      </div>

      {/* Courses Taken Card */}
      <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700/30 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 mr-4 transition-colors">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
              Kursus Diambil
            </p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">
              {stats.coursesTaken}
            </p>
          </div>
        </div>
      </div>

      {/* Average Time Card */}
      <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700/30 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 mr-4 transition-colors">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
              Rata-rata Waktu
            </p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">
              {stats.averageTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;