import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import type {
  WeeklyVisitor,
  StatusData,
} from "../../api/dashboard.api";

interface VisitorAnalyticsProps {
  weeklyVisitors: WeeklyVisitor[];
  statusChart: StatusData[];
}

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
];

const VisitorAnalytics = ({
  weeklyVisitors,
  statusChart,
}: VisitorAnalyticsProps) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* Weekly Visitors */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Weekly Visitors
          </h2>

          <p className="mt-1 text-slate-500">
            Visitor registrations over the last 7 days
          </p>
        </div>

        <div className="h-[340px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={weeklyVisitors}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Status Chart */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Visitor Status
          </h2>

          <p className="mt-1 text-slate-500">
            Current visitor status distribution
          </p>
        </div>

        <div className="h-[340px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={statusChart}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusChart.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
};

export default VisitorAnalytics;