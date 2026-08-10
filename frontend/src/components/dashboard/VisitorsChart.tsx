import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface VisitorsChartProps {
  data: {
    day: string;
    visitors: number;
  }[];
}

const VisitorsChart = ({
  data,
}: VisitorsChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
    >
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Weekly Visitors
        </h2>

        <p className="mt-2 text-slate-500">
          Visitor registrations over the past 7 days.
        </p>
      </div>

      {/* Empty State */}

      {data.length === 0 ? (
        <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
          <p className="text-slate-500">
            No visitor data available.
          </p>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 25,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{
                  stroke: "#2563eb",
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.08)",
                }}
              />

              <Legend />

              <Line
                name="Visitors"
                type="monotone"
                dataKey="visitors"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{
                  r: 5,
                }}
                activeDot={{
                  r: 8,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default VisitorsChart;