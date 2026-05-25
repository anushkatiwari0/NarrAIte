/**
 * NarrAIte Backend — Express Server
 * Runs on PORT 5000 by default
 */

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler')
const { apiLimiter } = require('./middleware/rateLimiter')

// Route imports
const generateRoutes = require('./routes/generate')
const uploadRoutes = require('./routes/upload')
const batchRoutes = require('./routes/batch')
const analyticsRoutes = require('./routes/analytics')
const storyRoutes = require('./routes/stories')

const app = express()
const PORT = process.env.PORT || 5000

// ─── Security Middleware ──────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

// ─── CORS ─────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}))

// ─── Body Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ─── Logging ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// ─── Static file serving (uploaded files) ─────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ─── Health Check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NarrAIte API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /api/health',
      generate: 'POST /api/generate',
      upload: 'POST /api/upload',
      batch: 'POST /api/batch',
      stories: 'GET /api/stories',
      analytics: 'GET /api/analytics'
    }
  })
})

app.get('/api/health', (req, res) => {
  const hasApiKey = !!process.env.OPENAI_API_KEY
  res.json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()) + 's',
    ai: hasApiKey ? 'configured' : 'missing API key',
    memory: process.memoryUsage().heapUsed,
    timestamp: new Date().toISOString()
  })
})

// ─── Rate limiting on AI endpoints ────────────────────────
app.use('/api/generate', apiLimiter)
app.use('/api/batch', apiLimiter)

// ─── API Routes ───────────────────────────────────────────
app.use('/api/generate', generateRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/batch', batchRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/stories', storyRoutes)

// ─── Error handlers ───────────────────────────────────────
app.use(notFoundHandler)
app.use(errorHandler)

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════╗')
  console.log('║       NarrAIte Backend Server          ║')
  console.log('╚════════════════════════════════════════╝')
  console.log(`  🚀 Server running on http://localhost:${PORT}`)
  console.log(`  🤖 AI API: ${process.env.OPENAI_API_KEY ? '✅ Configured (OpenRouter)' : '❌ Missing OPENAI_API_KEY'}`)
  console.log(`  🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`  📋 Docs: http://localhost:${PORT}/`)
  console.log('─────────────────────────────────────────\n')
})

module.exports = app
