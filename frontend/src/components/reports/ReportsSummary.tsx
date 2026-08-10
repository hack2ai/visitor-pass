import {
  Users,
  UserCheck,
  Clock3,
  LogOut,
} from "lucide-react";

import DashboardCard from "../dashboard/DashboardCard";


interface ReportsSummaryProps {
  loading?: boolean;

  summary?: {
    totalVisitors: number;
    checkedIn: number;
    checkedOut: number;
    pending: number;
  };
}


const ReportsSummary = ({
  loading = false,

  summary = {
    totalVisitors: 0,
    checkedIn: 0,
    checkedOut: 0,
    pending: 0,
  },

}: ReportsSummaryProps) => {

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      <DashboardCard
        loading={loading}
        title="Total Visitors"
        value={summary.totalVisitors}
        icon={Users}
        color="bg-blue-600"
        subtitle="All registered visitors"
      />


      <DashboardCard
        loading={loading}
        title="Checked In"
        value={summary.checkedIn}
        icon={UserCheck}
        color="bg-green-600"
        subtitle="Currently inside"
      />


      <DashboardCard
        loading={loading}
        title="Pending"
        value={summary.pending}
        icon={Clock3}
        color="bg-yellow-500"
        subtitle="Awaiting approval"
      />


      <DashboardCard
        loading={loading}
        title="Checked Out"
        value={summary.checkedOut}
        icon={LogOut}
        color="bg-red-500"
        subtitle="Completed visits"
      />

    </div>
  );
};


export default ReportsSummary;