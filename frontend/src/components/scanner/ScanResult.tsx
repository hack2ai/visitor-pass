import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  User,
  CheckCircle2,
  LogOut,
  RotateCcw,
} from "lucide-react";

import type { Visitor } from "../../types/visitor";

interface ScanResultProps {
  visitor: Visitor | null;
  loading?: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onScanAgain: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700";

    case "CHECKED_IN":
      return "bg-blue-100 text-blue-700";

    case "CHECKED_OUT":
      return "bg-purple-100 text-purple-700";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-red-100 text-red-700";
  }
};

const ScanResult = ({
  visitor,
  loading = false,
  onCheckIn,
  onCheckOut,
  onScanAgain,
}: ScanResultProps) => {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-slate-500">
            Loading visitor...
          </p>
        </div>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <User
            size={60}
            className="mx-auto text-slate-400"
          />

          <h3 className="mt-4 text-lg font-semibold">
            No Visitor
          </h3>

          <p className="mt-2 text-slate-500">
            Scan a QR Code to view visitor details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="space-y-5"
    >
      <div className="flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <User
            size={50}
            className="text-blue-600"
          />
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {visitor.fullName}
        </h2>

        <span
          className={`mt-3 inline-block rounded-full px-4 py-1 text-sm font-semibold ${getStatusColor(
            visitor.status
          )}`}
        >
          {visitor.status}
        </span>
      </div>

      <div className="space-y-3 rounded-xl bg-slate-50 p-4">

        <div className="flex items-center gap-3">
          <Building2 size={18} />
          <span>{visitor.company || "-"}</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail size={18} />
          <span>{visitor.email || "-"}</span>
        </div>

        <div className="flex items-center gap-3">
          <Phone size={18} />
          <span>{visitor.phone}</span>
        </div>

        <div className="flex items-center gap-3">
          <User size={18} />
          <span>{visitor.purpose}</span>
        </div>

      </div>

      <div className="grid gap-3">

        {visitor.status !== "CHECKED_IN" && (
          <button
            onClick={onCheckIn}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-medium text-white transition hover:bg-green-700"
          >
            <CheckCircle2 size={18} />
            Check In
          </button>
        )}

        {visitor.status === "CHECKED_IN" && (
          <button
            onClick={onCheckOut}
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-medium text-white transition hover:bg-purple-700"
          >
            <LogOut size={18} />
            Check Out
          </button>
        )}

        <button
          onClick={onScanAgain}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          <RotateCcw size={18} />
          Scan Again
        </button>

      </div>
    </motion.div>
  );
};

export default ScanResult;