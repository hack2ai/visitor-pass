import {
  Users,
  UserCheck,
  Clock3,
  LogOut,
} from "lucide-react";

import DashboardCard from "./DashboardCard";

interface DashboardStatsProps {
  loading: boolean;
  stats: {
    totalVisitors: number;
    checkedIn: number;
    pending: number;
    checkedOut: number;
  };
}

const DashboardStats = ({
  loading,
  stats,
}: DashboardStatsProps) => {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="Total Visitors"
        value={stats.totalVisitors.toLocaleString()}
        icon={Users}
        color="bg-blue-600"
      />

      <DashboardCard
        title="Checked In"
        value={stats.checkedIn.toLocaleString()}
        icon={UserCheck}
        color="bg-green-600"
      />

      <DashboardCard
        title="Pending"
        value={stats.pending.toLocaleString()}
        icon={Clock3}
        color="bg-yellow-500"
      />

      <DashboardCard
        title="Checked Out"
        value={stats.checkedOut.toLocaleString()}
        icon={LogOut}
        color="bg-red-500"
      />
    </div>
  );
};

export default DashboardStats;