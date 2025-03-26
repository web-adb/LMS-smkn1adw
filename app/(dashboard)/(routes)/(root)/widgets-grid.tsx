// components/widgets-grid.tsx
"use client";

import { Compass, List, Calendar, Trophy, Award, Clock, MessageSquare, HelpCircle, Settings, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const WidgetsGrid = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const widgets = [
    {
      icon: Compass,
      label: "Jelajahi Kursus",
      href: "/search",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/30"
    },
    {
      icon: List,
      label: "Tugas Saya",
      href: "/tugas",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/30"
    },
    {
      icon: Calendar,
      label: "Kalender",
      href: "/kalender",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/30"
    },
    {
      icon: Trophy,
      label: "Peringkat Siswa",
      href: "/papan-peringkat",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/30"
    },
    {
      icon: Award,
      label: "Sertifikat Saya",
      href: "/sertifikat",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/30"
    },
    {
      icon: Clock,
      label: "Aktivitas",
      href: "/riwayat-aktivitas",
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-50 dark:bg-cyan-900/30"
    },
    {
      icon: MessageSquare,
      label: "Forum Diskusi",
      href: "/forum",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/30"
    },
    {
      icon: HelpCircle,
      label: "Pusat Bantuan",
      href: "/bantuan",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/30"
    },
    {
      icon: Settings,
      label: "Pengaturan Akun",
      href: "/pengaturan",
      color: "text-gray-600 dark:text-gray-400",
      bg: "bg-gray-50 dark:bg-gray-800/30"
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span className={`p-1.5 rounded-lg ${isExpanded ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
          <span>Menu Aplikasi</span>
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isExpanded ? 'Sembunyikan' : 'Tampilkan'}
        </span>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {widgets.map((widget, index) => (
            <Link 
              href={widget.href} 
              key={index}
              className={`${widget.bg} rounded-lg p-3 flex flex-col items-center gap-2 transition-all hover:shadow-sm hover:translate-y-[-2px] border border-gray-100 dark:border-gray-700`}
            >
              <div className={`p-2.5 rounded-md ${widget.color} ${widget.bg.replace('50', '100')}`}>
                <widget.icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">
                {widget.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};