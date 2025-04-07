"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2, Settings } from "lucide-react";
import { useTheme } from '@/context/ThemeContext';
import Breadcrumb from "./Breadcrumb";
import TabNavigation from "./TabNavigation";
import AccountTab from "./AccountTab";
import ComingSoonTab from "./ComingSoonTab";
import MessageBanner from "./MessageBanner";

export default function PengaturanPage() {
  const { user, isLoaded } = useUser();
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("account");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`p-4 md:p-6 min-h-screen transition-colors duration-200 ${
        resolvedTheme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Breadcrumb />
      
      <div className="flex items-center mb-6">
        <Settings className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Pengaturan
        </h1>
      </div>

      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />

      <MessageBanner 
        successMessage={successMessage} 
        errorMessage={errorMessage} 
      />

      {activeTab === "account" ? (
        <AccountTab 
          user={user}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
        />
      ) : (
        <ComingSoonTab 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}