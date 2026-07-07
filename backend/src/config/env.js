const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
  }
}

const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
  aiTemperature: parseFloat(process.env.AI_TEMPERATURE || "0.1"),
  aiMaxOutputTokens: parseInt(process.env.AI_MAX_OUTPUT_TOKENS || "8192", 10),
  batchSize: parseInt(process.env.BATCH_SIZE || "25", 10),
  maxRetries: parseInt(process.env.MAX_RETRIES || "3", 10),
  env: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ["http://localhost:3000", "http://127.0.0.1:3000"],
};

function validateConfig() {
  if (!config.geminiApiKey || config.geminiApiKey === "your_gemini_api_key_here") {
    throw new ConfigError("GEMINI_API_KEY is not configured properly in .env");
  }
}

module.exports = {
  config,
  validateConfig,
  ConfigError
};
