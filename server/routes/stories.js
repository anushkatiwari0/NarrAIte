const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../middleware/errorHandler')
const { getAllStories, getStoryById, saveStory, deleteStory } = require('../controllers/storiesController')

router.get('/', asyncHandler(getAllStories))
router.get('/:id', asyncHandler(getStoryById))
router.post('/', asyncHandler(saveStory))
router.delete('/:id', asyncHandler(deleteStory))

module.exports = router
