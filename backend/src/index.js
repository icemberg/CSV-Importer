const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { config, validateConfig } = require("./config/env");
const { errorHandler } = require("./middlewares/errorHandler");
const { apiLimiter } = require("./middlewares/rateLimiter");
const importRoutes = require("./routes/import.routes");

// Validate environment variables on startup
validateConfig();

const app = express();

// Security HTTP headers
app.use(helmet());

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use('/api', apiLimiter);

// Middleware
app.use(
  cors({
    origin: config.corsOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression
app.use(compression());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), env: config.env });
});

// Routes
app.use("/api", importRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use(errorHandler);

let server;
if (process.env.NODE_ENV !== "production") {
  server = app.listen(config.port, () => {
    console.log(
      `\n🚀 GrowEasy CSV Importer API running on port ${config.port} in ${config.env} mode`
    );
    console.log(
      `📋 Health check: http://localhost:${config.port}/api/health\n`
    );
  });
}

// Export for serverless environments (like Vercel)
module.exports = app;

// Graceful Shutdown Handler
const gracefulShutdown = () => {
  console.log("SIGTERM/SIGINT received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Process terminated!");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
