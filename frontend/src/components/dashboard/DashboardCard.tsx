import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;

  subtitle?: string;

  trend?: number;

  loading?: boolean;
}

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  trend,
  loading = false,
}: DashboardCardProps) => {
  if (loading) {
    return (
      <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
    );
  }

  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        hover:shadow-xl
      "
    >
      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-800">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

          {typeof trend === "number" && (
            <div className="mt-4 flex items-center gap-2">

              {trend >= 0 ? (
                <>
                  <ArrowUpRight
                    size={18}
                    className="text-green-600"
                  />

                  <span className="text-sm font-semibold text-green-600">
                    +{trend}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight
                    size={18}
                    className="text-red-600"
                  />

                  <span className="text-sm font-semibold text-red-600">
                    {trend}%
                  </span>
                </>
              )}

              <span className="text-sm text-slate-400">
                vs last week
              </span>

            </div>
          )}

        </div>

        <motion.div
          whileHover={{
            rotate: 10,
            scale: 1.1,
          }}
          className={`
            ${color}
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            text-white
            shadow-lg
          `}
        >
          <Icon size={30} />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default DashboardCard;