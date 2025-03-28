// components/settings-dropdown.tsx
"use client";

import { Settings, User, LogOut, Bell, HelpCircle, Moon, Sun, Monitor, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";

export const SettingsDropdown = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const themeOptions = [
    {
      value: "light",
      label: "Light Mode",
      icon: Sun,
      description: "Bright and clear appearance"
    },
    {
      value: "dark",
      label: "Dark Mode", 
      icon: Moon,
      description: "Easier on the eyes in low light"
    },
    {
      value: "system",
      label: "System Preference",
      icon: Monitor,
      description: "Follow your OS setting"
    },
  ];

  const menuItems = [
    {
      section: "Account",
      items: [
        {
          icon: User,
          label: "Profile",
          action: () => router.push("/profile"),
        },
        {
          icon: Bell,
          label: "Notifications",
          action: () => router.push("/notifications"),
          badge: "3" // Example badge count
        }
      ]
    },
    {
      section: "Preferences",
      items: [
        ...themeOptions.map((option) => ({
          icon: option.icon,
          label: option.label,
          description: option.description,
          action: () => setTheme(option.value as 'light' | 'dark' | 'system'),
          active: theme === option.value,
        }))
      ]
    },
    {
      section: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          action: () => router.push("/bantuan"),
        },
        {
          icon: Settings,
          label: "Settings",
          action: () => router.push("/pengaturan"),
        }
      ]
    },
    {
      section: "Session",
      items: [
        {
          icon: LogOut,
          label: "Sign Out",
          action: () => signOut(),
          danger: true
        }
      ]
    }
  ];

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Settings Button */}
      <Button
        size="sm"
        variant="ghost"
        className="flex items-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        aria-expanded={open}
        aria-label="Settings dropdown"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">Pengaturan</span>
      </Button>

      {/* Dropdown with Glass Effect */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in-0" />
          
          {/* Dropdown Menu */}
          <div 
            className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 shadow-xl z-50 overflow-hidden animate-in fade-in-zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-2">
              <div className="px-4 py-3 border-b border-white/10 dark:border-gray-700/50">
                <p className="font-medium text-sm text-gray-900 dark:text-white">Pengaturan Akun</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {resolvedTheme === 'dark' ? 'Dark' : 'Light'} Mode • {theme === 'system' ? 'System' : 'Manual'}
                </p>
              </div>

              {menuItems.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border-b border-white/10 dark:border-gray-700/50 last:border-0">
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {section.section}
                    </p>
                  </div>
                  
                  {section.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between group transition-colors ${
                        'danger' in item && item.danger
                          ? 'hover:bg-red-50/50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
                          : 'hover:bg-gray-100/70 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        item.action();
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          'danger' in item && item.danger
                            ? 'bg-red-100/50 dark:bg-red-900/30'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <item.icon className={`h-4 w-4 ${
                            'danger' in item && item.danger
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-600 dark:text-gray-300'
                          }`} />
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-medium ${
                            'danger' in item && item.danger
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {item.label}
                          </p>
                          {'description' in item && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {'badge' in item && item.badge && (
                          <span className="text-xs bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                        {'active' in item && item.active && (
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};