import React from "react";
import {
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaSyncAlt,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import useDashboard from "../../hooks/useDashboard";

// ============================================================
// TYPES
// ============================================================

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClassName: string;
  bgClassName: string;
  onClick?: () => void;
}

interface StatusItemProps {
  label: string;
  value: number;
  color: string;
}

// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
  title,
  value,
  icon,
  iconClassName,
  bgClassName,
  onClick,
}: StatCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 transition-all duration-200 ${
        onClick
          ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg"
          : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-800">
            {value.toLocaleString()}
          </h3>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClassName}`}
        >
          <span className={iconClassName}>
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SKELETON CARD
// ============================================================

const StatCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-20 bg-slate-200 rounded animate-pulse" />
        </div>

        <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
};

// ============================================================
// STATUS ITEM
// ============================================================

const StatusItem = ({
  label,
  value,
  color,
}: StatusItemProps) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center gap-3">
        <span
          className={`w-3 h-3 rounded-full ${color}`}
        />

        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>
      </div>

      <span className="font-semibold text-slate-800">
        {value.toLocaleString()}
      </span>
    </div>
  );
};

// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {
  const navigate = useNavigate();

  const {
    loading,
    error,
    stats,
    statusChart,
    recentVisitors,
    refreshDashboard,
  } = useDashboard();

  // ==========================================================
  // HELPERS
  // ==========================================================

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";

      case "APPROVED":
        return "Approved";

      case "REJECTED":
        return "Rejected";

      case "CHECKED_IN":
        return "Checked In";

      case "CHECKED_OUT":
        return "Checked Out";

      default:
        return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "CHECKED_IN":
        return "bg-blue-100 text-blue-700";

      case "CHECKED_OUT":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      undefined,
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">

          {/* Header */}
          <div>
            <div className="h-8 w-52 bg-slate-200 rounded animate-pulse" />

            <div className="mt-2 h-4 w-80 bg-slate-200 rounded animate-pulse" />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <StatCardSkeleton
                  key={index}
                />
              )
            )}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
              <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />

              <div className="mt-6 h-72 bg-slate-100 rounded-xl animate-pulse" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />

              <div className="mt-6 space-y-5">
                {Array.from({ length: 5 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-8 bg-slate-100 rounded animate-pulse"
                    />
                  )
                )}
              </div>
            </div>

          </div>
        </div>
      </MainLayout>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="max-w-lg w-full bg-white border border-red-200 rounded-2xl shadow-sm p-8 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <FaTimesCircle className="text-red-600 text-3xl" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-800">
              Failed to Load Dashboard
            </h2>

            <p className="mt-3 text-slate-500">
              {error}
            </p>

            <button
              onClick={() => {
                void refreshDashboard();
              }}
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition"
            >
              <FaSyncAlt />
              Try Again
            </button>

          </div>
        </div>
      </MainLayout>
    );
  }

  // ==========================================================
  // DASHBOARD
  // ==========================================================

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="mt-1 text-slate-500">
              Monitor visitor activity and manage your visitor system.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => {
                void refreshDashboard();
              }}
              className="inline-flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium px-4 py-2.5 rounded-xl transition"
            >
              <FaSyncAlt />
              Refresh
            </button>

            <button
              onClick={() =>
                navigate("/visitors/create")
              }
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition"
            >
              <FaUserPlus />
              Add Visitor
            </button>

          </div>
        </div>

        {/* ==================================================
            STAT CARDS
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

          <StatCard
            title="Total Visitors"
            value={stats.total}
            icon={<FaUsers />}
            iconClassName="text-blue-600"
            bgClassName="bg-blue-100"
            onClick={() =>
              navigate("/visitors")
            }
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<FaClock />}
            iconClassName="text-yellow-600"
            bgClassName="bg-yellow-100"
            onClick={() =>
              navigate("/visitors?status=PENDING")
            }
          />

          <StatCard
            title="Approved"
            value={stats.approved}
            icon={<FaCheckCircle />}
            iconClassName="text-green-600"
            bgClassName="bg-green-100"
            onClick={() =>
              navigate("/visitors?status=APPROVED")
            }
          />

          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={<FaTimesCircle />}
            iconClassName="text-red-600"
            bgClassName="bg-red-100"
            onClick={() =>
              navigate("/visitors?status=REJECTED")
            }
          />

          <StatCard
            title="Checked In"
            value={stats.checkedIn}
            icon={<FaSignInAlt />}
            iconClassName="text-blue-600"
            bgClassName="bg-blue-100"
            onClick={() =>
              navigate("/visitors?status=CHECKED_IN")
            }
          />

          <StatCard
            title="Checked Out"
            value={stats.checkedOut}
            icon={<FaSignOutAlt />}
            iconClassName="text-purple-600"
            bgClassName="bg-purple-100"
            onClick={() =>
              navigate("/visitors?status=CHECKED_OUT")
            }
          />

        </div>

        {/* ==================================================
            ANALYTICS
        ================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* STATUS OVERVIEW */}

          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">

            <div className="p-6 border-b border-slate-100">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Visitor Overview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Current visitor status distribution.
                  </p>
                </div>

                <FaUsers className="text-slate-400 text-xl" />

              </div>

            </div>

            <div className="p-6">

              <div className="space-y-1">

                {statusChart.map(
                  (item) => (
                    <StatusItem
                      key={item.status}
                      label={
                        item.name ||
                        getStatusLabel(
                          item.status
                        )
                      }
                      value={item.value}
                      color={
                        item.status ===
                        "PENDING"
                          ? "bg-yellow-500"
                          : item.status ===
                            "APPROVED"
                          ? "bg-green-500"
                          : item.status ===
                            "CHECKED_IN"
                          ? "bg-blue-500"
                          : item.status ===
                            "CHECKED_OUT"
                          ? "bg-purple-500"
                          : "bg-red-500"
                      }
                    />
                  )
                )}

              </div>

              {/* Total */}
              <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-100">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-500">
                    Total Visitors
                  </span>

                  <span className="text-2xl font-bold text-slate-800">
                    {stats.total.toLocaleString()}
                  </span>

                </div>

              </div>

            </div>
          </div>

          {/* QUICK ACTIONS */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

            <div className="p-6 border-b border-slate-100">

              <h2 className="text-xl font-bold text-slate-800">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Frequently used visitor management actions.
              </p>

            </div>

            <div className="p-6 space-y-3">

              <button
                onClick={() =>
                  navigate("/visitors/create")
                }
                className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <FaUserPlus />
                  Create Visitor
                </span>

                <FaArrowRight />
              </button>

              <button
                onClick={() =>
                  navigate("/visitors")
                }
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <FaUsers />
                  View All Visitors
                </span>

                <FaArrowRight />
              </button>

              <button
                onClick={() =>
                  navigate("/visitors?status=PENDING")
                }
                className="w-full flex items-center justify-between p-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 text-yellow-700 transition"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <FaClock />
                  Pending Visitors
                </span>

                <FaArrowRight />
              </button>

              <button
                onClick={() =>
                  navigate("/reports")
                }
                className="w-full flex items-center justify-between p-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <FaSignOutAlt />
                  View Reports
                </span>

                <FaArrowRight />
              </button>

            </div>

          </div>

        </div>

        {/* ==================================================
            RECENT VISITORS
        ================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="p-6 border-b border-slate-100">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Recent Visitors
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest visitors registered in the system.
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/visitors")
                }
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All
                <FaArrowRight />
              </button>

            </div>

          </div>

          <div className="overflow-x-auto">

            {recentVisitors.length === 0 ? (

              <div className="py-16 text-center">

                <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                  <FaUsers className="text-slate-400 text-xl" />
                </div>

                <h3 className="mt-4 font-semibold text-slate-700">
                  No visitors found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Visitors will appear here after registration.
                </p>

              </div>

            ) : (

              <table className="w-full min-w-[850px]">

                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Visitor
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Company
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Purpose
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Created
                    </th>

                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {recentVisitors.map(
                    (visitor) => (
                      <tr
                        key={visitor.id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* Visitor */}

                        <td className="px-6 py-4">

                          <div>
                            <p className="font-semibold text-slate-800">
                              {visitor.fullName}
                            </p>

                            {visitor.email && (
                              <p className="text-sm text-slate-500 mt-0.5">
                                {visitor.email}
                              </p>
                            )}

                            {visitor.phone && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                {visitor.phone}
                              </p>
                            )}
                          </div>

                        </td>

                        {/* Company */}

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {visitor.company ||
                            "-"}
                        </td>

                        {/* Purpose */}

                        <td className="px-6 py-4 text-sm text-slate-600 max-w-[220px]">
                          <span className="line-clamp-2">
                            {visitor.purpose ||
                              "-"}
                          </span>
                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                              visitor.status
                            )}`}
                          >
                            {getStatusLabel(
                              visitor.status
                            )}
                          </span>

                        </td>

                        {/* Created */}

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(
                            visitor.createdAt
                          )}
                        </td>

                        {/* Action */}

                        <td className="px-6 py-4 text-right">

                          <button
                            onClick={() =>
                              navigate(
                                `/visitors/${visitor.id}`
                              )
                            }
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                          >
                            View
                            <FaArrowRight />
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            )}

          </div>
        </div>

        {/* ==================================================
            FOOTER SUMMARY
        ================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FaUsers className="text-blue-600" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Total
                </p>

                <p className="font-bold text-slate-800">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <FaClock className="text-yellow-600" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Awaiting Approval
                </p>

                <p className="font-bold text-slate-800">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <FaCheckCircle className="text-green-600" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Approved
                </p>

                <p className="font-bold text-slate-800">
                  {stats.approved}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default Dashboard;