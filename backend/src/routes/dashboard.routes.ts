import { Router } from "express";

import {
  getDashboardStats,
  getWeeklyVisitors,
  getStatusChart,
  getRecentVisitors,
  getActivityTimeline,
  getDashboardAnalytics,
} from "../controllers/dashboard.controller";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

/**
 * ==========================================================
 * Dashboard Routes
 * Base URL: /api/dashboard
 * ==========================================================
 */

/**
 * ==========================================================
 * COMPLETE DASHBOARD
 * GET /api/dashboard
 * ==========================================================
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "EMPLOYEE", "SECURITY"),
  getDashboardAnalytics
);

/**
 * ==========================================================
 * DASHBOARD STATS
 * GET /api/dashboard/stats
 * ==========================================================
 */
router.get(
  "/stats",
  authenticate,
  authorize("ADMIN", "EMPLOYEE", "SECURITY"),
  getDashboardStats
);

/**
 * ==========================================================
 * WEEKLY VISITORS
 * GET /api/dashboard/weekly
 * ==========================================================
 */
router.get(
  "/weekly",
  authenticate,
  authorize("ADMIN", "EMPLOYEE", "SECURITY"),
  getWeeklyVisitors
);

/**
 * ==========================================================
 * STATUS CHART
 * GET /api/dashboard/status
 * ==========================================================
 */
router.get(
  "/status",
  authenticate,
  authorize("ADMIN", "EMPLOYEE", "SECURITY"),
  getStatusChart
);

/**
 * ==========================================================
 * RECENT VISITORS
 * GET /api/dashboard/recent
 * ==========================================================
 */
router.get(
  "/recent",
  authenticate,
  authorize("ADMIN", "EMPLOYEE", "SECURITY"),
  getRecentVisitors
);

/**
 * ==========================================================
 * ACTIVITY TIMELINE
 * GET /api/dashboard/activity
 * ==========================================================
 */
router.get(
  "/activity",
  authenticate,
  authorize("ADMIN", "EMPLOYEE", "SECURITY"),
  getActivityTimeline
);

export default router;