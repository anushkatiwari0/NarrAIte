const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const { asyncHandler } = require('../middleware/errorHandler')
const { startBatch, getJobStatus, listJobs } = require('../controllers/batchController')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `batch_${uuidv4()}${path.extname(file.originalname)}`)
})

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

router.post('/start', upload.single('file'), asyncHandler(startBatch))
router.get('/:jobId', asyncHandler(getJobStatus))
router.get('/', asyncHandler(listJobs))

module.exports = router
