const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../middleware/errorHandler')
const { generateStory, saveStory, testGenerate } = require('../controllers/generateController')

// POST /api/generate — main generation endpoint
router.post('/', asyncHandler(generateStory))

// POST /api/generate/save — save story to library
router.post('/save', asyncHandler(saveStory))

// POST /api/generate/test — test AI connection
router.post('/test', asyncHandler(testGenerate))

module.exports = router
