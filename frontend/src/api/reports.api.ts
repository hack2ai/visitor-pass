import api from "./axios";

// ============================================================
// TYPES
// ============================================================

export interface ReportVisitor {
  id: string;

  fullName: string;

  email: string;

  phone: string | null;

  company: string;

  hostName: string;

  purpose: string;

  status: string;

  createdAt: string;
}

// ============================================================
// SUMMARY
// ============================================================

export interface ReportsSummary {
  totalVisitors: number;

  checkedIn: number;

  checkedOut: number;

  pending: number;
}

// ============================================================
// PAGINATION
// ============================================================

export interface Pagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

// ============================================================
// FILTERS
// ============================================================

export interface ReportFilters {
  search?: string;

  status?: string;

  company?: string;

  from?: string;

  to?: string;

  page?: number;

  limit?: number;
}

// ============================================================
// REPORTS RESPONSE
// ============================================================

export interface ReportsResponse {
  success: boolean;

  message: string;

  data: ReportVisitor[];

  summary: ReportsSummary;

  pagination: Pagination;
}

// ============================================================
// SUMMARY RESPONSE
// ============================================================

export interface ReportsSummaryResponse {
  success: boolean;

  message: string;

  data: ReportsSummary;
}

// ============================================================
// ANALYTICS
// ============================================================

export interface ReportsAnalyticsResponse {
  success: boolean;

  message: string;

  data: unknown;
}

// ============================================================
// GET REPORTS
// ============================================================

export const getReports = async (
  params?: ReportFilters
): Promise<ReportsResponse> => {
  const response = await api.get<ReportsResponse>(
    "/reports",
    {
      params,
    }
  );

  return response.data;
};

// ============================================================
// GET REPORT SUMMARY
// ============================================================

export const getReportsSummary =
  async (): Promise<ReportsSummaryResponse> => {
    const response =
      await api.get<ReportsSummaryResponse>(
        "/reports/summary"
      );

    return response.data;
  };

// ============================================================
// GET REPORT ANALYTICS
// ============================================================

export const getReportsAnalytics =
  async (): Promise<ReportsAnalyticsResponse> => {
    const response =
      await api.get<ReportsAnalyticsResponse>(
        "/reports/analytics"
      );

    return response.data;
  };

// ============================================================
// EXPORT EXCEL
// ============================================================

export const exportReportsExcel =
  async (
    params?: ReportFilters
  ): Promise<Blob> => {
    const response =
      await api.get<Blob>(
        "/reports/export/excel",
        {
          params,

          responseType: "blob",
        }
      );

    return response.data;
  };

// ============================================================
// EXPORT PDF
// ============================================================

export const exportReportsPDF =
  async (
    params?: ReportFilters
  ): Promise<Blob> => {
    const response =
      await api.get<Blob>(
        "/reports/export/pdf",
        {
          params,

          responseType: "blob",
        }
      );

    return response.data;
  };

// ============================================================
// PRINT REPORTS
// ============================================================

export const printReports = (): void => {
  window.print();
};