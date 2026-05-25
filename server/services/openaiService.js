/**
 * NarrAIte AI Service (via OpenRouter)
 * Handles all AI generation logic with advanced prompt engineering
 */

const OpenAI = require('openai')

// Initialize OpenAI-compatible client lazily so server starts even without key
let _client = null

const getClient = () => {
  if (!_client) {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured. Please add it to your .env file.')
    }
    _client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'NarrAIte'
      }
    })
  }
  return _client
}

// ─── Audience-specific prompt guidelines ──────────────────
const AUDIENCE_GUIDELINES = {
  Donors: `
    - Lead with human emotion and personal transformation
    - Use vivid storytelling with a specific beneficiary's journey
    - Show direct causal link: donor's gift → real change
    - End with a powerful call to continued action
    - Use warm, grateful, and hopeful language
    - Highlight lives changed, not just statistics`,

  Investors: `
    - Open with the market problem and opportunity size
    - Lead with quantifiable metrics: ROI, scale, cost-per-beneficiary
    - Use business language: efficiency, scalability, replicability
    - Include projected 5-10 year impact trajectory
    - Demonstrate governance, transparency, and audit readiness
    - Frame social outcomes as long-term economic value`,

  NGOs: `
    - Focus on methodology, theory of change, and systems thinking
    - Highlight collaboration opportunities and partnership potential
    - Discuss replication potential and lessons learned
    - Use sector-specific technical language appropriately
    - Emphasize community ownership and sustainability
    - Reference alignment with SDGs and global frameworks`,

  Students: `
    - Use inspiring, accessible language that speaks to young people
    - Connect to themes of justice, opportunity, and future potential
    - Include relatable peer stories where possible
    - Focus on possibility and agency — what one person can do
    - Use active voice and energetic phrasing
    - End with a clear action students can take`,

  Healthcare: `
    - Lead with patient outcomes and quality-of-life improvements
    - Include clinical metrics: diagnoses, treatments, recovery rates
    - Emphasize dignity, care quality, and access equity
    - Use appropriate medical terminology accurately
    - Reference healthcare system strengthening
    - Highlight preventive care and community health impact`,

  Government: `
    - Align with national development goals and policy priorities
    - Emphasize population-level impact and geographic reach
    - Use governance language: compliance, accountability, auditable outcomes
    - Connect to existing schemes and policy frameworks
    - Highlight cost-effectiveness for public expenditure
    - Use formal, policy-appropriate tone throughout`
}

// ─── Tone modifiers ────────────────────────────────────────
const TONE_MODIFIERS = {
  'Emotional & Inspiring': 'Write with deep empathy and emotional resonance. Use narrative storytelling techniques, descriptive imagery, and emotionally powerful language that moves readers to feel before they think.',
  'Data-driven & Analytical': 'Ground every claim in specific numbers and evidence. Use precise statistics, comparative benchmarks, and analytical framing. Readers trust data — give them compelling evidence.',
  'Formal & Professional': 'Use clear, professional prose appropriate for institutional communication. Avoid jargon, maintain gravitas, and structure content logically with clear transitions.',
  'Conversational & Warm': 'Write as if speaking directly to the reader in a warm, personal conversation. Use "you" language, relatable analogies, and accessible vocabulary.',
  'Urgent & Action-oriented': 'Create a sense of momentum and urgency. Use strong verbs, present tense where appropriate, and clear calls to action. Make the reader feel they must act now.'
}

// ─── Length targets ────────────────────────────────────────
const LENGTH_TARGETS = {
  short: { min: 150, max: 200, label: '150-200 words' },
  medium: { min: 300, max: 400, label: '300-400 words' },
  long: { min: 600, max: 800, label: '600-800 words' }
}

// ─── Build system prompt ───────────────────────────────────
const buildSystemPrompt = (audience, tone, format, sector) => `
You are NarrAIte, a world-class impact narrative writer specializing in the social sector.
You combine the storytelling craft of a Pulitzer-winning journalist with the strategic communication skills of a top management consultant.

Your outputs transform raw impact data into emotionally resonant, strategically targeted narratives that move audiences to act.

SECTOR CONTEXT: ${sector}
TARGET AUDIENCE: ${audience}
NARRATIVE FORMAT: ${format}

AUDIENCE-SPECIFIC APPROACH:
${AUDIENCE_GUIDELINES[audience] || AUDIENCE_GUIDELINES['Donors']}

TONE GUIDANCE:
${TONE_MODIFIERS[tone] || TONE_MODIFIERS['Emotional & Inspiring']}

WRITING RULES:
1. Never use clichés like "changing lives" without specific proof
2. Always ground abstract claims in concrete, specific details
3. Use the rule of three for impact: one human story + one data point + one forward vision
4. Vary sentence length to create rhythm and pace
5. Use paragraph breaks strategically for readability
6. End every piece with a memorable closing line

CRITICAL OUTPUT RULES:
1. Respond with ONLY a valid JSON object — no markdown, no code fences, no explanation before or after
2. The "story" field must contain PLAIN PROSE TEXT only — no JSON, no brackets, no quotes around it
3. Write the story as natural paragraphs separated by two newlines (\\n\\n)
4. Never put raw JSON or field names inside the story text

OUTPUT FORMAT (valid JSON, all fields required):
{
  "title": "specific evocative headline max 12 words",
  "story": "First paragraph of the story.\\n\\nSecond paragraph continues here.\\n\\nThird paragraph closes the narrative.",
  "summary": "2-sentence executive summary of key impact",
  "keyStats": ["stat 1", "stat 2", "stat 3"],
  "callToAction": "one compelling action sentence for the audience",
  "socialPost": "engaging 240-character post with 2-3 hashtags",
  "emailSubject": "compelling email subject line under 50 chars",
  "keyQuote": "the single most powerful sentence from the story",
  "sentiment": 8.5,
  "readability": 72,
  "estimatedReadTime": "2 min read",
  "tags": ["tag1", "tag2", "tag3"]
}
`.trim()

// ─── Build user prompt ─────────────────────────────────────
const buildUserPrompt = (data, audience, tone, length, format, sector) => {
  const target = LENGTH_TARGETS[length] || LENGTH_TARGETS.medium
  return `
Generate a ${format} impact narrative from the following data.

IMPACT DATA:
${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}

REQUIREMENTS:
- Audience: ${audience}
- Tone: ${tone}
- Sector: ${sector}
- Target Length: ${target.label} for the "story" field
- Format: ${format}

Generate a narrative that would make a seasoned ${audience.toLowerCase()} stop scrolling and lean forward.
`.trim()
}

// ─── Main generation function ──────────────────────────────
const generateNarrative = async ({
  data,
  audience = 'Donors',
  tone = 'Emotional & Inspiring',
  length = 'medium',
  format = 'Full Narrative',
  sector = 'Education'
}) => {
  const client = getClient()

  const systemPrompt = buildSystemPrompt(audience, tone, format, sector)
  const userPrompt = buildUserPrompt(data, audience, tone, length, format, sector)

  const response = await client.chat.completions.create({
    model: process.env.OPENROUTER_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,              // Balanced creativity and speed
    max_tokens: 1200,
    presence_penalty: 0.1,
    frequency_penalty: 0.1,
  })

  const rawText = response.choices[0]?.message?.content || ''

  let parsed
  try {
    parsed = JSON.parse(rawText)
  } catch {
    // Attempt to extract JSON if response has extra text
    const match = rawText.match(/\{[\s\S]*\}/)
    if (match) {
      parsed = JSON.parse(match[0])
    } else {
      throw new Error('AI returned malformed response. Please try again.')
    }
  }

  // Validate and normalize required fields
  return {
    title: parsed.title || 'Impact Story',
    story: parsed.story || rawText,
    summary: parsed.summary || '',
    keyStats: Array.isArray(parsed.keyStats) ? parsed.keyStats : [],
    callToAction: parsed.callToAction || '',
    socialPost: parsed.socialPost || '',
    emailSubject: parsed.emailSubject || parsed.title || 'Our Impact Story',
    keyQuote: parsed.keyQuote || '',
    sentiment: parseFloat(parsed.sentiment) || 8.0,
    readability: parseInt(parsed.readability) || 70,
    estimatedReadTime: parsed.estimatedReadTime || '2 min read',
    tags: Array.isArray(parsed.tags) ? parsed.tags : [audience, sector],
    wordCount: (parsed.story || '').split(/\s+/).filter(Boolean).length,
    tokensUsed: response.usage?.total_tokens || 0,
    model: response.model
  }
}

// ─── Batch generation (processes array of rows) ────────────
const generateBatchNarratives = async (rows, options, onProgress) => {
  const results = []
  const errors = []

  for (let i = 0; i < rows.length; i++) {
    try {
      const rowData = typeof rows[i] === 'object'
        ? Object.entries(rows[i]).map(([k, v]) => `${k}: ${v}`).join('\n')
        : String(rows[i])

      const result = await generateNarrative({ ...options, data: rowData })
      results.push({ index: i, ...result, sourceRow: rows[i] })

      if (onProgress) onProgress(i + 1, rows.length)

      // Respect rate limits — small delay between calls
      if (i < rows.length - 1) {
        await new Promise(r => setTimeout(r, 300))
      }
    } catch (err) {
      errors.push({ index: i, row: rows[i], error: err.message })
    }
  }

  return { results, errors }
}

// ─── Test AI connection ────────────────────────────────────
const testConnection = async () => {
  const client = getClient()
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Reply with exactly: {"status":"ok"}' }],
    max_tokens: 20,
    response_format: { type: 'json_object' }
  })
  return response.choices[0]?.message?.content
}

module.exports = {
  generateNarrative,
  generateBatchNarratives,
  testConnection
}
