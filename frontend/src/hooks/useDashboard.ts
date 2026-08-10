import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

// ============================================================
// TYPES
// ============================================================

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  checkedIn: number;
  checkedOut: number;
}

export interface WeeklyVisitor {
  day: string;
  date?: string;
  visitors: number;
  count?: number;
}

export interface StatusChartItem {
  status: string;
  name?: string;
  value: number;
}

export interface RecentVisitor {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  purpose?: string | null;
  status: string;
  createdAt: string;
  host?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  } | null;
}

export interface Activity {
  id: string;
  type?: string;
  action?: string;
  message?: string;
  description?: string;
  createdAt: string;
  visitorId?: string;
  visitorName?: string;
}

export interface UseDashboardReturn {
  loading: boolean;
  error: string | null;

  stats: DashboardStats;

  weeklyVisitors: WeeklyVisitor[];

  statusChart: StatusChartItem[];

  recentVisitors: RecentVisitor[];

  activities: Activity[];

  fetchDashboardStats: () => Promise<void>;

  refreshDashboard: () => Promise<void>;
}

// ============================================================
// DEFAULT VALUES
// ============================================================

const defaultStats: DashboardStats = {
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  checkedIn: 0,
  checkedOut: 0,
};

const defaultWeeklyVisitors: WeeklyVisitor[] = [
  {
    day: "Mon",
    visitors: 0,
  },
  {
    day: "Tue",
    visitors: 0,
  },
  {
    day: "Wed",
    visitors: 0,
  },
  {
    day: "Thu",
    visitors: 0,
  },
  {
    day: "Fri",
    visitors: 0,
  },
  {
    day: "Sat",
    visitors: 0,
  },
  {
    day: "Sun",
    visitors: 0,
  },
];

const defaultStatusChart: StatusChartItem[] = [
  {
    status: "PENDING",
    name: "Pending",
    value: 0,
  },
  {
    status: "APPROVED",
    name: "Approved",
    value: 0,
  },
  {
    status: "CHECKED_IN",
    name: "Checked In",
    value: 0,
  },
  {
    status: "CHECKED_OUT",
    name: "Checked Out",
    value: 0,
  },
  {
    status: "REJECTED",
    name: "Rejected",
    value: 0,
  },
];

// ============================================================
// HELPERS
// ============================================================

const getErrorMessage = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            error?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }

    if (response?.data?.error) {
      return response.data.error;
    }

    if (response?.status === 401) {
      return "Your session has expired. Please login again.";
    }

    if (response?.status === 403) {
      return "You do not have permission to view the dashboard.";
    }

    if (response?.status === 404) {
      return "Dashboard statistics endpoint was not found.";
    }

    if (
      response?.status &&
      response.status >= 500
    ) {
      return "The server encountered an error while loading the dashboard.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to load dashboard data.";
};

// ============================================================
// NORMALIZE STATS
// ============================================================

const normalizeStats = (
  data: Partial<DashboardStats> | null | undefined
): DashboardStats => {
  return {
    total: Number(data?.total ?? 0),
    pending: Number(data?.pending ?? 0),
    approved: Number(data?.approved ?? 0),
    rejected: Number(data?.rejected ?? 0),
    checkedIn: Number(data?.checkedIn ?? 0),
    checkedOut: Number(data?.checkedOut ?? 0),
  };
};

// ============================================================
// NORMALIZE VISITORS
// ============================================================

const normalizeRecentVisitors = (
  data: unknown
): RecentVisitor[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((visitor): RecentVisitor => {
    const item = visitor as Partial<RecentVisitor>;

    return {
      id: String(item.id ?? ""),
      fullName: String(item.fullName ?? ""),
      email: item.email ?? null,
      phone: item.phone ?? null,
      company: item.company ?? null,
      purpose: item.purpose ?? null,
      status: String(item.status ?? ""),
      createdAt: String(item.createdAt ?? ""),
      host: item.host ?? null,
    };
  });
};

// ============================================================
// HOOK
// ============================================================

const useDashboard = (): UseDashboardReturn => {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(
    null
  );

  const [stats, setStats] =
    useState<DashboardStats>(defaultStats);

  const [weeklyVisitors, setWeeklyVisitors] =
    useState<WeeklyVisitor[]>(
      defaultWeeklyVisitors
    );

  const [statusChart, setStatusChart] =
    useState<StatusChartItem[]>(
      defaultStatusChart
    );

  const [recentVisitors, setRecentVisitors] =
    useState<RecentVisitor[]>([]);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  // ==========================================================
  // FETCH DASHBOARD DATA
  // ==========================================================

  const fetchDashboardStats =
    useCallback(async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        // ------------------------------------------------------
        // DASHBOARD STATS
        // ------------------------------------------------------
        //
        // IMPORTANT:
        // Dashboard statistics are provided by:
        //
        // GET /api/dashboard/stats
        //
        // NOT:
        //
        // GET /api/visitors/stats
        //
        // ------------------------------------------------------

        const statsResponse = await api.get(
          "/dashboard/stats"
        );

        const statsData =
          statsResponse?.data?.data ??
          statsResponse?.data ??
          {};

        const normalizedStats =
          normalizeStats(statsData);

        setStats(normalizedStats);

        // ------------------------------------------------------
        // STATUS CHART
        // ------------------------------------------------------

        setStatusChart([
          {
            status: "PENDING",
            name: "Pending",
            value: normalizedStats.pending,
          },
          {
            status: "APPROVED",
            name: "Approved",
            value: normalizedStats.approved,
          },
          {
            status: "CHECKED_IN",
            name: "Checked In",
            value: normalizedStats.checkedIn,
          },
          {
            status: "CHECKED_OUT",
            name: "Checked Out",
            value: normalizedStats.checkedOut,
          },
          {
            status: "REJECTED",
            name: "Rejected",
            value: normalizedStats.rejected,
          },
        ]);

        // ------------------------------------------------------
        // RECENT VISITORS
        // ------------------------------------------------------

        try {
          const visitorsResponse =
            await api.get("/visitors", {
              params: {
                page: 1,
                limit: 5,
              },
            });

          const visitorsData =
            visitorsResponse?.data?.data;

          setRecentVisitors(
            normalizeRecentVisitors(
              visitorsData
            )
          );
        } catch (visitorError) {
          console.warn(
            "Failed to load recent visitors:",
            visitorError
          );

          // Recent visitors are supplementary.
          // Do not fail the entire dashboard if this
          // request fails.
          setRecentVisitors([]);
        }

        // ------------------------------------------------------
        // WEEKLY VISITORS
        // ------------------------------------------------------
        //
        // We are not calling an unconfirmed endpoint here.
        // Keep the chart safe until the backend weekly
        // endpoint is wired to the frontend.
        // ------------------------------------------------------

        setWeeklyVisitors(
          defaultWeeklyVisitors.map(
            (item) => ({
              ...item,
            })
          )
        );

        // ------------------------------------------------------
        // ACTIVITIES
        // ------------------------------------------------------
        //
        // Keep empty until a confirmed activity endpoint
        // is available.
        // ------------------------------------------------------

        setActivities([]);
      } catch (dashboardError: unknown) {
        console.error(
          "DASHBOARD LOAD ERROR:",
          dashboardError
        );

        const message =
          getErrorMessage(
            dashboardError
          );

        setError(message);

        setStats(defaultStats);

        setWeeklyVisitors(
          defaultWeeklyVisitors
        );

        setStatusChart(
          defaultStatusChart
        );

        setRecentVisitors([]);

        setActivities([]);
      } finally {
        setLoading(false);
      }
    }, []);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    void fetchDashboardStats();
  }, [fetchDashboardStats]);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const refreshDashboard =
    useCallback(async (): Promise<void> => {
      await fetchDashboardStats();
    }, [fetchDashboardStats]);

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    loading,
    error,

    stats,

    weeklyVisitors,

    statusChart,

    recentVisitors,

    activities,

    fetchDashboardStats,

    refreshDashboard,
  };
};

export default useDashboard;