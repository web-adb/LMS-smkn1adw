import { User } from "@clerk/nextjs/server";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Edit, CheckCircle, Loader2, ChevronUp, ChevronDown, UserRound } from "lucide-react";

interface ProfileSectionProps {
  user: User;
  expanded: boolean;
  toggleSection: (section: string) => void;
  setSuccessMessage: (message: string) => void;
  setErrorMessage: (message: string) => void;
}

export default function ProfileSection({
  user,
  expanded,
  toggleSection,
  setSuccessMessage,
  setErrorMessage,
}: ProfileSectionProps) {
  const [username, setUsername] = useState(user?.username || "");
  const [email] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) {
      setErrorMessage("Anda harus login untuk memperbarui profil.");
      return;
    }

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden transition-all duration-200">
      <button
        onClick={() => toggleSection("profile")}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center">
          <UserRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Profil
          </h2>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {expanded && (
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
            disabled={isLoading || !isEditingUsername}
            className={`w-full md:w-auto px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${
              isLoading || !isEditingUsername
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-sm"
            }`}
          >
            {isLoading ? (
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
  );
}