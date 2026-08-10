import { motion } from "framer-motion";
import {
  UserPlus,
  UserCheck,
  FileText,
  QrCode,
  Clock,
} from "lucide-react";

import type { ActivityItem } from "../../api/dashboard.api";

interface Props {
  activities: ActivityItem[];
}

const getActivityIcon = (status: string) => {
  switch (status) {
    case "CHECKED_IN":
      return (
        <UserCheck
          size={20}
          className="text-green-600"
        />
      );

    case "CHECKED_OUT":
      return (
        <FileText
          size={20}
          className="text-purple-600"
        />
      );

    case "APPROVED":
      return (
        <QrCode
          size={20}
          className="text-blue-600"
        />
      );

    case "PENDING":
      return (
        <Clock
          size={20}
          className="text-yellow-600"
        />
      );

    default:
      return (
        <UserPlus
          size={20}
          className="text-slate-600"
        />
      );
  }
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ActivityTimeline = ({
  activities,
}: Props) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 30,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}

      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-2xl font-bold text-slate-800">
          Recent Activity
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Latest visitor activities
        </p>
      </div>

      {/* Timeline */}

      <div className="max-h-[520px] overflow-y-auto p-6">

        {activities.length === 0 ? (
          <div className="py-14 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">

              <UserPlus
                size={30}
                className="text-slate-400"
              />

            </div>

            <h3 className="text-lg font-semibold text-slate-700">
              No Recent Activity
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Activity will appear here after visitors interact with the system.
            </p>

          </div>
        ) : (
          <div className="relative">

            <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-200" />

            <div className="space-y-7">

              {activities.map((activity) => (

                <motion.div
                  key={activity.id}
                  whileHover={{
                    x: 6,
                  }}
                  className="relative flex gap-5"
                >

                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">

                    {getActivityIcon(activity.status)}

                  </div>

                  <div className="flex-1 rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100">

                    <div className="flex items-start justify-between">

                      <div>

                        <h3 className="font-semibold text-slate-800">
                          {activity.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                          {activity.description}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          Host : {activity.hostName}
                        </p>

                      </div>

                      <span className="text-xs whitespace-nowrap text-slate-400">
                        {formatTime(activity.updatedAt)}
                      </span>

                    </div>

                  </div>

                </motion.div>

              ))}

            </div>

          </div>
        )}

      </div>

    </motion.div>
  );
};

export default ActivityTimeline;