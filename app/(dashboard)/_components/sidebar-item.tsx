"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext"; // Import useTheme

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
  const { resolvedTheme } = useTheme(); // Ambil resolvedTheme dari context

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
        "group flex items-center gap-x-3 w-full text-sm font-[500] pl-6 pr-4 py-3 transition-all",
        "hover:bg-opacity-70 hover:shadow-sm rounded-lg",
        isActive 
          ? "bg-gradient-to-r from-sky-50 to-blue-50 shadow-md dark:from-sky-900/50 dark:to-blue-900/50" 
          : "text-slate-600 dark:text-slate-300",
        resolvedTheme === 'dark' 
          ? "hover:bg-slate-800/70" 
          : "hover:bg-slate-100/70"
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center gap-x-3">
        {/* Icon wrapper */}
        <motion.div
          className={cn(
            "p-2.5 rounded-lg transition-all shadow-sm border",
            isActive 
              ? "bg-sky-500 shadow-lg dark:bg-sky-600" 
              : resolvedTheme === 'dark' 
                ? "bg-slate-800 border-slate-700" 
                : "bg-white border-slate-100"
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Icon
            size={20}
            className={cn(
              "transition-colors",
              isActive 
                ? "text-white" 
                : resolvedTheme === 'dark' 
                  ? "text-slate-300" 
                  : "text-slate-600"
            )}
          />
        </motion.div>
        
        <motion.span
          className={cn(
            "transition-colors",
            isActive 
              ? "text-sky-700 dark:text-sky-300 font-semibold" 
              : resolvedTheme === 'dark' 
                ? "text-slate-300" 
                : "text-slate-700"
          )}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {label}
        </motion.span>
      </div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className={cn(
            "ml-auto h-6 w-1.5 rounded-full",
            resolvedTheme === 'dark' 
              ? "bg-sky-400" 
              : "bg-sky-500"
          )}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
      )}
    </motion.button>
  );
};