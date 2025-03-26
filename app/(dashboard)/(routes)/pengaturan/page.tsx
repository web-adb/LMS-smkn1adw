"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Globe,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Edit,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  ChevronUp,
  Loader2,
  Settings,
  Palette,
  Languages,
  Shield,
} from "lucide-react";
import { useTheme } from '@/context/ThemeContext'; // Import useTheme


export default function PengaturanPage() {
  const { user, isLoaded } = useUser();
  const { theme, setTheme, resolvedTheme } = useTheme(); // Gunakan theme context
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState("id");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState({
    profile: false,
    password: false,
    preferences: false,
  });
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    security: true,
    preferences: true,
  });

  // Update username and email when user data changes
  useEffect(() => {
    if (user && isLoaded) {
      setUsername(user.username || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
      // Get theme preference from localStorage or system preference
      const savedTheme =
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");
      setTheme(savedTheme);
    }
  }, [user, isLoaded]);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark", "system");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const handleUpdateProfile = async () => {
    if (!user) {
      setErrorMessage("Anda harus login untuk memperbarui profil.");
      return;
    }

    setIsLoading((prev) => ({ ...prev, profile: true }));
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || "Profil berhasil diperbarui!");
        setIsEditingUsername(false);
      } else {
        setErrorMessage(data.error || "Gagal memperbarui profil.");
      }
    } catch (error) {
      console.error("Gagal memperbarui profil:", error);
      setErrorMessage("Gagal memperbarui profil.");
    } finally {
      setIsLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const handleUpdatePassword = async () => {
    if (!user) {
      setErrorMessage("Anda harus login untuk mengubah kata sandi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Kata sandi baru dan konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading((prev) => ({ ...prev, password: true }));
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || "Kata sandi berhasil diperbarui!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(data.error || "Gagal memperbarui kata sandi.");
      }
    } catch (error) {
      console.error("Gagal memperbarui kata sandi:", error);
      setErrorMessage(
        "Gagal memperbarui kata sandi. Pastikan kata sandi lama benar."
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, password: false }));
    }
  };

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
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setSuccessMessage(
      `Bahasa berhasil diubah ke ${
        selectedLanguage === "id" ? "Bahasa Indonesia" : "English"
      }`
    );
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`p-6 md:p-8 min-h-screen transition-colors duration-200 ${
        resolvedTheme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {" "}
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Settings className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Pengaturan
          </h1>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex items-center animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
            <p className="text-sm text-green-600 dark:text-green-400">
              {successMessage}
            </p>
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden mb-6 transition-all duration-200">
          <button
            onClick={() => toggleSection("profile")}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Profil
              </h2>
            </div>
            {expandedSections.profile ? (
              <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {expandedSections.profile && (
            <div className="px-6 pb-6 pt-2 space-y-5 animate-fade-in">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Gambar Profil
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Klik ikon untuk mengubah gambar profil
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    disabled={!isEditingUsername}
                    placeholder="Masukkan username baru"
                  />
                  <button
                    onClick={() => setIsEditingUsername(!isEditingUsername)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md ${
                      isEditingUsername
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed transition-all"
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={isLoading.profile || !isEditingUsername}
                className={`w-full md:w-auto px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${
                  isLoading.profile || !isEditingUsername
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-sm"
                }`}
              >
                {isLoading.profile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden mb-6 transition-all duration-200">
          <button
            onClick={() => toggleSection("security")}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Keamanan
              </h2>
            </div>
            {expandedSections.security ? (
              <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {expandedSections.security && (
            <div className="px-6 pb-6 pt-2 space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Kata Sandi Lama
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    placeholder="Masukkan kata sandi lama"
                  />
                  <button
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {showOldPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    placeholder="Masukkan kata sandi baru"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimal 8 karakter, mengandung huruf besar dan angka
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    placeholder="Konfirmasi kata sandi baru"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleUpdatePassword}
                disabled={
                  isLoading.password ||
                  !oldPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                className={`w-full md:w-auto px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${
                  isLoading.password ||
                  !oldPassword ||
                  !newPassword ||
                  !confirmPassword
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-sm"
                }`}
              >
                {isLoading.password ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Perbarui Kata Sandi
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Preferences Section */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden mb-6 transition-all duration-200">
          <button
            onClick={() => toggleSection("preferences")}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center">
              <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Preferensi
              </h2>
            </div>
            {expandedSections.preferences ? (
              <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {expandedSections.preferences && (
            <div className="px-6 pb-6 pt-2 space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 flex items-center">
                  <Languages className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Bahasa
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleLanguageChange("id")}
                    className={`p-3 border rounded-lg flex items-center transition-all ${
                      language === "id"
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        language === "id"
                          ? "text-indigo-600 dark:text-indigo-400 font-medium"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Bahasa Indonesia
                    </span>
                  </button>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`p-3 border rounded-lg flex items-center transition-all ${
                      language === "en"
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        language === "en"
                          ? "text-indigo-600 dark:text-indigo-400 font-medium"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      English
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 flex items-center">
                  <Palette className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Tema
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Light Theme Card */}
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                      theme === "light"
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md"
                        : "border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${
                        theme === "light"
                          ? "bg-indigo-100 dark:bg-indigo-900/30"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <Sun
                        className={`w-5 h-5 ${
                          theme === "light"
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        theme === "light"
                          ? "text-indigo-600 dark:text-indigo-400 font-medium"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Terang
                    </span>
                  </button>

                  {/* Dark Theme Card */}
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                      theme === "dark"
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md"
                        : "border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-indigo-100 dark:bg-indigo-900/30"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <Moon
                        className={`w-5 h-5 ${
                          theme === "dark"
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        theme === "dark"
                          ? "text-indigo-600 dark:text-indigo-400 font-medium"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Gelap
                    </span>
                  </button>

                  {/* System Theme Card */}
                  <button
                    onClick={() => handleThemeChange("system")}
                    className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                      theme === "system"
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md"
                        : "border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${
                        theme === "system"
                          ? "bg-indigo-100 dark:bg-indigo-900/30"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <Monitor
                        className={`w-5 h-5 ${
                          theme === "system"
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        theme === "system"
                          ? "text-indigo-600 dark:text-indigo-400 font-medium"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Sistem
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Add these styles for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
