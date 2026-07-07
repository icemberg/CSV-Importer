"use client";

import { useState, useCallback, useRef } from "react";
import Papa from "papaparse";
import {
  Upload,
  FileSpreadsheet,
  X,
  AlertCircle,
} from "lucide-react";
import { MAX_FILE_SIZE, SAMPLE_CSV } from "../lib/constants";

export default function UploadStep({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [, setDragCounter] = useState(0);
  const [fileError, setFileError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndParseFile = useCallback(
    (file) => {
      if (!file) {
        setIsProcessing(false);
        return;
      }

      console.log("Starting validation and parsing for file:", file.name);
      setFileError(null);
      setIsProcessing(true);

      // Validate file extension
      if (!file.name.toLowerCase().endsWith(".csv")) {
        setFileError("Please upload a CSV file (.csv extension).");
        setIsProcessing(false);
        return;
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        setFileError(
          `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
        );
        setIsProcessing(false);
        return;
      }

      // Parse CSV for preview
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log("PapaParse compilation results structural payload:", result);
          
          try {
            if (result.errors && result.errors.length > 0) {
              const criticalErrors = result.errors.filter(
                (e) => e.type !== "FieldMismatch"
              );
              
              if (criticalErrors.length > 0) {
                // FIXED: Explicitly grab index [0] to prevent .message array property crashes
                setFileError(`CSV parsing error: ${criticalErrors[0].message}`);
                setIsProcessing(false);
                return;
              }
            }

            if (!result.data || result.data.length === 0) {
              setFileError("CSV file is empty or contains no data rows.");
              setIsProcessing(false);
              return;
            }

            const headers = result.meta.fields || [];
            if (headers.length === 0) {
              setFileError("CSV file has no column headers.");
              setIsProcessing(false);
              return;
            }

            console.log("CSV parsed successfully! Advancing steps layout wrapper framework...");
            
            // Turn off loading animation right before running the parent state change
            setIsProcessing(false);
            
            // Fire the selection context payload
            onFileSelect(file, {
              headers,
              rows: result.data,
              totalRows: result.data.length,
            });

          } catch (internalHookError) {
            console.error("Crash within execution lifecycle runtime layout wrapper:", internalHookError);
            setFileError(`Application error during processing: ${internalHookError.message}`);
            setIsProcessing(false);
          }
        },
        error: (err) => {
          console.error("PapaParse library error level handler invocation instance:", err);
          setIsProcessing(false);
          setFileError(`Failed to parse CSV: ${err.message}`);
        },
      });
    },
    [onFileSelect]
  );

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const nextCounter = prev - 1;
      if (nextCounter === 0) {
        setIsDragging(false);
      }
      return nextCounter;
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

      let droppedFiles = [];
      if (e.dataTransfer.items) {
        droppedFiles = Array.from(e.dataTransfer.items)
          .filter((item) => item.kind === "file")
          .map((item) => item.getAsFile());
      } else if (e.dataTransfer.files) {
        droppedFiles = Array.from(e.dataTransfer.files);
      }

      // FIXED: Pass element [0] explicitly
      if (droppedFiles && droppedFiles.length > 0) {
        validateAndParseFile(droppedFiles[0]);
      }
    },
    [validateAndParseFile]
  );

  const handleFileInput = useCallback(
    (e) => {
      const files = e.target.files;
      // FIXED: Pass element [0] explicitly
      if (files && files.length > 0) {
        validateAndParseFile(files[0]);
      }
    },
    [validateAndParseFile]
  );

  const handleDownloadSample = useCallback(() => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "groweasy_sample_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }, []);

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="glass-card p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Import Leads via CSV
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Upload a CSV file to bulk import leads into your system.
          </p>
        </div>

        {/* Dropzone Container */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload CSV file. Click or drag and drop a file here."
          onDragEnter={handleDragEnter}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => {
            if (!isProcessing) fileInputRef.current?.click();
          }}
          onKeyDown={(e) => {
            if (!isProcessing && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`dropzone ${isDragging ? "dropzone-active" : ""} ${
            isProcessing ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
            id="csv-file-input"
          />

          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
              isDragging
                ? "bg-brand-100 dark:bg-brand-900/40 scale-110"
                : "bg-gray-100 dark:bg-surface-700"
            }`}
          >
            {isProcessing ? (
              <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload
                className={`w-8 h-8 transition-colors duration-300 ${
                  isDragging
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
            )}
          </div>

          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1 pointer-events-none">
            {isDragging ? "Release to upload" : "Drop your CSV file here"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 pointer-events-none">
            or click to browse files
          </p>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Supported file: .csv (max 10MB)</span>
          </div>
        </div>

        {/* Error Alert Display Box */}
        {fileError && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-center gap-2 animate-slide-down">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400 flex-1">
              {fileError}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFileError(null);
              }}
              className="ml-auto p-1 text-red-400 hover:text-red-600 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Requirements & Sample Download Container */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-surface-700">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-3">
            Required headers: created_at, name, email, country_code,
            mobile_without_country_code, company, city, state, country,
            lead_owner, crm_status, crm_note
          </p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadSample();
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-all"
            >
              Get Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
