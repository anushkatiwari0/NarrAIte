/**
 * Analytics Controller
 * GET /api/analytics
 */

const storyStore = require('../services/storyStore')

const getAnalytics = (req, res) => {
  const stats = storyStore.getStats()

  // Real backend metrics based purely on stored stories
  res.json({
    success: true,
    stats: {
      ...stats,
      totalAllTime: stats.total,
      // The below can be implemented with a real token tracker if added later
      avgGenerationTime: 'Live API',
      tokensUsedThisMonth: 'Live API',
      successRate: 'Live API'
    }
  })
}

module.exports = { getAnalytics }
