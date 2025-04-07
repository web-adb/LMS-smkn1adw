import { User } from "@clerk/nextjs/server";
import { useState } from "react";
import ProfileSection from "./ProfileSection";
import SecuritySection from "./SecuritySection";
import PreferencesSection from "./PreferencesSection";
import AdditionalSettingsCards from "./AdditionalSettingsCards";

interface AccountTabProps {
  user: User;
  setSuccessMessage: (message: string) => void;
  setErrorMessage: (message: string) => void;
}

export default function AccountTab({ user, setSuccessMessage, setErrorMessage }: AccountTabProps) {
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    security: true,
    preferences: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <ProfileSection 
          user={user}
          expanded={expandedSections.profile}
          toggleSection={toggleSection}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
        />
        
        <SecuritySection 
          user={user}
          expanded={expandedSections.security}
          toggleSection={toggleSection}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
        />
      </div>

      <div className="space-y-6">
        <PreferencesSection 
          setSuccessMessage={setSuccessMessage}
        />
        
        <AdditionalSettingsCards />
      </div>
    </div>
  );
}