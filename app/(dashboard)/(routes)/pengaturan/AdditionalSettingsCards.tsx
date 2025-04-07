import { Database, Bell, HelpCircle, LogOut } from "lucide-react";

export default function AdditionalSettingsCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors cursor-pointer">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 mb-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
            <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
            Data & Penyimpanan
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Kelola data aplikasi
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors cursor-pointer">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 mb-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
            <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
            Notifikasi
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Pengaturan notifikasi
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors cursor-pointer">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 mb-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
            <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
            Bantuan
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Pusat bantuan
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500 transition-colors cursor-pointer">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 mb-2 bg-red-50 dark:bg-red-900/20 rounded-full">
            <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
            Keluar
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Logout dari akun
          </p>
        </div>
      </div>
    </div>
  );
}