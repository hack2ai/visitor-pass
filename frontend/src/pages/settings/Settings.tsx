import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Shield,
  Bell,
  Settings as SettingsIcon,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";

import ProfileSettings from "../../components/settings/ProfileSettings";
import SecuritySettings from "../../components/settings/SecuritySettings";
import NotificationSettings from "../../components/settings/NotificationSettings";
import SystemSettings from "../../components/settings/SystemSettings";

type Tab =
  | "profile"
  | "security"
  | "notifications"
  | "system";

const tabs = [
  {
    id: "profile",
    title: "Profile",
    icon: User,
  },
  {
    id: "security",
    title: "Security",
    icon: Shield,
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
  },
  {
    id: "system",
    title: "System",
    icon: SettingsIcon,
  },
] as const;

const Settings = () => {
  const [activeTab, setActiveTab] =
    useState<Tab>("profile");

  return (
    <MainLayout>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="mx-auto max-w-7xl space-y-8"
      >
        {/* ========================================= */}
        {/* Header */}
        {/* ========================================= */}

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Settings
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your account, security,
            notifications and system preferences.
          </p>
        </div>

        {/* ========================================= */}
        {/* Tabs */}
        {/* ========================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">

            {tabs.map((tab) => {
              const Icon = tab.icon;

              const active =
                activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`flex items-center justify-center gap-3 rounded-xl px-5 py-4 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={18} />

                  {tab.title}
                </button>
              );
            })}

          </div>

        </div>

        {/* ========================================= */}
        {/* Content */}
        {/* ========================================= */}

        <motion.div
          key={activeTab}
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.25,
          }}
        >
          {activeTab === "profile" && (
            <ProfileSettings />
          )}

          {activeTab === "security" && (
            <SecuritySettings />
          )}

          {activeTab ===
            "notifications" && (
            <NotificationSettings />
          )}

          {activeTab === "system" && (
            <SystemSettings />
          )}
        </motion.div>

      </motion.div>
    </MainLayout>
  );
};

export default Settings;