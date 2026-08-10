import api from "./axios";

/**
 * ==========================================================
 * Types
 * ==========================================================
 */

export interface DashboardStats {
  totalVisitors: number;
  checkedIn: number;
  checkedOut: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface WeeklyVisitor {
  day: string;
  visitors: number;
}

export interface StatusData {
  name: string;
  value: number;
}

export interface RecentVisitor {
  id: string;
  fullName: string;
  email: string;
  company: string | null;
  purpose: string;
  status: string;
  createdAt: string;

  host: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  hostName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardAnalytics {
  stats: DashboardStats;
  weeklyVisitors: WeeklyVisitor[];
  statusChart: StatusData[];
  recentVisitors: RecentVisitor[];
  activityTimeline: ActivityItem[];
}

export interface DashboardApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * ==========================================================
 * COMPLETE DASHBOARD
 * GET /api/dashboard
 * ==========================================================
 */

export const getDashboardAnalytics = async (): Promise<
  DashboardApiResponse<DashboardAnalytics>
> => {
  const { data } = await api.get("/dashboard");
  return data;
};

/**
 * ==========================================================
 * DASHBOARD STATS
 * ==========================================================
 */

export const getDashboardStats = async (): Promise<
  DashboardApiResponse<DashboardStats>
> => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};

/**
 * ==========================================================
 * WEEKLY VISITORS
 * ==========================================================
 */

export const getWeeklyVisitors = async (): Promise<
  DashboardApiResponse<WeeklyVisitor[]>
> => {
  const { data } = await api.get("/dashboard/weekly");
  return data;
};

/**
 * ==========================================================
 * STATUS CHART
 * ==========================================================
 */

export const getStatusChart = async (): Promise<
  DashboardApiResponse<StatusData[]>
> => {
  const { data } = await api.get("/dashboard/status");
  return data;
};

/**
 * ==========================================================
 * RECENT VISITORS
 * ==========================================================
 */

export const getRecentVisitors = async (): Promise<
  DashboardApiResponse<RecentVisitor[]>
> => {
  const { data } = await api.get("/dashboard/recent");
  return data;
};

/**
 * ==========================================================
 * ACTIVITY TIMELINE
 * ==========================================================
 */

export const getActivityTimeline = async (): Promise<
  DashboardApiResponse<ActivityItem[]>
> => {
  const { data } = await api.get("/dashboard/activity");
  return data;
};