"use client";

import { BarChart, Compass, Layout, List, Eye, UserRoundCheck, Award, Settings, HelpCircle, MessageSquare, Calendar, Trophy, Clock } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

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
        icon: List,
        label: "Tugas & Ujian",
        href: "/teacher/tugas-ujian"
    },
    {
        icon: Calendar,
        label: "Penjadwalan Kelas",
        href: "/teacher/penjadwalan-kelas"
    },
    {
        icon: UserRoundCheck,
        label: "Daftar Siswa",
        href: "/teacher/daftar-siswa",
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics",
    },
    {
        icon: Eye,
        label: "Statistik",
        href: "/teacher/statistik",
    },
    {
        icon: BarChart,
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

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem key={route.href} icon={route.icon} href={route.href} label={route.label} />
            ))}
        </div>
    );
};