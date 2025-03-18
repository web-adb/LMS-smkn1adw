"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

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
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "group flex items-center gap-x-3 w-full text-slate-600 text-sm font-[500] pl-6 pr-4 py-3 transition-all",
        "hover:bg-slate-100/70 hover:shadow-sm rounded-lg",
        isActive && "bg-gradient-to-r from-sky-50 to-blue-50 shadow-md"
      )}
    >
      <div className="flex items-center gap-x-3">
        {/* Div pembungkus ikon dengan animasi scaling */}
        <div
          className={cn(
            "p-2.5 rounded-lg transition-all transform group-hover:scale-110",
            "bg-white shadow-sm border border-slate-100",
            isActive ? "bg-sky-500 shadow-lg" : "bg-slate-100"
          )}
        >
          <Icon
            size={20}
            className={cn(
              "transition-colors",
              isActive ? "text-white" : "text-slate-600"
            )}
          />
        </div>
        <span
          className={cn(
            "transition-colors",
            isActive ? "text-sky-700 font-semibold" : "text-slate-700"
          )}
        >
          {label}
        </span>
      </div>

      {/* Indikator aktif dengan animasi underline */}
      {isActive && (
        <div className="ml-auto h-6 w-1.5 bg-sky-500 rounded-full animate-fade-in" />
      )}
    </button>
  );
};