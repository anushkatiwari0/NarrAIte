/**
 * NarrAIte Error Handling Middleware
 */

// Wraps async route handlers to catch errors automatically
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// 404 handler for unknown routes
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET  /api/health',
      'POST /api/generate',
      'POST /api/generate/save',
      'POST /api/upload',
      'POST /api/upload/generate',
      'POST /api/batch/start',
      'GET  /api/batch/:jobId',
      'GET  /api/stories',
      'POST /api/stories',
      'DELETE /api/stories/:id',
      'GET  /api/analytics'
    ]
  })
}

// Central error handler
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message)
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'FILE_TOO_LARGE',
      message: 'File size exceeds the 10MB limit'
    })
  }

  // AI API errors
  if (err.status === 401 || err.message?.includes('API key')) {
    return res.status(503).json({
      success: false,
      error: 'INVALID_API_KEY',
      message: 'AI API key is invalid or not configured. Check your server/.env file.'
    })
  }

  if (err.status === 429 || err.message?.includes('rate limit')) {
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMITED',
      message: 'AI rate limit reached. Please wait a moment and try again.'
    })
  }

  if (err.status === 402 || err.message?.includes('quota')) {
    return res.status(402).json({
      success: false,
      error: 'QUOTA_EXCEEDED',
      message: 'AI API quota exceeded. Please check your billing at openrouter.ai'
    })
  }

  // CORS errors
  if (err.message?.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: 'CORS_ERROR',
      message: err.message
    })
  }

  // JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'INVALID_JSON',
      message: 'Request body contains invalid JSON'
    })
  }

  // Default 500
  res.status(err.status || 500).json({
    success: false,
    error: err.code || 'SERVER_ERROR',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again.'
      : err.message
  })
}

module.exports = { asyncHandler, errorHandler, notFoundHandler }
