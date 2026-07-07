"use client";

import { useMemo } from "react";
import {
  FileSpreadsheet,
  X,
  ArrowLeft,
  Sparkles,
  Rows3,
  Columns3,
} from "lucide-react";

export default function PreviewStep({
  parsedData,
  fileName,
  fileSize,
  onConfirm,
  onBack,
}) {
  const { headers, rows, totalRows } = parsedData;

  // Show at most 100 rows in preview
  const previewRows = useMemo(() => rows.slice(0, 100), [rows]);

  const fileSizeFormatted = useMemo(() => {
    if (!fileSize) return "";
    if (fileSize < 1024) return `${fileSize} B`;
    if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
    return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
  }, [fileSize]);

  return (
    <div className="animate-slide-up">
      <div className="glass-card overflow-hidden">
        {/* File Info Header */}
        <div className="p-6 border-b border-gray-100 dark:border-surface-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {fileName || "Uploaded CSV"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {fileSizeFormatted}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Rows3 className="w-4 h-4" />
                <span>
                  {totalRows} row{totalRows !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Columns3 className="w-4 h-4" />
                <span>
                  {headers.length} column{headers.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Table Preview */}
        <div className="data-table-container m-0 rounded-none border-0 border-b border-gray-100 dark:border-surface-700">
          <table className="data-table">
            <thead>
              <tr>
                <th className="!pl-6 text-center w-12">#</th>
                {headers.map((header, i) => (
                  <th key={i}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="!pl-6 text-center text-gray-400 dark:text-gray-500 font-mono text-xs">
                    {rowIdx + 1}
                  </td>
                  {headers.map((header, colIdx) => (
                    <td key={colIdx} title={row[header] || ""}>
                      {row[header] || (
                        <span className="text-gray-300 dark:text-gray-600">
                          —
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Row Count Notice */}
        {totalRows > 100 && (
          <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/20">
            <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
              Showing 100 of {totalRows} rows. All rows will be processed by
              AI.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 flex items-center justify-between flex-wrap gap-4">
          <button onClick={onBack} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </button>

          <button onClick={onConfirm} className="btn-primary">
            <Sparkles className="w-4 h-4" />
            Confirm & Import with AI
          </button>
        </div>
      </div>
    </div>
  );
}
