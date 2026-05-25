/**
 * Stories Controller
 * GET/POST/DELETE /api/stories
 */

const storyStore = require('../services/storyStore')

const getAllStories = (req, res) => {
  const { audience, sector, search } = req.query
  const stories = storyStore.getAll({ audience, sector, search })
  res.json({ success: true, stories, count: stories.length })
}

const getStoryById = (req, res) => {
  const story = storyStore.getById(req.params.id)
  if (!story) return res.status(404).json({ success: false, message: 'Story not found' })
  res.json({ success: true, story })
}

const saveStory = (req, res) => {
  const story = storyStore.add(req.body)
  res.status(201).json({ success: true, story })
}

const deleteStory = (req, res) => {
  const deleted = storyStore.delete(req.params.id)
  if (!deleted) return res.status(404).json({ success: false, message: 'Story not found' })
  res.json({ success: true, message: 'Story deleted' })
}

module.exports = { getAllStories, getStoryById, saveStory, deleteStory }
