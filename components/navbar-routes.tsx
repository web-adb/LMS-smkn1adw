"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut, Edit, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { isTeacher } from "@/lib/isTeacher";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.startsWith("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block flex-1 max-w-lg mx-auto">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto items-center">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button
              size="sm"
              variant="ghost"
              className="flex items-center gap-x-2 hover:bg-slate-100/50 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar Mode Guru</span>
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button
              size="sm"
              variant="ghost"
              className="flex items-center gap-x-2 hover:bg-slate-100/50 transition-all"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Mode Guru</span>
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};