const rateLimit = require('express-rate-limit')

// AI generation endpoints — stricter limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '50'),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'RATE_LIMITED',
    message: 'Too many requests. Please wait 15 minutes before trying again.'
  },
  skip: (req) => process.env.NODE_ENV === 'development'  // Skip in dev
})

// General API limiter
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 200,
  message: {
    success: false,
    error: 'RATE_LIMITED',
    message: 'Too many requests.'
  }
})

module.exports = { apiLimiter, generalLimiter }
