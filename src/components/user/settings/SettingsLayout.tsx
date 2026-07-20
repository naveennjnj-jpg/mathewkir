// components/settings/SettingsLayout.tsx
import React, { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import ProfileTab from "./ProfileTab";
import NotificationsTab from "./NotificationsTab";
import SecurityTab from "./SecurityTab";
import PreferencesTab from "./PreferencesTab";

interface SettingsLayoutProps {
  defaultTab?: string;
  title?: string;
  subtitle?: string;
}

const SettingsLayout = ({
  defaultTab = "profile",
  title = "Settings",
  subtitle = "Manage your account, preferences, and security",
}: SettingsLayoutProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "notifications":
        return <NotificationsTab />;
      case "security":
        return <SecurityTab />;
      case "preferences":
        return <PreferencesTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] p-6">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">
            Account
          </p>
          <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63]">
            {title}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col sm:flex-row gap-6">
          <SettingsSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;