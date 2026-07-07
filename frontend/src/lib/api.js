class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Uploads a CSV file to the backend and returns AI-extracted CRM records.
 * @param {File} file - The CSV file to upload
 * @param {Function} onProgress - Progress callback: ({ percent, message }) => void
 * @returns {Promise<{ records: Array, skipped: Array, summary: Object }>}
 */
export async function uploadAndProcess(file, onProgress) {
  try {
    // Simulate upload progress
    onProgress?.({ percent: 15, message: "Uploading CSV file..." });

    const formData = new FormData();
    formData.append("file", file);

    onProgress?.({ percent: 30, message: "File uploaded. AI is analyzing your data..." });

    const response = await fetch(`${API_BASE}/import`, {
      method: "POST",
      body: formData,
    });

    onProgress?.({ percent: 70, message: "AI is extracting CRM records..." });

    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.error) errorMessage = errorData.error;
      } catch (e) {
        // Response wasn't JSON
      }
      throw new ApiError(errorMessage, response.status);
    }

    const data = await response.json();

    onProgress?.({ percent: 90, message: "Finalizing results..." });

    if (!data.success) {
      throw new ApiError(data.error || "Import failed.", 500);
    }

    onProgress?.({ percent: 100, message: "Done!" });

    // Small delay to show 100% completion
    await new Promise((resolve) => setTimeout(resolve, 500));

    return data.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new ApiError(
        "Cannot connect to the server. Make sure the backend is running.",
        0
      );
    }
    throw new ApiError(error.message || "An unexpected error occurred", 500);
  }
}
