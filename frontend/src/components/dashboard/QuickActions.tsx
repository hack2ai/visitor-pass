import { motion } from "framer-motion";
import {
  UserPlus,
  QrCode,
  UserCheck,
  LogOut,
  FileText,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create Visitor",
      description: "Register a new visitor",
      icon: UserPlus,
      color: "bg-blue-100 text-blue-600",
      route: "/visitors/create",
    },
    {
      title: "QR Scanner",
      description: "Scan visitor QR code",
      icon: QrCode,
      color: "bg-green-100 text-green-600",
      route: "/scanner",
    },
    {
      title: "Check In",
      description: "Manage visitor check-in",
      icon: UserCheck,
      color: "bg-emerald-100 text-emerald-600",
      route: "/visitors",
    },
    {
      title: "Check Out",
      description: "Manage visitor check-out",
      icon: LogOut,
      color: "bg-orange-100 text-orange-600",
      route: "/visitors",
    },
    {
      title: "Reports",
      description: "View visitor reports",
      icon: FileText,
      color: "bg-purple-100 text-purple-600",
      route: "/reports",
    },
    {
      title: "Export Reports",
      description: "Download PDF / Excel reports",
      icon: Download,
      color: "bg-red-100 text-red-600",
      route: "/reports",
    },
  ];

  return (
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
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {/* Header */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-800">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Frequently used actions
        </p>

      </div>

      {/* Actions */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                y: -6,
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() => navigate(action.route)}
              className="group rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-blue-300 hover:shadow-lg"
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${action.color}`}
              >
                <Icon size={28} />
              </div>

              <h3 className="font-semibold text-slate-800">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {action.description}
              </p>
            </motion.button>
          );
        })}

      </div>
    </motion.div>
  );
};

export default QuickActions;