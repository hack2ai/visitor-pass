import {
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  LogOut,
  Save,
} from "lucide-react";
import { toast } from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordFieldProps {
  label: string;
  name: keyof FormState;  // Fix: constrained to actual form keys, not loose string
  value: string;
  show: boolean;
  toggle: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// ── Sub-components ────────────────────────────────────────────────────────────

// Moved outside SecuritySettings so it isn't recreated on every render
const PasswordField = ({
  label,
  name,
  value,
  show,
  toggle,
  onChange,
}: PasswordFieldProps) => (
  <div>
    <label className="mb-2 block font-medium">
      {label}
    </label>

    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500"
      />

      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

// ── Constants ─────────────────────────────────────────────────────────────────

// Fix: explicit string[] annotation removes implicit any[] inference
const STRENGTH_LABELS: string[] = [
  "Very Weak",
  "Weak",
  "Fair",
  "Good",
  "Strong",
  "Excellent",
];

const STRENGTH_COLORS: string[] = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-emerald-600",
];

const INITIAL_FORM: FormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

// ── Component ─────────────────────────────────────────────────────────────────

const SecuritySettings = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  // Fix: ChangeEvent imported directly instead of via React namespace
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const passwordStrength = useMemo(() => {
    const pwd = form.newPassword;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }, [form.newPassword]);

  const strengthText = STRENGTH_LABELS[passwordStrength];
  const strengthColor = STRENGTH_COLORS[passwordStrength];

  const handleSave = () => {
    if (!form.currentPassword) {
      toast.error("Current password is required.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    toast.success("Security settings updated.");
  };

  const logoutAllDevices = () => {
    toast.success("Logged out from all active devices.");
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
          <Shield className="text-blue-600" />
          Security Settings
        </h2>

        <p className="mt-2 text-slate-500">
          Manage your account security and authentication.
        </p>
      </div>

      <div className="space-y-6">
        {/* Password fields */}
        <PasswordField
          label="Current Password"
          name="currentPassword"
          value={form.currentPassword}
          show={showCurrent}
          toggle={() => setShowCurrent((v) => !v)}
          onChange={handleChange}
        />

        <PasswordField
          label="New Password"
          name="newPassword"
          value={form.newPassword}
          show={showNew}
          toggle={() => setShowNew((v) => !v)}
          onChange={handleChange}
        />

        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          show={showConfirm}
          toggle={() => setShowConfirm((v) => !v)}
          onChange={handleChange}
        />

        {/* Password strength bar */}
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-600">Password Strength</span>
            <span className="font-semibold">{strengthText}</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`${strengthColor} h-full transition-all duration-300`}
              style={{ width: `${(passwordStrength / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Two-factor authentication */}
        <div className="flex items-center justify-between rounded-xl border p-4">
          <div>
            <h3 className="font-semibold">Two-Factor Authentication</h3>
            <p className="text-sm text-slate-500">Increase account security.</p>
          </div>

          <input
            type="checkbox"
            checked={twoFactor}
            onChange={() => setTwoFactor((v) => !v)}
            className="h-5 w-5 cursor-pointer"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            <Save size={18} />
            Save Security
          </button>

          <button
            onClick={logoutAllDevices}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-white transition hover:bg-red-700"
          >
            <LogOut size={18} />
            Logout All Devices
          </button>
        </div>

        {/* Last login info */}
        <div className="rounded-xl border bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Lock className="text-blue-600" size={18} />
            <span className="font-semibold">Last Login</span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Today • Chrome • Windows 11 • IP: 192.168.xxx.xxx
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SecuritySettings;