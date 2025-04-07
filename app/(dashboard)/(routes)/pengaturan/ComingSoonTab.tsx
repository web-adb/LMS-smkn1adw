import { Bell, CreditCard } from "lucide-react";

interface ComingSoonTabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ComingSoonTab({ activeTab, setActiveTab }: ComingSoonTabProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-full mb-4">
          {activeTab === "notifications" ? (
            <Bell className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <CreditCard className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Segera Tersedia!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-6">
          {activeTab === "notifications"
            ? "Fitur notifikasi sedang dalam pengembangan dan akan segera hadir untuk Anda."
            : "Fitur pembayaran sedang dalam pengembangan dan akan segera hadir untuk Anda."}
        </p>
        <button
          onClick={() => setActiveTab("account")}
          className="px-5 py-2.5 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          Kembali ke Pengaturan Akun
        </button>
      </div>
    </div>
  );
}