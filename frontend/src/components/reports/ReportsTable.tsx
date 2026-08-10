import {
  Eye,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { ReportVisitor as ApiReportVisitor } from "../../api/reports.api";

// ============================================================
// TYPES
// ============================================================

/**
 * Uses the API ReportVisitor as the base type.
 *
 * The backend can also return a nested host object, so we
 * support that here without creating a completely separate
 * incompatible ReportVisitor type.
 */
type ReportVisitor = ApiReportVisitor & {
  hostName?: string | null;

  host?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  } | null;

  updatedAt?: string;
  checkIn?: string | null;
  checkOut?: string | null;
};

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ReportsTableProps {
  visitors: ReportVisitor[];

  loading?: boolean;

  page: number;

  pagination: Pagination | null;

  onPageChange: (page: number) => void;

  onDownload?: (visitor: ReportVisitor) => void;

  onPrint?: (visitor: ReportVisitor) => void;
}

// ============================================================
// STATUS COLOR
// ============================================================

const statusColor = (status: string): string => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "CHECKED_IN":
      return "bg-blue-100 text-blue-700";

    case "CHECKED_OUT":
      return "bg-purple-100 text-purple-700";

    case "REJECTED":
      return "bg-red-100 text-red-700";

    case "CANCELLED":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

// ============================================================
// STATUS LABEL
// ============================================================

const statusLabel = (status: string): string => {
  if (!status) {
    return "-";
  }

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

// ============================================================
// DATE FORMATTER
// ============================================================

const formatDate = (date?: string | null): string => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ============================================================
// COMPONENT
// ============================================================

const ReportsTable = ({
  visitors,
  loading = false,
  page,
  pagination,
  onPageChange,
  onDownload,
  onPrint,
}: ReportsTableProps) => {
  const navigate = useNavigate();

  // ==========================================================
  // SAFE PAGE VALUES
  // ==========================================================

  const currentPage = pagination?.page ?? page ?? 1;

  const totalPages = pagination?.totalPages ?? 1;

  const hasPreviousPage = currentPage > 1;

  const hasNextPage = currentPage < totalPages;

  // ==========================================================
  // VIEW VISITOR
  // ==========================================================

  const handleView = (visitor: ReportVisitor): void => {
    navigate(`/visitors/${visitor.id}`);
  };

  // ==========================================================
  // DOWNLOAD
  // ==========================================================

  const handleDownload = (visitor: ReportVisitor): void => {
    if (onDownload) {
      onDownload(visitor);
      return;
    }

    console.warn(
      "Download handler is not configured for visitor:",
      visitor.id
    );
  };

  // ==========================================================
  // PRINT
  // ==========================================================

  const handlePrint = (visitor: ReportVisitor): void => {
    if (onPrint) {
      onPrint(visitor);
      return;
    }

    console.warn(
      "Print handler is not configured for visitor:",
      visitor.id
    );
  };

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const handlePrevious = (): void => {
    if (hasPreviousPage && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (): void => {
    if (hasNextPage && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-sm">
      {/* ======================================================
          LOADING OVERLAY
      ====================================================== */}

      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-sm font-semibold text-slate-700">
              Loading reports...
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* ==================================================
              HEADER
          ================================================== */}

          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Visitor
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Company
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Host
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Purpose
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Date
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          {/* ==================================================
              BODY
          ================================================== */}

          <tbody>
            {visitors.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl">📋</div>

                    <p className="font-semibold text-slate-700">
                      No reports found
                    </p>

                    <p className="text-sm text-slate-500">
                      Try changing your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              visitors.map((visitor) => {
                // Backend may return either hostName or nested host.name.
                const hostName =
                  visitor.hostName ??
                  visitor.host?.name ??
                  "-";

                return (
                  <tr
                    key={visitor.id}
                    className="border-t border-slate-200 transition hover:bg-slate-50"
                  >
                    {/* ==================================================
                        VISITOR
                    ================================================== */}

                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">
                        {visitor.fullName || "-"}
                      </div>

                      <div className="mt-1 text-sm text-slate-500">
                        {visitor.email || "-"}
                      </div>

                      {visitor.phone && (
                        <div className="mt-1 text-xs text-slate-400">
                          {visitor.phone}
                        </div>
                      )}
                    </td>

                    {/* ==================================================
                        COMPANY
                    ================================================== */}

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {visitor.company || "-"}
                    </td>

                    {/* ==================================================
                        HOST
                    ================================================== */}

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">
                        {hostName}
                      </div>

                      {visitor.host?.email && (
                        <div className="mt-1 text-xs text-slate-500">
                          {visitor.host.email}
                        </div>
                      )}
                    </td>

                    {/* ==================================================
                        PURPOSE
                    ================================================== */}

                    <td className="max-w-xs px-6 py-4 text-sm text-slate-700">
                      <div
                        className="truncate"
                        title={visitor.purpose || "-"}
                      >
                        {visitor.purpose || "-"}
                      </div>
                    </td>

                    {/* ==================================================
                        STATUS
                    ================================================== */}

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                          visitor.status
                        )}`}
                      >
                        {statusLabel(visitor.status)}
                      </span>
                    </td>

                    {/* ==================================================
                        DATE
                    ================================================== */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(visitor.createdAt)}
                    </td>

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() => handleView(visitor)}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
                          title="View visitor"
                          aria-label={`View ${visitor.fullName}`}
                        >
                          <Eye size={18} />
                        </button>

                        {/* DOWNLOAD */}

                        <button
                          type="button"
                          onClick={() => handleDownload(visitor)}
                          className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 hover:text-green-800"
                          title="Download visitor pass"
                          aria-label={`Download pass for ${visitor.fullName}`}
                        >
                          <Download size={18} />
                        </button>

                        {/* PRINT */}

                        <button
                          type="button"
                          onClick={() => handlePrint(visitor)}
                          className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50 hover:text-purple-800"
                          title="Print visitor report"
                          aria-label={`Print report for ${visitor.fullName}`}
                        >
                          <Printer size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================
          PAGINATION
      ======================================================== */}

      {pagination && pagination.total > 0 && (
        <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* RESULTS INFO */}

          <div className="text-sm text-slate-500">
            Showing page{" "}
            <strong className="text-slate-700">
              {currentPage}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {totalPages}
            </strong>

            <span className="ml-2">
              ({pagination.total}{" "}
              {pagination.total === 1
                ? "visitor"
                : "visitors"})
            </span>
          </div>

          {/* PAGINATION BUTTONS */}

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!hasPreviousPage || loading}
              onClick={handlePrevious}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="min-w-[80px] text-center text-sm font-semibold text-slate-700">
              {currentPage} / {totalPages}
            </div>

            <button
              type="button"
              disabled={!hasNextPage || loading}
              onClick={handleNext}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;