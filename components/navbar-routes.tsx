"use client";

import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut, Edit, Settings, Search, Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { isTeacher } from "@/lib/isTeacher";
import { SearchInput } from "./search-input";
import { useState } from "react";
import { SpotlightSearch } from "./search";
import { SettingsDropdown } from "./settings-dropdown";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const [navExpanded, setNavExpanded] = useState(false);

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
        {/* Search Icon - Always Visible */}
        <div className="md:hidden">
          <SpotlightSearch />
        </div>

        {/* Notification Icon - Always Visible */}
        <div className="md:hidden">
          <Link href="#">
            <Button
              size="sm"
              variant="ghost"
              className="flex items-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Teacher Mode Toggle */}
        {isTeacher(userId) && (
          <div className="hidden md:block">
            {isTeacherPage || isCoursePage ? (
              <Link href="/">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Kembali</span>
                </Button>
              </Link>
            ) : (
              <Link href="/teacher/courses">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-x-2 rounded-full bg-yellow-300 dark:bg-gray-800 hover:bg-yellow-500 dark:hover:bg-gray-700"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Teacher Mode</span>
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Settings Button */}
        <div className="hidden md:block">
          <SettingsDropdown />
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block">
          <SpotlightSearch />
        </div>

        {/* Desktop Notification */}
        <div className="hidden md:block">
          <Link href="#">
            <Button
              size="sm"
              variant="ghost"
              className="flex items-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* User Profile */}
        <div className="flex items-center">
          <div className="flex items-center gap-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-200 hidden sm:inline">
              {user?.fullName || user?.firstName || user?.username || "Anda Belum Login"}
            </span>
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/50">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-7 w-7",
                    userButtonPopoverCard: "shadow-lg dark:shadow-gray-800/50"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};