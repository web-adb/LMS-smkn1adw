"use client";

import { BarChart, Compass, Layout, List, Eye, UserRoundCheck, Award, Settings, HelpCircle, MessageSquare, Calendar, Trophy, Clock, ChevronDown, ChevronUp, BookText, ScrollText } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import { useState } from "react";

const guestRoutes = [
  {
    icon: Layout,
    label: "Beranda",
    href: "/",
  },
  {
    icon: Compass,
    label: "Jelajahi Kursus",
    href: "/search",
  },
  {
    icon: List,
    label: "Tugas Saya",
    href: "/tugas",
  },
  {
    icon: Calendar,
    label: "Kalender",
    href: "/kalender",
  },
  {
    icon: Trophy,
    label: "Peringkat Siswa",
    href: "/papan-peringkat",
  },
  {
    icon: Award,
    label: "Sertifikat Saya",
    href: "/sertifikat",
  },
  {
    icon: Clock,
    label: "Aktivitas",
    href: "/riwayat-aktivitas",
  },
  {
    icon: MessageSquare,
    label: "Forum Diskusi",
    href: "/forum",
  },
  {
    icon: HelpCircle,
    label: "Pusat Bantuan",
    href: "/bantuan",
  },
  {
    icon: Settings,
    label: "Pengaturan Akun",
    href: "/pengaturan",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BookText,
    label: "Tugas & Quiz",
    href: "/teacher/tugas-quiz"
  },
  {
    icon: Calendar,
    label: "Penjadwalan",
    href: "/teacher/penjadwalan-kelas"
  },
  {
    icon: UserRoundCheck,
    label: "Daftar Siswa",
    href: "/teacher/daftar-siswa",
  },
  {
    icon: Eye,
    label: "Statistik",
    href: "/teacher/statistik",
  },
  {
    icon: ScrollText,
    label: "Laporan Kinerja",
    href: "/teacher/laporan-kinerja"
  },
  {
    icon: Award,
    label: "Manajemen Sertifikat",
    href: "/teacher/manajemen-sertifikat"
  },
  {
    icon: MessageSquare,
    label: "Forum Diskusi",
    href: "/teacher/forum-diskusi"
  }
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  // State untuk mengelola dropdown (hanya untuk "Pengaturan & Bantuan")
  const [isPengaturanOpen, setIsPengaturanOpen] = useState(true);

  // Fungsi untuk toggle dropdown "Pengaturan & Bantuan"
  const togglePengaturanDropdown = () => {
    setIsPengaturanOpen((prev) => !prev);
  };

  // Grouping routes into categories
  const groupedRoutes = {
    "Kursus": routes.slice(0, 2),
    "Aktivitas": routes.slice(2, 7),
    "Pengaturan & Bantuan": routes.slice(7)
  };

  return (
    <div className="flex flex-col w-full">
      {/* Kategori Kursus (tetap terbuka) */}
      <div>
        <h3 className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Kursus
        </h3>
        {groupedRoutes["Kursus"].map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            href={route.href}
            label={route.label}
          />
        ))}
      </div>

      {/* Kategori Aktivitas (tetap terbuka) */}
      <div>
        <h3 className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Aktivitas
        </h3>
        {groupedRoutes["Aktivitas"].map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            href={route.href}
            label={route.label}
          />
        ))}
      </div>

      {/* Kategori Pengaturan & Bantuan (bisa di-dropdown) */}
      <div>
        <div
          className="flex items-center justify-between px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
          onClick={togglePengaturanDropdown}
        >
          <span>Pengaturan & Bantuan</span>
          {isPengaturanOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        {isPengaturanOpen && (
          <div>
            {groupedRoutes["Pengaturan & Bantuan"].map((route) => (
              <SidebarItem
                key={route.href}
                icon={route.icon}
                href={route.href}
                label={route.label}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};