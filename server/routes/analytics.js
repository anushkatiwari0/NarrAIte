const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../middleware/errorHandler')
const { getAnalytics } = require('../controllers/analyticsController')

router.get('/', asyncHandler(getAnalytics))

module.exports = router
