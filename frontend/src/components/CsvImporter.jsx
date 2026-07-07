"use client";

import UploadStep from "./UploadStep";
import PreviewStep from "./PreviewStep";
import ProgressIndicator from "./ProgressIndicator";
import ResultsStep from "./ResultsStep";
import ThemeToggle from "./ThemeToggle";
import { useCsvImport } from "../hooks/useCsvImport";
import { STEPS } from "../lib/constants";
import {
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

export default function CsvImporter() {
  const {
    currentStep,
    currentIndex,
    file,
    parsedData,
    results,
    error,
    progress,
    setError,
    handleFileSelect,
    handleConfirmImport,
    handleReset,
    handleBack
  } = useCsvImport();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-50/30 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-surface-900/70 border-b border-gray-200/50 dark:border-surface-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/30">
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  GrowEasy
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">
                  CSV Importer
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentIndex;
            const isComplete = index < currentIndex;
            const isDisabled = index > currentIndex;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isComplete
                        ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                        : isActive
                          ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-4 ring-brand-100 dark:ring-brand-900/30"
                          : "bg-gray-100 dark:bg-surface-800 text-gray-400 dark:text-gray-600"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium hidden sm:block ${
                      isActive
                        ? "text-brand-600 dark:text-brand-400"
                        : isComplete
                          ? "text-gray-700 dark:text-gray-300"
                          : "text-gray-400 dark:text-gray-600"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-3 mt-0 sm:-mt-5">
                    <div className="h-0.5 bg-gray-200 dark:bg-surface-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-brand-600 rounded-full transition-all duration-500 ${
                          isComplete ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-3 animate-slide-down">
            <div className="w-5 h-5 text-red-500 mt-0.5 shrink-0">⚠️</div>
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                Import Error
              </p>
              <p className="text-sm text-red-600 dark:text-red-400/80 mt-1">
                {error}
              </p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600 dark:hover:text-red-300"
            >
              ✕
            </button>
          </div>
        )}

        {/* Steps */}
        {currentStep === "upload" && (
          <UploadStep onFileSelect={handleFileSelect} />
        )}

        {currentStep === "preview" && parsedData && (
          <PreviewStep
            parsedData={parsedData}
            fileName={file?.name}
            fileSize={file?.size}
            onConfirm={handleConfirmImport}
            onBack={handleBack}
          />
        )}

        {currentStep === "process" && (
          <ProgressIndicator progress={progress} />
        )}

        {currentStep === "results" && results && (
          <ResultsStep results={results} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
