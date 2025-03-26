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
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Siswa</p>
            <p className="text-2xl font-semibold">{stats.totalStudents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Siswa Aktif</p>
            <p className="text-2xl font-semibold">{stats.activeStudents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Kursus Diambil</p>
            <p className="text-2xl font-semibold">{stats.coursesTaken}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Rata-rata Waktu</p>
            <p className="text-2xl font-semibold">{stats.averageTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;