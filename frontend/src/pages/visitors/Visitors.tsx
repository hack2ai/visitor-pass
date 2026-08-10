import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";

import MainLayout from "../../components/layout/MainLayout";
import VisitorTable from "../../components/visitors/VisitorTable";

import { getVisitors } from "../../services/visitor.service";

import type { Visitor } from "../../types/visitor";

const Visitors = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [visitors, setVisitors] = useState<Visitor[]>([]);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");

  const loadVisitors = useCallback(async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getVisitors();

      if (
        response?.success &&
        Array.isArray(response.data)
      ) {
        setVisitors(response.data);
      } else {
        setVisitors([]);
      }
    } catch (err) {
      console.error(err);

      setError("Failed to load visitors.");

      setVisitors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVisitors();
  }, [loadVisitors]);

  const filteredVisitors = useMemo(() => {
    return visitors.filter((visitor) => {
      const value = search.toLowerCase();

      return (
        visitor.fullName
          ?.toLowerCase()
          .includes(value) ||

        visitor.phone
          ?.toLowerCase()
          .includes(value) ||

        visitor.company
          ?.toLowerCase()
          .includes(value) ||

        visitor.hostName
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [search, visitors]);

  return (
    <MainLayout>
      <div className="space-y-8">

        {/* Header */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              Visitors
            </h1>

            <p className="mt-2 text-slate-500">
              Manage visitor registrations,
              approvals and check-ins.
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={() => void loadVisitors()}
              className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              shadow-sm
              hover:bg-slate-50
            "
            >
              <FaSyncAlt />

              Refresh
            </button>

            <button
              onClick={() =>
                navigate("/visitors/create")
              }
              className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-3
              text-white
              shadow
              hover:bg-blue-700
            "
            >
              <FaPlus />

              Add Visitor
            </button>

          </div>

        </div>

        {/* Search */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:w-[420px]">

              <FaSearch
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
              />

              <input
                type="text"
                value={search}
                placeholder="Search visitor, company, phone..."
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                w-full
                rounded-xl
                border
                border-slate-200
                py-3
                pl-11
                pr-4
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
              "
              />

            </div>

            <div className="rounded-xl bg-blue-50 px-5 py-3">

              <p className="text-sm text-slate-500">
                Total Visitors
              </p>

              <h2 className="text-2xl font-bold text-blue-700">
                {filteredVisitors.length}
              </h2>

            </div>

          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="rounded-xl bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

            Loading Visitors...

          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          filteredVisitors.length === 0 && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <h2 className="text-2xl font-bold">
                No Visitors Found
              </h2>

              <p className="mt-3 text-slate-500">
                Create your first visitor to get started.
              </p>

            </div>
          )}

        {/* Table */}

        {!loading &&
          filteredVisitors.length > 0 && (
            <VisitorTable
              visitors={filteredVisitors}
            />
          )}

      </div>
    </MainLayout>
  );
};

export default Visitors;