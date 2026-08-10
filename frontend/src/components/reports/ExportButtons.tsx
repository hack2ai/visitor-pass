import {
  FileSpreadsheet,
  FileText,
  Printer,
  RefreshCcw,
} from "lucide-react";

interface ExportButtonsProps {
  loading?: boolean;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
  onRefresh: () => void;
}

const ExportButtons = ({
  loading = false,
  onExportExcel,
  onExportPDF,
  onPrint,
  onRefresh,
}: ExportButtonsProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">
          Export Reports
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Download or print visitor reports.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Excel */}

        <button
          type="button"
          disabled={loading}
          onClick={onExportExcel}
          className="
            flex
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-green-600
            px-5
            py-4
            font-medium
            text-white
            transition
            hover:bg-green-700
            disabled:opacity-60
          "
        >
          <FileSpreadsheet size={20} />

          Export Excel
        </button>

        {/* PDF */}

        <button
          type="button"
          disabled={loading}
          onClick={onExportPDF}
          className="
            flex
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-red-600
            px-5
            py-4
            font-medium
            text-white
            transition
            hover:bg-red-700
            disabled:opacity-60
          "
        >
          <FileText size={20} />

          Export PDF
        </button>

        {/* Print */}

        <button
          type="button"
          disabled={loading}
          onClick={onPrint}
          className="
            flex
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-blue-600
            px-5
            py-4
            font-medium
            text-white
            transition
            hover:bg-blue-700
            disabled:opacity-60
          "
        >
          <Printer size={20} />

          Print Report
        </button>

        {/* Refresh */}

        <button
          type="button"
          disabled={loading}
          onClick={onRefresh}
          className="
            flex
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-slate-700
            px-5
            py-4
            font-medium
            text-white
            transition
            hover:bg-slate-800
            disabled:opacity-60
          "
        >
          <RefreshCcw
            size={20}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>
    </div>
  );
};

export default ExportButtons;