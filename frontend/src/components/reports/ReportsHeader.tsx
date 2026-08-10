import { motion } from "framer-motion";
import {
  FileText,
  CalendarDays,
  RefreshCcw,
} from "lucide-react";

interface ReportsHeaderProps {
  onRefresh?: () => void;
}

const ReportsHeader = ({
  onRefresh,
}: ReportsHeaderProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="
        flex
        flex-col
        gap-5
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      {/* Left */}

      <div className="flex items-center gap-5">

        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-blue-100
          "
        >
          <FileText
            size={32}
            className="text-blue-600"
          />
        </div>

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Reports
          </h1>

          <p className="mt-1 text-slate-500">
            Generate, export and print visitor reports.
          </p>

        </div>

      </div>

      {/* Right */}

      <div className="flex flex-wrap items-center gap-4">

        <div
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
          "
        >
          <CalendarDays
            size={18}
            className="text-blue-600"
          />

          <span className="text-sm font-medium text-slate-700">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>

        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          <RefreshCcw size={18} />

          Refresh
        </button>

      </div>
    </motion.div>
  );
};

export default ReportsHeader;