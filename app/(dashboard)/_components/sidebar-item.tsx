"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <motion.button
      onClick={onClick}
      type="button"
      className={cn(
        "group flex items-center gap-x-3 w-full text-slate-600 text-sm font-[500] pl-6 pr-4 py-3 transition-all",
        "hover:bg-slate-100/70 hover:shadow-sm rounded-lg",
        isActive && "bg-gradient-to-r from-sky-50 to-blue-50 shadow-md"
      )}
      // whileTap={{ scale: 0.85 }} // Efek klik (scale down)
      initial={{ opacity: 0, y: -10 }} // Animasi fade in awal
      animate={{ opacity: 1, y: 0 }} // Animasi fade in saat muncul
      exit={{ opacity: 0, y: -10 }} // Animasi fade out saat menghilang
      transition={{ duration: 0.3, ease: "easeInOut" }} // Durasi dan easing animasi
    >
      <div className="flex items-center gap-x-3">
        {/* Div pembungkus ikon */}
        <motion.div
          className={cn(
            "p-2.5 rounded-lg transition-all",
            "bg-white shadow-sm border border-slate-100",
            isActive ? "bg-sky-500 shadow-lg" : "bg-slate-100"
          )}
          initial={{ opacity: 0, scale: 0.9 }} // Animasi fade in ikon
          animate={{ opacity: 1, scale: 1 }} // Animasi fade in ikon
          transition={{ duration: 0.3, delay: 0.1 }} // Durasi dan delay animasi
        >
          <Icon
            size={20}
            className={cn(
              "transition-colors",
              isActive ? "text-white" : "text-slate-600"
            )}
          />
        </motion.div>
        <motion.span
          className={cn(
            "transition-colors",
            isActive ? "text-sky-700 font-semibold" : "text-slate-700"
          )}
          initial={{ opacity: 0, x: -10 }} // Animasi fade in teks
          animate={{ opacity: 1, x: 0 }} // Animasi fade in teks
          transition={{ duration: 0.3, delay: 0.2 }} // Durasi dan delay animasi
        >
          {label}
        </motion.span>
      </div>

      {/* Indikator aktif dengan animasi fade in */}
      {isActive && (
        <motion.div
          className="ml-auto h-6 w-1.5 bg-sky-500 rounded-full"
          initial={{ opacity: 0, scale: 0.5 }} // Animasi fade in indikator
          animate={{ opacity: 1, scale: 1 }} // Animasi fade in indikator
          transition={{ duration: 0.3, delay: 0.3 }} // Durasi dan delay animasi
        />
      )}
    </motion.button>
  );
};