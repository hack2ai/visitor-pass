import { motion } from "framer-motion";
import {
  Eye,
  Pencil,
  Trash2,
  Building2,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { RecentVisitor } from "../../api/dashboard.api";

interface Props {
  visitors: RecentVisitor[];
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700 border-green-200";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";

    case "CHECKED_IN":
      return "bg-blue-100 text-blue-700 border-blue-200";

    case "CHECKED_OUT":
      return "bg-purple-100 text-purple-700 border-purple-200";

    case "REJECTED":
      return "bg-red-100 text-red-700 border-red-200";

    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const RecentVisitors = ({
  visitors,
}: Props) => {
  const navigate = useNavigate();

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
      className="rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Recent Visitors
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest visitor registrations
          </p>
        </div>

        <button
          onClick={() => navigate("/visitors")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          View All
        </button>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="sticky top-0 bg-slate-50">

            <tr className="text-left text-sm uppercase tracking-wide text-slate-600">

              <th className="px-6 py-4">
                Visitor
              </th>

              <th className="px-6 py-4">
                Company
              </th>

              <th className="px-6 py-4">
                Host
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Date
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {visitors.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="py-14 text-center"
                >

                  <UserCircle
                    size={60}
                    className="mx-auto text-slate-300"
                  />

                  <h3 className="mt-3 text-lg font-semibold text-slate-700">
                    No Visitors Found
                  </h3>

                  <p className="mt-1 text-slate-500">
                    Recent visitors will appear here.
                  </p>

                </td>

              </tr>

            ) : (

              visitors.map((visitor) => (

                <tr
                  key={visitor.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50"
                >

                  {/* Visitor */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">

                        <UserCircle
                          size={28}
                          className="text-blue-600"
                        />

                      </div>

                      <div>

                        <h4 className="font-semibold text-slate-800">
                          {visitor.fullName}
                        </h4>

                        <p className="text-sm text-slate-500">
                          {visitor.email}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Company */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-2">

                      <Building2
                        size={18}
                        className="text-slate-500"
                      />

                      {visitor.company ?? "-"}

                    </div>

                  </td>

                  {/* Host */}

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {visitor.host.fullName}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                        visitor.status
                      )}`}
                    >
                      {visitor.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>

                  </td>

                  {/* Date */}

                  <td className="px-6 py-4 text-slate-600">

                    {new Date(
                      visitor.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}

                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() =>
                          navigate(`/visitors/${visitor.id}`)
                        }
                        className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/visitors/edit/${visitor.id}`)
                        }
                        className="rounded-lg bg-green-100 p-2 text-green-600 transition hover:bg-green-600 hover:text-white"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </motion.div>
  );
};

export default RecentVisitors;