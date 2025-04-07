import { useState } from "react";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface PreferencesSectionProps {
  setSuccessMessage: (message: string) => void;
}

export default function PreferencesSection({ setSuccessMessage }: PreferencesSectionProps) {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("id");

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    setSuccessMessage(
      `Tema berhasil diubah ke ${
        selectedTheme === "light"
          ? "Terang"
          : selectedTheme === "dark"
          ? "Gelap"
          : "Sistem"
      }`
    );
  };

  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setSuccessMessage(
      `Bahasa berhasil diubah ke ${
        selectedLanguage === "id" ? "Bahasa Indonesia" : "English"
      }`
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
          Preferensi
        </h2>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
            Tema Aplikasi
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThemeChange("light")}
              className={`p-3 border rounded-lg flex flex-col items-center transition-all ${
                theme === "light"
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
              }`}
            >
              <Sun className="w-5 h-5 mb-1 text-gray-700 dark:text-gray-300" />
              <span className="text-xs">Terang</span>
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`p-3 border rounded-lg flex flex-col items-center transition-all ${
                theme === "dark"
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
              }`}
            >
              <Moon className="w-5 h-5 mb-1 text-gray-700 dark:text-gray-300" />
              <span className="text-xs">Gelap</span>
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className={`p-3 border rounded-lg flex flex-col items-center transition-all ${
                theme === "system"
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
              }`}
            >
              <Monitor className="w-5 h-5 mb-1 text-gray-700 dark:text-gray-300" />
              <span className="text-xs">Sistem</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
            Bahasa
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleLanguageChange("id")}
              className={`p-3 border rounded-lg flex items-center justify-center transition-all ${
                language === "id"
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
              }`}
            >
              <span className="text-sm">Bahasa Indonesia</span>
            </button>
            <button
              disabled
              onClick={() => handleLanguageChange("en")}
              className={`p-3 border rounded-lg flex items-center justify-center transition-all ${
                language === "en"
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
              }`}
            >
              <span className="text-sm">English</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}