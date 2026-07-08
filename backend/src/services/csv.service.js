const { parse } = require("csv-parse/sync");


function parseCSV(content) {
  const cleanContent = content.replace(/^\uFEFF/, "");
  if (!cleanContent.trim()) {
    throw new Error("CSV file is empty.");
  }
  const firstLine = cleanContent.split(/\r?\n/)[0];
  let delimiter = ",";
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  if (semicolonCount > commaCount && semicolonCount > tabCount) {
    delimiter = ";";
  } else if (tabCount > commaCount && tabCount > semicolonCount) {
    delimiter = "\t";
  }
  try {
    const rawRecords = parse(cleanContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter,
      relax_quotes: true,
      relax_column_count: true,
    });

    if (rawRecords.length === 0) {
      throw new Error("CSV file contains no data records.");
    }
    const headers = Object.keys(rawRecords[0]);
    const records = rawRecords.map((row) => {
      const cleanRow = {};
      for (const [key, value] of Object.entries(row)) {
        cleanRow[key.trim()] = typeof value === "string" ? value.trim() : String(value || "");
      }
      return cleanRow;
    });

    return { headers, records };
  } catch (error) {
    if (error.message.includes("CSV")) {
      throw error;
    }
    throw new Error(`Failed to parse CSV: ${error.message}`);
  }
}

module.exports = { parseCSV };
