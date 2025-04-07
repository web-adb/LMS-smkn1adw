import { useState } from "react";
import { User, Bell, CreditCard } from "lucide-react";


interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const [hoverTab, setHoverTab] = useState<string | null>(null);

  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap -mb-px">
        <button
          onClick={() => setActiveTab("account")}
          className={`mr-6 py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
            activeTab === "account"
              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <User className="w-4 h-4 mr-2" />
          Akun
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          onMouseEnter={() => setHoverTab("notifications")}
          onMouseLeave={() => setHoverTab(null)}
          className={`mr-6 py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
            activeTab === "notifications" || hoverTab === "notifications"
              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <Bell className="w-4 h-4 mr-2" />
          Notifikasi
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          onMouseEnter={() => setHoverTab("billing")}
          onMouseLeave={() => setHoverTab(null)}
          className={`mr-6 py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
            activeTab === "billing" || hoverTab === "billing"
              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Pembayaran
        </button>
      </div>
    </div>
  );
}