"use client";

import { useMemo, useCallback, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Download,
  ChevronDown,
  ChevronUp,
  Users,
  UserX,
  FileCheck2,
} from "lucide-react";

// CRM fields to display in the results table
const CRM_DISPLAY_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "country_code", label: "Code" },
  { key: "mobile_without_country_code", label: "Mobile" },
  { key: "company", label: "Company" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "lead_owner", label: "Lead Owner" },
  { key: "crm_status", label: "Status" },
  { key: "crm_note", label: "Notes" },
  { key: "data_source", label: "Source" },
  { key: "created_at", label: "Created At" },
];

// Status badge colors
const STATUS_COLORS = {
  GOOD_LEAD_FOLLOW_UP: "badge-success",
  DID_NOT_CONNECT: "badge-warning",
  BAD_LEAD: "badge-error",
  SALE_DONE: "badge-info",
};

// Human-readable status labels
const STATUS_LABELS = {
  GOOD_LEAD_FOLLOW_UP: "Good Lead",
  DID_NOT_CONNECT: "Not Connected",
  BAD_LEAD: "Bad Lead",
  SALE_DONE: "Sale Done",
};

export default function ResultsStep({ results, onReset }) {
  const [showSkipped, setShowSkipped] = useState(false);

  const { records, skipped, summary } = results;

  // Generate CSV for download
  const handleDownloadCSV = useCallback(() => {
    if (!records || records.length === 0) return;

    const allFields = [
      "created_at",
      "name",
      "email",
      "country_code",
      "mobile_without_country_code",
      "company",
      "city",
      "state",
      "country",
      "lead_owner",
      "crm_status",
      "crm_note",
      "data_source",
      "possession_time",
      "description",
    ];

    const header = allFields.join(",");
    const rows = records.map((record) => {
      return allFields
        .map((field) => {
          const value = record[field] || "";
          // Escape CSV values containing commas, quotes, or newlines
          if (
            value.includes(",") ||
            value.includes('"') ||
            value.includes("\n")
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",");
    });

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `groweasy_crm_import_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [records]);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3">
            <FileCheck2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {summary.totalProcessed}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total Processed
          </span>
        </div>

        <div className="stat-card">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {summary.totalImported}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Successfully Imported
          </span>
        </div>

        <div className="stat-card">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-3">
            <UserX className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {summary.totalSkipped}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Skipped Records
          </span>
        </div>
      </div>

      {/* Imported Records Table */}
      {records.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-surface-700 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Imported Records
              </h3>
              <span className="badge-success">{records.length}</span>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="data-table-container m-0 rounded-none border-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="!pl-5 text-center w-12">#</th>
                  {CRM_DISPLAY_FIELDS.map((field) => (
                    <th key={field.key}>{field.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record, idx) => (
                  <tr key={idx}>
                    <td className="!pl-5 text-center text-gray-400 dark:text-gray-500 font-mono text-xs">
                      {idx + 1}
                    </td>
                    {CRM_DISPLAY_FIELDS.map((field) => (
                      <td key={field.key} title={record[field.key] || ""}>
                        {field.key === "crm_status" && record[field.key] ? (
                          <span
                            className={
                              STATUS_COLORS[record[field.key]] || "badge-neutral"
                            }
                          >
                            {STATUS_LABELS[record[field.key]] ||
                              record[field.key]}
                          </span>
                        ) : (
                          record[field.key] || (
                            <span className="text-gray-300 dark:text-gray-600">
                              —
                            </span>
                          )
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skipped Records */}
      {skipped.length > 0 && (
        <div className="glass-card overflow-hidden">
          <button
            onClick={() => setShowSkipped(!showSkipped)}
            className="w-full p-5 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Skipped Records
              </h3>
              <span className="badge-warning">{skipped.length}</span>
            </div>
            {showSkipped ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {showSkipped && (
            <div className="border-t border-gray-100 dark:border-surface-700">
              <div className="data-table-container m-0 rounded-none border-0 max-h-[320px]">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="!pl-5 w-16">Row</th>
                      <th>Reason</th>
                      <th>Original Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skipped.map((item, idx) => (
                      <tr key={idx}>
                        <td className="!pl-5 font-mono text-xs text-gray-400">
                          {item.rowIndex || idx + 1}
                        </td>
                        <td>
                          <span className="badge-error text-xs">
                            {item.reason}
                          </span>
                        </td>
                        <td className="max-w-[400px]">
                          <code className="text-xs text-gray-500 dark:text-gray-400 break-all">
                            {JSON.stringify(item.originalData).slice(0, 200)}
                            {JSON.stringify(item.originalData).length > 200
                              ? "..."
                              : ""}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center pt-4">
        <button onClick={onReset} className="btn-secondary">
          <RotateCcw className="w-4 h-4" />
          Import Another File
        </button>
      </div>
    </div>
  );
}
