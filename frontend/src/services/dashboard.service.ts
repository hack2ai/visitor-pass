import * as dashboardApi from "../api/dashboard.api";

/**
 * ==========================================================
 * COMPLETE DASHBOARD
 * ==========================================================
 */
export const getDashboardAnalytics = () =>
  dashboardApi.getDashboardAnalytics();

/**
 * ==========================================================
 * DASHBOARD STATISTICS
 * ==========================================================
 */
export const getDashboardStats = () =>
  dashboardApi.getDashboardStats();

/**
 * ==========================================================
 * WEEKLY VISITORS
 * ==========================================================
 */
export const getWeeklyVisitors = () =>
  dashboardApi.getWeeklyVisitors();

/**
 * ==========================================================
 * STATUS CHART
 * ==========================================================
 */
export const getStatusChart = () =>
  dashboardApi.getStatusChart();

/**
 * ==========================================================
 * RECENT VISITORS
 * ==========================================================
 */
export const getRecentVisitors = () =>
  dashboardApi.getRecentVisitors();

/**
 * ==========================================================
 * ACTIVITY TIMELINE
 * ==========================================================
 */
export const getActivityTimeline = () =>
  dashboardApi.getActivityTimeline();