class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.error("Unhandled error:", err);
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    err = new AppError("File too large. Maximum size is 10MB.", 413);
  } else if (err.message === "INVALID_FILE_TYPE") {
    err = new AppError("Invalid file type. Only CSV or Excel files are accepted.", 400);
  } else if (err.name === "ConfigError") {
    err = new AppError("Server configuration error. Please contact administrator.", 500);
  }
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      error: 'Something went very wrong. Please try again later.',
    });
  }
};

module.exports = {
  AppError,
  errorHandler
};
