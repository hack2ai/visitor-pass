import * as reportsApi from "../api/reports.api";

import type { ReportFilters } from "../api/reports.api";

/**
 * ==========================================================
 * GET REPORTS
 * ==========================================================
 */

export const getReports = (
  params?: ReportFilters
) => {
  return reportsApi.getReports(params);
};

/**
 * ==========================================================
 * GET REPORT SUMMARY
 * ==========================================================
 */

export const getReportsSummary = () => {
  return reportsApi.getReportsSummary();
};

/**
 * ==========================================================
 * GET REPORT ANALYTICS
 * ==========================================================
 */

export const getReportsAnalytics = () => {
  return reportsApi.getReportsAnalytics();
};

/**
 * ==========================================================
 * EXPORT EXCEL
 * ==========================================================
 */

export const exportReportsExcel = (
  params?: ReportFilters
) => {
  return reportsApi.exportReportsExcel(params);
};

/**
 * ==========================================================
 * EXPORT PDF
 * ==========================================================
 */

export const exportReportsPDF = (
  params?: ReportFilters
) => {
  return reportsApi.exportReportsPDF(params);
};

/**
 * ==========================================================
 * PRINT REPORT
 * ==========================================================
 */
export const printReports = async (
  params?: ReportFilters
): Promise<void> => {
  void params;

  reportsApi.printReports();
};