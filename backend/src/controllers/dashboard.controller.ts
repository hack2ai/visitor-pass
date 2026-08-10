import { Request, Response, NextFunction } from "express";

import * as dashboardService from "../services/dashboard.service";

/**
 * ==========================================================
 * DASHBOARD STATS
 * GET /api/dashboard/stats
 * ==========================================================
 */
export const getDashboardStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats =
      await dashboardService.getDashboardStats();

    res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully.",
      data: stats,
    });
  } catch (error) {
    console.error("GET DASHBOARD STATS ERROR");
    console.error(error);

    next(error);
  }
};

/**
 * ==========================================================
 * WEEKLY VISITORS
 * GET /api/dashboard/weekly
 * ==========================================================
 */
export const getWeeklyVisitors = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const weeklyVisitors =
      await dashboardService.getWeeklyVisitors();

    res.status(200).json({
      success: true,
      message: "Weekly visitors fetched successfully.",
      data: weeklyVisitors,
    });
  } catch (error) {
    console.error("GET WEEKLY VISITORS ERROR");
    console.error(error);

    next(error);
  }
};

/**
 * ==========================================================
 * STATUS CHART
 * GET /api/dashboard/status
 * ==========================================================
 */
export const getStatusChart = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const statusChart =
      await dashboardService.getStatusChart();

    res.status(200).json({
      success: true,
      message: "Status chart fetched successfully.",
      data: statusChart,
    });
  } catch (error) {
    console.error("GET STATUS CHART ERROR");
    console.error(error);

    next(error);
  }
};

/**
 * ==========================================================
 * RECENT VISITORS
 * GET /api/dashboard/recent
 * ==========================================================
 */
export const getRecentVisitors = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recentVisitors =
      await dashboardService.getRecentVisitors();

    res.status(200).json({
      success: true,
      message: "Recent visitors fetched successfully.",
      data: recentVisitors,
    });
  } catch (error) {
    console.error("GET RECENT VISITORS ERROR");
    console.error(error);

    next(error);
  }
};

/**
 * ==========================================================
 * ACTIVITY TIMELINE
 * GET /api/dashboard/activity
 * ==========================================================
 */
export const getActivityTimeline = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const activity =
      await dashboardService.getActivityTimeline();

    res.status(200).json({
      success: true,
      message: "Activity timeline fetched successfully.",
      data: activity,
    });
  } catch (error) {
    console.error("GET ACTIVITY TIMELINE ERROR");
    console.error(error);

    next(error);
  }
};

/**
 * ==========================================================
 * COMPLETE DASHBOARD
 * GET /api/dashboard
 * ==========================================================
 */
export const getDashboardAnalytics = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dashboard =
      await dashboardService.getDashboardAnalytics();

    res.status(200).json({
      success: true,
      message: "Dashboard analytics fetched successfully.",
      data: dashboard,
    });
  } catch (error) {
    console.error("GET DASHBOARD ANALYTICS ERROR");
    console.error(error);

    next(error);
  }
};