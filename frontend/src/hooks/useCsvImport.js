import { useState, useCallback } from "react";
import { uploadAndProcess } from "../lib/api";
import { STEPS } from "../lib/constants";

export function useCsvImport() {
  const [currentStep, setCurrentStep] = useState("upload");
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ percent: 0, message: "" });

  const handleFileSelect = useCallback((selectedFile, parsed) => {
    setFile(selectedFile);
    setParsedData(parsed);
    setError(null);
    setCurrentStep("preview");
  }, []);

  const handleConfirmImport = useCallback(async () => {
    if (!file) return;

    setCurrentStep("process");
    setError(null);
    setProgress({ percent: 10, message: "Uploading CSV to server..." });

    try {
      const result = await uploadAndProcess(file, (prog) => {
        setProgress(prog);
      });

      setResults(result);
      setCurrentStep("results");
    } catch (err) {
      setError(err.message || "An error occurred during processing.");
      setCurrentStep("preview");
    }
  }, [file]);

  const handleReset = useCallback(() => {
    setFile(null);
    setParsedData(null);
    setResults(null);
    setError(null);
    setProgress({ percent: 0, message: "" });
    setCurrentStep("upload");
  }, []);

  const handleBack = useCallback(() => {
    setError(null);
    if (currentStep === "preview") {
      setCurrentStep("upload");
      setFile(null);
      setParsedData(null);
    }
  }, [currentStep]);

  const getStepIndex = (step) => STEPS.findIndex((s) => s.id === step);
  const currentIndex = getStepIndex(currentStep);

  return {
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
  };
}
