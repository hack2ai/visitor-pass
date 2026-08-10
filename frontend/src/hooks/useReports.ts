import { useCallback, useEffect, useState } from "react";

import {
  getReports,
  type ReportFilters,
  type ReportVisitor,
  type Pagination,
  type ReportsSummary,
} from "../api/reports.api";

// ============================================================
// TYPES
// ============================================================

interface UseReportsState {
  visitors: ReportVisitor[];
  summary: ReportsSummary | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

interface UseReportsReturn extends UseReportsState {
  fetchReports: (
    filters?: ReportFilters
  ) => Promise<void>;

  refresh: () => Promise<void>;
}

// ============================================================
// HOOK
// ============================================================

const useReports = (
  initialFilters: ReportFilters = {}
): UseReportsReturn => {
  // ==========================================================
  // STATE
  // ==========================================================

  const [visitors, setVisitors] =
    useState<ReportVisitor[]>([]);

  const [summary, setSummary] =
    useState<ReportsSummary | null>(null);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  const [filters, setFilters] =
    useState<ReportFilters>(initialFilters);

  // ==========================================================
  // FETCH REPORTS
  // ==========================================================

  const fetchReports = useCallback(
    async (
      nextFilters?: ReportFilters
    ): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const activeFilters =
          nextFilters ?? filters;

        // Save filters when new filters are supplied
        if (nextFilters) {
          setFilters(nextFilters);
        }

        const response =
          await getReports(activeFilters);

        // ------------------------------------------------------
        // API ERROR
        // ------------------------------------------------------

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to fetch reports."
          );
        }

        // ------------------------------------------------------
        // VISITORS
        // ------------------------------------------------------

        setVisitors(
          Array.isArray(response.data)
            ? response.data
            : []
        );

        // ------------------------------------------------------
        // SUMMARY
        // ------------------------------------------------------

        setSummary(
          response.summary ?? null
        );

        // ------------------------------------------------------
        // PAGINATION
        // ------------------------------------------------------

        setPagination(
          response.pagination ?? null
        );
      } catch (error: unknown) {
        console.error(
          "Failed to fetch reports:",
          error
        );

        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch reports.";

        setError(message);

        setVisitors([]);

        setSummary(null);

        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    void fetchReports(initialFilters);

    // Initial reports request only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const refresh = useCallback(
    async (): Promise<void> => {
      await fetchReports(filters);
    },
    [fetchReports, filters]
  );

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    visitors,
    summary,
    pagination,
    loading,
    error,
    fetchReports,
    refresh,
  };
};

// ============================================================
// EXPORT
// ============================================================

export default useReports;