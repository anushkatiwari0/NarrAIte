/**
 * Generate Controller
 * POST /api/generate
 */

const { generateNarrative } = require('../services/openaiService')
const storyStore = require('../services/storyStore')

/**
 * POST /api/generate
 * Body: { data, audience, tone, length, format, sector, save }
 * Returns: { success, narrative, id }
 */
const generateStory = async (req, res) => {
  const {
    data,
    audience = 'Donors',
    tone = 'Emotional & Inspiring',
    length = 'medium',
    format = 'Full Narrative',
    sector = 'Education',
    save = false
  } = req.body

  // Validate required input
  if (!data || (typeof data === 'string' && !data.trim())) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_DATA',
      message: 'Impact data is required. Please provide text, form data, or upload a file.'
    })
  }

  // Check API key before attempting
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      success: false,
      error: 'API_NOT_CONFIGURED',
      message: 'AI API key is not configured. Please add OPENAI_API_KEY to your server/.env file.'
    })
  }

  console.log(`[Generate] audience=${audience} tone=${tone} length=${length} sector=${sector}`)

  const narrative = await generateNarrative({ data, audience, tone, length, format, sector })

  let savedId = null
  if (save) {
    const saved = storyStore.add({
      ...narrative,
      audience,
      tone: tone.split(' ')[0],
      sector,
      format,
      excerpt: narrative.story.slice(0, 140) + '…'
    })
    savedId = saved.id
  }

  res.json({
    success: true,
    narrative,
    id: savedId,
    meta: {
      audience, tone, sector, format, length,
      generatedAt: new Date().toISOString()
    }
  })
}

/**
 * POST /api/generate/save
 * Save a previously generated story to the library
 */
const saveStory = async (req, res) => {
  const { narrative, audience, tone, sector, format } = req.body

  if (!narrative || !narrative.title) {
    return res.status(400).json({
      success: false,
      message: 'Invalid story data to save'
    })
  }

  const saved = storyStore.add({
    ...narrative,
    audience,
    tone: (tone || '').split(' ')[0],
    sector,
    format,
    excerpt: (narrative.story || '').slice(0, 140) + '…'
  })

  res.json({ success: true, id: saved.id, story: saved })
}

/**
 * POST /api/generate/test
 * Test endpoint to verify AI is working (uses minimal tokens)
 */
const testGenerate = async (req, res) => {
  const { testConnection } = require('../services/openaiService')

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      success: false,
      message: 'OPENAI_API_KEY not configured'
    })
  }

  const result = await testConnection()
  res.json({ success: true, aiStatus: 'connected', response: result })
}

module.exports = { generateStory, saveStory, testGenerate }
