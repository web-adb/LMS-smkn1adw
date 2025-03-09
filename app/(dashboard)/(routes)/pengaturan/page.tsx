"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
    User,
    Lock,
    Globe,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff,
    Edit
} from "lucide-react";

export default function PengaturanPage() {
    const { user } = useUser();
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [language, setLanguage] = useState("id");
    const [theme, setTheme] = useState("light");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleUpdateProfile = async () => {
        if (!user) {
            setErrorMessage("Anda harus login untuk memperbarui profil.");
            return;
        }

        try {
            // Update username using the `update` method
            await user.update({
                username,
            });
            setSuccessMessage("Profil berhasil diperbarui!");
            setErrorMessage("");
            setIsEditingUsername(false); // Disable edit mode after success
        } catch (error) {
            console.error("Gagal memperbarui profil:", error);
            setErrorMessage("Gagal memperbarui profil.");
            setSuccessMessage("");
        }
    };

    const handleUpdatePassword = async () => {
        if (!user) {
            setErrorMessage("Anda harus login untuk mengubah kata sandi.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Kata sandi baru dan konfirmasi kata sandi tidak cocok.");
            setSuccessMessage("");
            return;
        }

        try {
            // Update password using the `updatePassword` method
            await user.updatePassword({
                currentPassword: oldPassword,
                newPassword,
            });
            setSuccessMessage("Kata sandi berhasil diperbarui!");
            setErrorMessage("");
        } catch (error) {
            console.error("Gagal memperbarui kata sandi:", error);
            setErrorMessage("Gagal memperbarui kata sandi. Pastikan kata sandi lama benar.");
            setSuccessMessage("");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <User className="mr-2 w-6 h-6 text-indigo-600" />
                Pengaturan
            </h1>

            {/* Success/Error Messages */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-600">{successMessage}</p>
                </div>
            )}
            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
            )}

            {/* Profile Section */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                <h2 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
                    <User className="w-5 h-5 text-indigo-600 mr-2" />
                    Profil
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Gambar Profil</p>
                            <p className="text-xs text-gray-500">Klik ikon untuk mengubah gambar profil.</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                disabled={!isEditingUsername}
                            />
                            <button
                                onClick={() => setIsEditingUsername(!isEditingUsername)}
                                className="p-2 text-gray-500 hover:text-indigo-600"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm text-gray-500"
                        />
                    </div>
                    <button
                        onClick={handleUpdateProfile}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Simpan Perubahan
                    </button>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                <h2 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
                    <Lock className="w-5 h-5 text-indigo-600 mr-2" />
                    Keamanan
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Kata Sandi Lama</label>
                        <div className="relative">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                            <button
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600"
                            >
                                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Kata Sandi Baru</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                            <button
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600"
                            >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Konfirmasi Kata Sandi Baru</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                            <button
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleUpdatePassword}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Perbarui Kata Sandi
                    </button>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                <h2 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
                    <Globe className="w-5 h-5 text-indigo-600 mr-2" />
                    Preferensi
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Bahasa</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        >
                            <option value="id">Bahasa Indonesia</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Tema</label>
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Simpan Preferensi
                    </button>
                </div>
            </div>
        </div>
    );
}