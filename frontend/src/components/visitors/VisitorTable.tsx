import {
  FaEye,
  FaEdit,
  FaTrash,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Visitor, VisitorStatus } from "../../types/visitor";

interface Props {
  visitors: Visitor[];
  onDelete?: (id: string) => void;
}

const statusStyles: Record<
  VisitorStatus,
  string
> = {
  APPROVED:
    "bg-green-100 text-green-700 border border-green-200",

  PENDING:
    "bg-yellow-100 text-yellow-700 border border-yellow-200",

  CHECKED_IN:
    "bg-blue-100 text-blue-700 border border-blue-200",

  CHECKED_OUT:
    "bg-purple-100 text-purple-700 border border-purple-200",

  REJECTED:
    "bg-red-100 text-red-700 border border-red-200",
};

const VisitorTable = ({
  visitors,
  onDelete,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="sticky top-0 bg-slate-100">

            <tr className="text-sm font-semibold text-slate-700">

              <th className="px-6 py-4 text-left">
                Visitor
              </th>

              <th className="px-6 py-4 text-left">
                Company
              </th>

              <th className="px-6 py-4 text-left">
                Host
              </th>

              <th className="px-6 py-4 text-left">
                Purpose
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-left">
                Created
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {visitors.map((visitor) => (

              <tr
                key={visitor.id}
                className="
                  border-t
                  transition-all
                  hover:bg-slate-50
                "
              >

                {/* Visitor */}

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">

                      <FaUserCircle
                        size={28}
                        className="text-blue-600"
                      />

                    </div>

                    <div>

                      <div className="font-semibold text-slate-800">
                        {visitor.fullName}
                      </div>

                      <div className="text-sm text-slate-500">
                        {visitor.email || "No Email"}
                      </div>

                    </div>

                  </div>

                </td>

                {/* Company */}

                <td className="px-6 py-4">
                  {visitor.company || "-"}
                </td>

                {/* Host */}

                <td className="px-6 py-4">
                  {visitor.hostName}
                </td>

                {/* Purpose */}

                <td className="px-6 py-4">
                  {visitor.purpose}
                </td>

                {/* Status */}

                <td className="px-6 py-4">

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${
                        statusStyles[
                          visitor.status
                        ]
                      }
                    `}
                  >
                    {visitor.status.replace(
                      "_",
                      " "
                    )}
                  </span>

                </td>

                {/* Created */}

                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(
                    visitor.createdAt
                  ).toLocaleDateString()}
                </td>

                {/* Actions */}

                <td className="px-6 py-4">

                  <div className="flex items-center justify-center gap-2">

                    <button
                      title="View"
                      onClick={() =>
                        navigate(
                          `/visitors/${visitor.id}`
                        )
                      }
                      className="
                        rounded-lg
                        p-2
                        text-blue-600
                        transition
                        hover:bg-blue-100
                      "
                    >
                      <FaEye />
                    </button>

                    <button
                      title="Edit"
                      onClick={() =>
                        navigate(
                          `/visitors/edit/${visitor.id}`
                        )
                      }
                      className="
                        rounded-lg
                        p-2
                        text-green-600
                        transition
                        hover:bg-green-100
                      "
                    >
                      <FaEdit />
                    </button>

                    <button
                      title="Delete"
                      onClick={() =>
                        onDelete?.(visitor.id)
                      }
                      className="
                        rounded-lg
                        p-2
                        text-red-600
                        transition
                        hover:bg-red-100
                      "
                    >
                      <FaTrash />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {visitors.length === 0 && (

        <div className="flex flex-col items-center justify-center py-16">

          <FaUserCircle
            className="mb-4 text-slate-300"
            size={60}
          />

          <h3 className="text-xl font-semibold text-slate-700">
            No Visitors Found
          </h3>

          <p className="mt-2 text-slate-500">
            Create your first visitor to get started.
          </p>

        </div>

      )}

    </div>
  );
};

export default VisitorTable;