import { useState } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { toast } from "react-hot-toast";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    maintenanceMode: false,
    autoBackup: true,
    sessionTimeout: 30,
    language: "English",
    timezone: "Asia/Kolkata",
  });

  const handleToggle = (
    key: "darkMode" | "maintenanceMode" | "autoBackup"
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    toast.success("System settings saved successfully.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-slate-800">
        System Settings
      </h2>

      <p className="mt-2 text-slate-500">
        Configure application preferences and system behavior.
      </p>

      <div className="mt-8 space-y-6">
        {/* Dark Mode */}

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">
              Dark Mode
            </h3>

            <p className="text-sm text-slate-500">
              Enable dark theme.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={() => handleToggle("darkMode")}
            className="h-5 w-5"
          />
        </div>

        {/* Maintenance */}

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">
              Maintenance Mode
            </h3>

            <p className="text-sm text-slate-500">
              Disable public access temporarily.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={() =>
              handleToggle("maintenanceMode")
            }
            className="h-5 w-5"
          />
        </div>

        {/* Backup */}

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">
              Automatic Backup
            </h3>

            <p className="text-sm text-slate-500">
              Backup database every day.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.autoBackup}
            onChange={() =>
              handleToggle("autoBackup")
            }
            className="h-5 w-5"
          />
        </div>

        {/* Session Timeout */}

        <div>
          <label className="mb-2 block font-semibold">
            Session Timeout (minutes)
          </label>

          <input
            type="number"
            min={5}
            max={180}
            value={settings.sessionTimeout}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                sessionTimeout: Number(
                  e.target.value
                ),
              }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Language */}

        <div>
          <label className="mb-2 block font-semibold">
            Language
          </label>

          <select
            value={settings.language}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                language: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>

        {/* Timezone */}

        <div>
          <label className="mb-2 block font-semibold">
            Time Zone
          </label>

          <select
            value={settings.timezone}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                timezone: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option>Asia/Kolkata</option>
            <option>UTC</option>
            <option>America/New_York</option>
            <option>Europe/London</option>
          </select>
        </div>

        {/* Save */}

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          <Save size={20} />

          Save Settings
        </button>
      </div>
    </motion.div>
  );
};

export default SystemSettings;