import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface StatusChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = [
  "#22c55e", // Approved
  "#eab308", // Pending
  "#3b82f6", // Checked In
  "#a855f7", // Checked Out
  "#ef4444", // Rejected (future)
];

const StatusChart = ({
  data,
}: StatusChartProps) => {
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
          Visitor Status
        </h2>

        <p className="mt-2 text-slate-500">
          Distribution of visitor statuses.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
          <p className="text-slate-500">
            No status data available.
          </p>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default StatusChart;