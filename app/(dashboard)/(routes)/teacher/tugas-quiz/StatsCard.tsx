import { Users, FileText, AlertCircle, BarChart2 } from "lucide-react";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}


export const StatsCard = ({ icon, title, value, color }: StatsCardProps) => {
  const bgColor = `bg-${color}-50`;
  const textColor = `text-${color}-600`;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl ${bgColor} ${textColor} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-white">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
      <StatsCard
        icon={<Users className="w-5 h-5" />}
        title="Peserta Didik"
        value="32"
        color="green"
      />
      <StatsCard
        icon={<FileText className="w-5 h-5" />}
        title="Tugas Aktif"
        value="5"
        color="blue"
      />
      <StatsCard
        icon={<AlertCircle className="w-5 h-5" />}
        title="Quiz Terkini"
        value="3"
        color="purple"
      />
      <StatsCard
        icon={<BarChart2 className="w-5 h-5" />}
        title="Perlu Dinilai"
        value="12"
        color="amber"
      />
    </div>
  );
};