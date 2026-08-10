import { Search, RotateCcw } from "lucide-react";

interface ReportsFiltersProps {
  search: string;
  status: string;
  company: string;
  fromDate: string;
  toDate: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onReset: () => void;
}

const ReportsFilters = ({
  search,
  status,
  company,
  fromDate,
  toDate,
  onSearchChange,
  onStatusChange,
  onCompanyChange,
  onFromDateChange,
  onToDateChange,
  onReset,
}: ReportsFiltersProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Filters
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Filter visitor reports by different criteria.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search visitor..."
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              py-3
              pl-11
              pr-4
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value)
          }
          className="
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            outline-none
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500
          "
        >
          <option value="">
            All Status
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="APPROVED">
            Approved
          </option>

          <option value="CHECKED_IN">
            Checked In
          </option>

          <option value="CHECKED_OUT">
            Checked Out
          </option>
        </select>

        {/* Company */}

        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) =>
            onCompanyChange(e.target.value)
          }
          className="
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500
          "
        />

        {/* From */}

        <input
          type="date"
          value={fromDate}
          onChange={(e) =>
            onFromDateChange(e.target.value)
          }
          className="
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500
          "
        />

        {/* To */}

        <input
          type="date"
          value={toDate}
          onChange={(e) =>
            onToDateChange(e.target.value)
          }
          className="
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500
          "
        />

      </div>

      {/* Actions */}

      <div className="mt-6 flex justify-end">

        <button
          type="button"
          onClick={onReset}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-slate-700
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:bg-slate-800
          "
        >
          <RotateCcw size={18} />

          Reset Filters
        </button>

      </div>

    </div>
  );
};

export default ReportsFilters;