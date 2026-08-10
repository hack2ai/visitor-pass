import { Request, Response } from "express";
import * as reportsService from "../services/reports.service";

/* ==========================================================
   TYPES
   ========================================================== */

interface ReportFilters {
  search?: string;
  status?: string;
  company?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

/* ==========================================================
   HELPER: BUILD FILTERS FROM QUERY
   ========================================================== */

const getFilters = (
  req: Request
): ReportFilters => {
  const {
    search,
    status,
    company,
    from,
    to,
    page,
    limit,
  } = req.query;

  return {
    search:
      typeof search === "string"
        ? search
        : undefined,

    status:
      typeof status === "string"
        ? status
        : undefined,

    company:
      typeof company === "string"
        ? company
        : undefined,

    from:
      typeof from === "string"
        ? from
        : undefined,

    to:
      typeof to === "string"
        ? to
        : undefined,

    page:
      typeof page === "string"
        ? Number(page) || 1
        : 1,

    limit:
      typeof limit === "string"
        ? Number(limit) || 10
        : 10,
  };
};

/* ==========================================================
   GET REPORTS
   GET /api/reports
   ========================================================== */

export const getReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const filters = getFilters(req);

    const result =
      await reportsService.getReports(
        filters
      );

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "GET REPORTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch reports.",
    });
  }
};

/* ==========================================================
   REPORT SUMMARY
   GET /api/reports/summary
   ========================================================== */

export const getReportsSummary = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const summary =
      await reportsService.getReportsSummary();

    res.status(200).json({
      success: true,
      message:
        "Report summary fetched successfully.",
      data: summary,
    });
  } catch (error) {
    console.error(
      "REPORT SUMMARY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch report summary.",
    });
  }
};

/* ==========================================================
   REPORT ANALYTICS
   GET /api/reports/analytics
   ========================================================== */

export const getReportsAnalytics = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await reportsService.getReportsAnalytics();

    res.status(200).json({
      success: true,
      message:
        "Analytics fetched successfully.",
      data: analytics,
    });
  } catch (error) {
    console.error(
      "REPORT ANALYTICS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch analytics.",
    });
  }
};

/* ==========================================================
   EXPORT EXCEL
   GET /api/reports/export/excel
   ========================================================== */

export const exportReportsExcel =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const filters =
        getFilters(req);

      console.log(
        "EXCEL EXPORT FILTERS:",
        filters
      );

      const workbook =
        await reportsService.exportReportsToExcel(
          filters
        );

      const filename =
        `Visitor_Report_${Date.now()}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      await workbook.xlsx.write(res);

      res.end();
    } catch (error) {
      console.error(
        "EXPORT EXCEL ERROR:",
        error
      );

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message:
            "Failed to export Excel report.",
        });
      }
    }
  };

/* ==========================================================
   EXPORT PDF
   GET /api/reports/export/pdf
   ========================================================== */

export const exportReportsPDF =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const filters =
        getFilters(req);

      console.log(
        "PDF EXPORT FILTERS:",
        filters
      );

      const pdf =
        await reportsService.exportReportsToPDF(
          filters
        );

      const filename =
        `Visitor_Report_${Date.now()}.pdf`;

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      res.setHeader(
        "Content-Length",
        pdf.length
      );

      res.end(pdf);
    } catch (error) {
      console.error(
        "EXPORT PDF ERROR:",
        error
      );

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message:
            "Failed to export PDF report.",
        });
      }
    }
  };

/* ==========================================================
   PRINT REPORT
   GET /api/reports/print
   ========================================================== */

export const printReports =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const filters =
        getFilters(req);

      console.log(
        "PRINT REPORT FILTERS:",
        filters
      );

      const result =
        await reportsService.getReports({
          ...filters,
          page: 1,
          limit: 10000,
        });

      res.status(200).json({
        success: true,
        message:
          "Print report data fetched successfully.",
        data: result.data ?? [],
        summary: result.summary ?? null,
      });
    } catch (error) {
      console.error(
        "PRINT REPORT ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to prepare print report.",
      });
    }
  };