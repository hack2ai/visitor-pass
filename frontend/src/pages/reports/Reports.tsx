import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import MainLayout from "../../components/layout/MainLayout";

import ReportsHeader from "../../components/reports/ReportsHeader";
import ReportsSummary from "../../components/reports/ReportsSummary";
import ReportsFilters from "../../components/reports/ReportsFilters";
import ReportsTable from "../../components/reports/ReportsTable";
import ExportButtons from "../../components/reports/ExportButtons";

import {
  getReports,
  exportReportsExcel,
  exportReportsPDF,
} from "../../services/reports.service";

import type {
  ReportVisitor,
  ReportFilters,
  ReportsResponse,
} from "../../api/reports.api";

// ============================================================
// TYPES
// ============================================================

interface Filters {
  search: string;
  status: string;
  company: string;
  from: string;
  to: string;
}

interface Summary {
  totalVisitors: number;
  checkedIn: number;
  checkedOut: number;
  pending: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type FilterKey = keyof Filters;

// ============================================================
// CONSTANTS
// ============================================================

const EMPTY_FILTERS: Filters = {
  search: "",
  status: "",
  company: "",
  from: "",
  to: "",
};

const EMPTY_SUMMARY: Summary = {
  totalVisitors: 0,
  checkedIn: 0,
  checkedOut: 0,
  pending: 0,
};

const DEBOUNCE_MS = 400;

// ============================================================
// REPORTS
// ============================================================

const Reports = () => {
  const [loading, setLoading] = useState(false);

  const [visitors, setVisitors] =
    useState<ReportVisitor[]>([]);

  const [summary, setSummary] =
    useState<Summary>(EMPTY_SUMMARY);

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [filters, setFilters] =
    useState<Filters>(EMPTY_FILTERS);

  const debounceRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  // ==========================================================
  // BUILD API FILTERS
  // ==========================================================

  const buildApiFilters = (
    currentFilters: Filters,
    currentPage: number
  ): ReportFilters => {
    return {
      search:
        currentFilters.search.trim() ||
        undefined,

      status:
        currentFilters.status ||
        undefined,

      company:
        currentFilters.company.trim() ||
        undefined,

      from:
        currentFilters.from ||
        undefined,

      to:
        currentFilters.to ||
        undefined,

      page: currentPage,

      limit: 10,
    };
  };

  // ==========================================================
  // LOAD REPORTS
  // ==========================================================

  const loadReports = useCallback(
    async (
      currentFilters: Filters,
      currentPage: number
    ) => {
      try {
        setLoading(true);

        const params =
          buildApiFilters(
            currentFilters,
            currentPage
          );

        const response =
          (await getReports(
            params
          )) as ReportsResponse;

        if (!response.success) {
          throw new Error(
            response.message ||
              "Failed to load reports."
          );
        }

        setVisitors(
          Array.isArray(response.data)
            ? response.data
            : []
        );

        setSummary(
          response.summary ??
            EMPTY_SUMMARY
        );

        setPagination(
          response.pagination ??
            null
        );
      } catch (error) {
        console.error(
          "LOAD REPORTS ERROR:",
          error
        );

        setVisitors([]);

        setSummary(
          EMPTY_SUMMARY
        );

        setPagination(null);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load reports."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================================
  // LOAD ON FILTER/PAGE CHANGE
  // ==========================================================

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(
        debounceRef.current
      );
    }

    debounceRef.current =
      setTimeout(() => {
        void loadReports(
          filters,
          page
        );
      }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(
          debounceRef.current
        );

        debounceRef.current = null;
      }
    };
  }, [
    filters,
    page,
    loadReports,
  ]);

  // ==========================================================
  // UPDATE FILTER
  // ==========================================================

  const updateFilter = (
    key: FilterKey,
    value: string
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));

    setPage(1);
  };

  // ==========================================================
  // RESET
  // ==========================================================

  const handleReset = () => {
    setFilters({
      ...EMPTY_FILTERS,
    });

    setPage(1);
  };

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const handlePageChange = (
    nextPage: number
  ) => {
    if (nextPage < 1) {
      return;
    }

    if (
      pagination &&
      nextPage >
        pagination.totalPages
    ) {
      return;
    }

    setPage(nextPage);
  };

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async () => {
    try {
      await loadReports(
        filters,
        page
      );

      toast.success(
        "Reports refreshed successfully."
      );
    } catch (error) {
      console.error(
        "REFRESH ERROR:",
        error
      );

      toast.error(
        "Failed to refresh reports."
      );
    }
  };

  // ==========================================================
  // DOWNLOAD BLOB
  // ==========================================================

  const downloadBlob = (
    blob: Blob,
    filename: string
  ) => {
    if (!(blob instanceof Blob)) {
      throw new Error(
        "Invalid file received from server."
      );
    }

    if (blob.size === 0) {
      throw new Error(
        "Downloaded file is empty."
      );
    }

    const url =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => {
      window.URL.revokeObjectURL(
        url
      );
    }, 100);
  };

  // ==========================================================
  // EXCEL
  // ==========================================================

  const handleExportExcel =
    async () => {
      try {
        const blob =
          await exportReportsExcel(
            buildApiFilters(
              filters,
              page
            )
          );

        downloadBlob(
          blob,
          `Visitor_Report_${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx`
        );

        toast.success(
          "Excel report downloaded successfully."
        );
      } catch (error) {
        console.error(
          "EXCEL EXPORT ERROR:",
          error
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Excel export failed."
        );
      }
    };

  // ==========================================================
  // PDF
  // ==========================================================

  const handleExportPDF =
    async () => {
      try {
        const blob =
          await exportReportsPDF(
            buildApiFilters(
              filters,
              page
            )
          );

        downloadBlob(
          blob,
          `Visitor_Report_${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`
        );

        toast.success(
          "PDF report downloaded successfully."
        );
      } catch (error) {
        console.error(
          "PDF EXPORT ERROR:",
          error
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "PDF export failed."
        );
      }
    };

  // ==========================================================
  // TABLE DOWNLOAD
  // ==========================================================

  const handleVisitorDownload = (
    visitor: ReportVisitor
  ) => {
    if (!visitor.id) {
      toast.error(
        "Visitor ID is missing."
      );
      return;
    }

    /*
     * Backend visitor-pass endpoint.
     *
     * The axios instance already handles
     * authentication.
     */

    const baseURL =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    const url =
      `${baseURL}/visitors/${visitor.id}/pass`;

    const link =
      document.createElement("a");

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  // ==========================================================
  // TABLE PRINT
  // ==========================================================

  const handleVisitorPrint = (
    visitor: ReportVisitor
  ) => {
    console.log(
      "Printing visitor:",
      visitor.id
    );

    /*
     * Print the current report page.
     *
     * CSS @media print can be added later
     * to hide navigation/buttons.
     */

    window.print();
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <MainLayout>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="mx-auto max-w-7xl space-y-8"
      >
        {/* HEADER */}

        <ReportsHeader />

        {/* SUMMARY */}

        <ReportsSummary
          summary={summary}
          loading={loading}
        />

        {/* FILTERS */}

        <ReportsFilters
          search={filters.search}
          status={filters.status}
          company={filters.company}
          fromDate={filters.from}
          toDate={filters.to}
          onSearchChange={(value) =>
            updateFilter(
              "search",
              value
            )
          }
          onStatusChange={(value) =>
            updateFilter(
              "status",
              value
            )
          }
          onCompanyChange={(value) =>
            updateFilter(
              "company",
              value
            )
          }
          onFromDateChange={(value) =>
            updateFilter(
              "from",
              value
            )
          }
          onToDateChange={(value) =>
            updateFilter(
              "to",
              value
            )
          }
          onReset={handleReset}
        />

        {/* EXPORT BUTTONS */}

        <ExportButtons
          loading={loading}
          onExportExcel={
            handleExportExcel
          }
          onExportPDF={
            handleExportPDF
          }
          onPrint={window.print}
          onRefresh={
            handleRefresh
          }
        />

        {/* REPORT TABLE */}

        <ReportsTable
          visitors={visitors}
          loading={loading}
          page={page}
          pagination={pagination}
          onPageChange={
            handlePageChange
          }
          onDownload={
            handleVisitorDownload
          }
          onPrint={
            handleVisitorPrint
          }
        />
      </motion.div>
    </MainLayout>
  );
};

export default Reports;