/**
 * NarrAIte Story Store
 * In-memory store with optional JSON persistence
 * (Drop-in swap: replace with Supabase/MongoDB in production)
 */

const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const STORE_PATH = path.join(__dirname, '../data/stories.json')

// Load persisted stories on startup
const loadStore = () => {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.warn('Could not load story store, starting fresh:', err.message)
  }
  return []
}

// Persist to JSON file
const saveStore = (stories) => {
  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true })
    fs.writeFileSync(STORE_PATH, JSON.stringify(stories, null, 2))
  } catch (err) {
    console.warn('Could not persist story store:', err.message)
  }
}

let _stories = loadStore()

const store = {
  // Get all stories
  getAll: (filters = {}) => {
    let result = [..._stories]
    if (filters.audience) result = result.filter(s => s.audience === filters.audience)
    if (filters.sector) result = result.filter(s => s.sector === filters.sector)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(s =>
        s.title?.toLowerCase().includes(q) ||
        s.story?.toLowerCase().includes(q) ||
        s.sector?.toLowerCase().includes(q)
      )
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  // Get by ID
  getById: (id) => _stories.find(s => s.id === id),

  // Add story
  add: (storyData) => {
    const story = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...storyData
    }
    _stories.unshift(story)
    saveStore(_stories)
    return story
  },

  // Delete story
  delete: (id) => {
    const idx = _stories.findIndex(s => s.id === id)
    if (idx === -1) return false
    _stories.splice(idx, 1)
    saveStore(_stories)
    return true
  },

  // Stats for analytics
  getStats: () => {
    const total = _stories.length
    const avgSentiment = total
      ? (_stories.reduce((a, s) => a + (s.sentiment || 0), 0) / total).toFixed(2)
      : 0
    const avgReadability = total
      ? Math.round(_stories.reduce((a, s) => a + (s.readability || 0), 0) / total)
      : 0

    const byAudience = _stories.reduce((acc, s) => {
      acc[s.audience] = (acc[s.audience] || 0) + 1
      return acc
    }, {})

    const bySector = _stories.reduce((acc, s) => {
      acc[s.sector] = (acc[s.sector] || 0) + 1
      return acc
    }, {})

    const byTone = _stories.reduce((acc, s) => {
      acc[s.tone] = (acc[s.tone] || 0) + 1
      return acc
    }, {})

    return { total, avgSentiment, avgReadability, byAudience, bySector, byTone }
  },

  count: () => _stories.length
}

module.exports = store
