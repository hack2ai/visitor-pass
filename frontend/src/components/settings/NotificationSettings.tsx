import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  Smartphone,
  Monitor,
  MessageSquare,
  Calendar,
  AlertTriangle,
  Shield,
  TrendingUp,
  Save,
} from "lucide-react";
import { toast } from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  visitReminders: boolean;
  securityAlerts: boolean;
  weeklyReports: boolean;
  systemUpdates: boolean;
  emergencyAlerts: boolean;
}

interface NotificationItem {
  key: keyof NotificationSettings;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  icon: React.ReactNode;
  onToggle: () => void;
}

// ── ToggleRow — defined at module scope so it's never recreated on render ─────

const ToggleRow = ({
  title,
  description,
  checked,
  icon,
  onToggle,
}: ToggleRowProps) => (
  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-5 transition hover:bg-slate-50">
    <div className="flex gap-4">
      <div className="rounded-xl bg-blue-100 p-3 text-blue-600">{icon}</div>

      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>

    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      className="h-5 w-5 cursor-pointer accent-blue-600"
    />
  </div>
);

// ── Notification items config — static, defined once outside the component ────

const NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    key: "emailNotifications",
    title: "Email Notifications",
    description: "Receive important notifications via email.",
    icon: <Mail size={22} />,
  },
  {
    key: "smsNotifications",
    title: "SMS Notifications",
    description: "Receive SMS alerts on your mobile device.",
    icon: <Smartphone size={22} />,
  },
  {
    key: "pushNotifications",
    title: "Push Notifications",
    description: "Enable browser push notifications.",
    icon: <Bell size={22} />,
  },
  {
    key: "inAppNotifications",
    title: "In-App Notifications",
    description: "Show notifications inside the application.",
    icon: <Monitor size={22} />,
  },
  {
    key: "visitReminders",
    title: "Visit Reminders",
    description: "Get reminded about upcoming visits.",
    icon: <Calendar size={22} />,
  },
  {
    key: "securityAlerts",
    title: "Security Alerts",
    description: "Be notified of suspicious activity.",
    icon: <Shield size={22} />,
  },
  {
    key: "weeklyReports",
    title: "Weekly Reports",
    description: "Receive a weekly summary of visitor activity.",
    icon: <TrendingUp size={22} />,
  },
  {
    key: "systemUpdates",
    title: "System Updates",
    description: "Stay informed about system changes.",
    icon: <MessageSquare size={22} />,
  },
  {
    key: "emergencyAlerts",
    title: "Emergency Alerts",
    description: "Receive critical emergency notifications immediately.",
    icon: <AlertTriangle size={22} />,
  },
];

const INITIAL_SETTINGS: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  inAppNotifications: true,
  visitReminders: true,
  securityAlerts: true,
  weeklyReports: false,
  systemUpdates: false,
  emergencyAlerts: true,
};

// ── Component ─────────────────────────────────────────────────────────────────

const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(INITIAL_SETTINGS);

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // Replace with an API call, e.g. await saveNotificationSettings(settings)
    toast.success("Notification preferences saved.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <Bell className="text-blue-600" />
          Notification Settings
        </h2>

        <p className="mt-2 text-slate-500">
          Choose how and when you want to be notified.
        </p>
      </div>

      {/* Toggle rows — rendered from config array, no repetition */}
      <div className="space-y-3">
        {NOTIFICATION_ITEMS.map((item) => (
          <ToggleRow
            key={item.key}
            title={item.title}
            description={item.description}
            checked={settings[item.key]}
            onToggle={() => toggleSetting(item.key)}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Save */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
          <Save size={18} />
          Save Preferences
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;