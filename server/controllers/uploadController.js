/**
 * Upload Controller
 * POST /api/upload
 */

const { parseFile, cleanupFile } = require('../services/fileParser')
const { generateNarrative } = require('../services/openaiService')

/**
 * POST /api/upload
 * Accepts multipart file, parses it, returns preview + optional first story
 */
const uploadAndParse = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded. Use field name "file" in form-data.'
    })
  }

  const filePath = req.file.path
  const mimetype = req.file.mimetype

  try {
    const parsed = await parseFile(filePath, mimetype)

    res.json({
      success: true,
      file: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype
      },
      data: {
        count: parsed.count,
        columns: parsed.columns,
        preview: parsed.preview,
        sample: parsed.sample
      }
    })
  } finally {
    cleanupFile(filePath)
  }
}

/**
 * POST /api/upload/generate
 * Upload file + generate a story from the first record
 */
const uploadAndGenerate = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded.'
    })
  }

  const filePath = req.file.path
  const { audience = 'Donors', tone = 'Emotional & Inspiring', sector = 'Education', length = 'medium', format = 'Full Narrative' } = req.body

  if (!process.env.OPENAI_API_KEY) {
    cleanupFile(filePath)
    return res.status(503).json({
      success: false,
      message: 'AI API key not configured. Add OPENAI_API_KEY to server/.env'
    })
  }

  try {
    const parsed = await parseFile(req.file.path, req.file.mimetype)

    // Generate story from first row
    const narrative = await generateNarrative({
      data: parsed.sample,
      audience, tone, length, format, sector
    })

    res.json({
      success: true,
      narrative,
      fileInfo: {
        originalName: req.file.originalname,
        totalRows: parsed.count,
        columns: parsed.columns
      }
    })
  } finally {
    cleanupFile(filePath)
  }
}

module.exports = { uploadAndParse, uploadAndGenerate }
