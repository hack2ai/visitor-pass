import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Clock3,
  LogOut,
} from "lucide-react";

import AnimatedCounter from "../ui/AnimatedCounter";

interface SummaryCardsProps {
  total: number;
  checkedIn: number;
  pending: number;
  checkedOut: number;
  loading?: boolean;
}

const SummaryCards = ({
  total,
  checkedIn,
  pending,
  checkedOut,
  loading = false,
}: SummaryCardsProps) => {
  const cards = [
    {
      title: "Total Visitors",
      value: total,
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      progressColor: "bg-blue-500",
    },
    {
      title: "Checked In",
      value: checkedIn,
      icon: UserCheck,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      progressColor: "bg-green-500",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      progressColor: "bg-yellow-500",
    },
    {
      title: "Checked Out",
      value: checkedOut,
      icon: LogOut,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      progressColor: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.1,
              duration: 0.4,
            }}
            whileHover={{
              y: -8,
            }}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
          >
            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                {loading ? (
                  <div className="mt-4 h-10 w-24 animate-pulse rounded-lg bg-slate-200" />
                ) : (
                  <h2 className="mt-3 text-5xl font-bold tracking-tight text-slate-900">
                    <AnimatedCounter
                      end={card.value}
                      duration={1500}
                    />
                  </h2>
                )}

              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${card.bgColor}`}
              >
                <Icon
                  size={32}
                  className={card.iconColor}
                />
              </div>

            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">

              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: "100%",
                }}
                transition={{
                  duration: 1.2,
                }}
                className={`h-full rounded-full ${card.progressColor}`}
              />

            </div>

          </motion.div>
        );
      })}
    </div>
  );
};

export default SummaryCards;