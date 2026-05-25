/**
 * Batch Controller
 * POST /api/batch
 */

const { generateBatchNarratives } = require('../services/openaiService')
const { parseFile, cleanupFile } = require('../services/fileParser')
const storyStore = require('../services/storyStore')
const { v4: uuidv4 } = require('uuid')

// In-memory job tracker (use Redis in production)
const jobs = new Map()

/**
 * POST /api/batch/start
 * Start a batch job from uploaded file
 */
const startBatch = async (req, res) => {
  const {
    audience = 'Donors',
    tone = 'Emotional & Inspiring',
    sector = 'Education',
    length = 'medium',
    format = 'Full Narrative',
    name = 'Batch Job'
  } = req.body

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      success: false,
      message: 'AI API key not configured. Add OPENAI_API_KEY to server/.env'
    })
  }

  let rows = []
  let filePath = null

  if (req.file) {
    filePath = req.file.path
    const parsed = await parseFile(filePath, req.file.mimetype)
    rows = parsed.rows
    cleanupFile(filePath)
  } else if (req.body.rows && Array.isArray(req.body.rows)) {
    rows = req.body.rows
  } else {
    return res.status(400).json({
      success: false,
      message: 'Provide a file upload or rows array in request body'
    })
  }

  if (rows.length === 0) {
    return res.status(400).json({ success: false, message: 'No data rows found' })
  }

  // Cap batch size to prevent abuse
  const MAX_BATCH = parseInt(process.env.MAX_BATCH_SIZE || '50')
  const processRows = rows.slice(0, MAX_BATCH)

  const jobId = uuidv4()
  const job = {
    id: jobId,
    name,
    status: 'running',
    total: processRows.length,
    done: 0,
    errors: 0,
    audience, tone: tone.split(' ')[0], sector, format,
    results: [],
    startedAt: new Date().toISOString(),
    completedAt: null
  }
  jobs.set(jobId, job)

  // Respond immediately with job ID
  res.json({ success: true, jobId, total: processRows.length, message: 'Batch job started' })

  // Process in background
  ;(async () => {
    const { results, errors } = await generateBatchNarratives(
      processRows,
      { audience, tone, length, format, sector },
      (done, total) => {
        job.done = done
        job.progress = Math.round((done / total) * 100)
      }
    )

    // Save all results to story store
    for (const result of results) {
      storyStore.add({
        ...result,
        audience,
        tone: tone.split(' ')[0],
        sector,
        batchId: jobId,
        excerpt: (result.story || '').slice(0, 140) + '…'
      })
    }

    job.results = results
    job.errors = errors.length
    job.errorDetails = errors
    job.done = processRows.length
    job.progress = 100
    job.status = 'done'
    job.completedAt = new Date().toISOString()
  })().catch(err => {
    job.status = 'failed'
    job.errorMessage = err.message
  })
}

/**
 * GET /api/batch/:jobId
 * Poll batch job status
 */
const getJobStatus = (req, res) => {
  const job = jobs.get(req.params.jobId)
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' })
  }
  res.json({ success: true, job })
}

/**
 * GET /api/batch
 * List all batch jobs
 */
const listJobs = (req, res) => {
  const jobList = Array.from(jobs.values())
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
  res.json({ success: true, jobs: jobList })
}

module.exports = { startBatch, getJobStatus, listJobs }
