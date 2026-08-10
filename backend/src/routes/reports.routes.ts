import { Router } from "express";

import {
  getReports,
  exportReportsExcel,
  exportReportsPDF,
  printReports,
  getReportsSummary,
  getReportsAnalytics,
} from "../controllers/reports.controller";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

/**
 * ==========================================================
 * Reports Routes
 * Base URL: /api/reports
 * ==========================================================
 */

/**
 * ==========================================================
 * GET REPORTS
 * GET /api/reports
 * ==========================================================
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "EMPLOYEE", "SECURITY"),
  getReports
);

/**
 * ==========================================================
 * REPORT SUMMARY
 * GET /api/reports/summary
 * ==========================================================
 */
router.get(
  "/summary",
  authenticate,
  authorize("ADMIN", "EMPLOYEE", "SECURITY"),
  getReportsSummary
);

/**
 * ==========================================================
 * REPORT ANALYTICS
 * GET /api/reports/analytics
 * ==========================================================
 */
router.get(
  "/analytics",
  authenticate,
  authorize("ADMIN", "EMPLOYEE", "SECURITY"),
  getReportsAnalytics
);

/**
 * ==========================================================
 * EXPORT EXCEL
 * GET /api/reports/export/excel
 * ==========================================================
 */
router.get(
  "/export/excel",
  authenticate,
  authorize("ADMIN", "EMPLOYEE"),
  exportReportsExcel
);

/**
 * ==========================================================
 * EXPORT PDF
 * GET /api/reports/export/pdf
 * ==========================================================
 */
router.get(
  "/export/pdf",
  authenticate,
  authorize("ADMIN", "EMPLOYEE"),
  exportReportsPDF
);

/**
 * ==========================================================
 * PRINT REPORT
 * GET /api/reports/print
 * ==========================================================
 */
router.get(
  "/print",
  authenticate,
  authorize("ADMIN", "EMPLOYEE"),
  printReports
);

export default router;