const csvService = require("../services/csv.service");
const aiService = require("../services/ai.service");
const { AppError } = require("../middlewares/errorHandler");


async function handleImport(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError("No file uploaded. Please upload a CSV file.", 400);
    }
    console.log(
      `📄 Received file: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`
    );
    const csvContent = req.file.buffer.toString("utf-8");
    const { headers, records } = await csvService.parseCSV(csvContent);
    if (records.length === 0) {
      throw new AppError("CSV file contains no data records.", 400);
    }

    console.log(
      `✅ Parsed ${records.length} records with ${headers.length} columns: [${headers.join(", ")}]`
    );
    const result = await aiService.extractCrmRecords(headers, records);

    console.log(
      `🤖 AI extraction complete: ${result.records.length} imported, ${result.skipped.length} skipped`
    );
    return res.json({
      success: true,
      data: {
        records: result.records,
        skipped: result.skipped,
        summary: {
          totalProcessed: records.length,
          totalImported: result.records.length,
          totalSkipped: result.skipped.length,
        },
      },
    });
  } catch (error) {
    if (error.message.includes("CSV")) {
      return next(new AppError(error.message, 400));
    }
    next(error);
  }
}

module.exports = { handleImport };
