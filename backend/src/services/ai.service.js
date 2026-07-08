const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getSystemPrompt, buildBatchPrompt } = require("./prompt");
const { withRetry } = require("../utils/retry");
const { validateRecord, hasContactInfo } = require("./validation.service");
const { config } = require("../config/env");

class AiProvider {
  constructor() {
    this.client = new GoogleGenerativeAI(config.geminiApiKey);
  }

  getModel(modelName = config.geminiModel, systemInstruction = null) {
    const options = { model: modelName };
    if (systemInstruction) {
      options.systemInstruction = {
        role: "system",
        parts: [{ text: systemInstruction }],
      };
    }
    return this.client.getGenerativeModel(options);
  }
}

const aiProvider = new AiProvider();

function splitIntoBatches(array, batchSize) {
  const batches = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}
function parseAIResponse(responseText) {
  let cleaned = responseText.trim();

  // Remove markdown code block wrappers if present
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }

  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Try to find JSON object in the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error(`Failed to parse AI response as JSON: ${e.message}`);
  }
}
async function processBatch(
  modelName,
  headers,
  batchRecords,
  batchIndex,
  totalBatches
) {
  const systemPrompt = getSystemPrompt();
  const userPrompt = buildBatchPrompt(
    headers,
    batchRecords,
    batchIndex,
    totalBatches
  );

  const model = aiProvider.getModel(modelName, systemPrompt);

  const result = await withRetry(
    async (attempt) => {
      console.log(
        `  📡 Batch ${batchIndex + 1}/${totalBatches} — attempt ${attempt + 1}`
      );

      const chat = model.startChat({
        history: [],
        generationConfig: {
          temperature: config.aiTemperature,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: config.aiMaxOutputTokens,
          responseMimeType: "application/json",
        },
      });

      const response = await chat.sendMessage(userPrompt);
      const text = response.response.text();

      if (!text || text.trim() === "") {
        throw new Error("Empty response from AI");
      }

      return parseAIResponse(text);
    },
    { maxRetries: config.maxRetries }
  );

  return result;
}
async function extractCrmRecords(headers, records) {
  const modelName = config.geminiModel;

  const batches = splitIntoBatches(records, config.batchSize);
  console.log(
    `🤖 Processing ${records.length} records in ${batches.length} batch(es) (batch size: ${config.batchSize})`
  );

  const allRecords = [];
  const allSkipped = [];

  for (let i = 0; i < batches.length; i++) {
    try {
      const result = await processBatch(
        modelName,
        headers,
        batches[i],
        i,
        batches.length
      );
      if (result.records && Array.isArray(result.records)) {
        for (const record of result.records) {
          const sanitized = validateRecord(record);
          if (hasContactInfo(sanitized)) {
            allRecords.push(sanitized);
          } else {
            allSkipped.push({
              rowIndex: i * config.batchSize + result.records.indexOf(record) + 1,
              originalData: record,
              reason: "No email or mobile number found after AI extraction",
            });
          }
        }
      }
      if (result.skipped && Array.isArray(result.skipped)) {
        for (const skipped of result.skipped) {
          allSkipped.push({
            rowIndex: skipped.rowIndex || 0,
            originalData: skipped.originalData || {},
            reason: skipped.reason || "Skipped by AI",
          });
        }
      }

      console.log(
        `  ✅ Batch ${i + 1} done: ${result.records?.length || 0} records, ${result.skipped?.length || 0} skipped`
      );
    } catch (error) {
      console.error(`  ❌ Batch ${i + 1} failed after retries:`, error.message);
      for (let j = 0; j < batches[i].length; j++) {
        allSkipped.push({
          rowIndex: i * config.batchSize + j + 1,
          originalData: batches[i][j],
          reason: `AI processing failed: ${error.message}`,
        });
      }
    }
  }
  return { records: allRecords, skipped: allSkipped };
}

module.exports = { extractCrmRecords };
