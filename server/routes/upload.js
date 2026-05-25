const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const { asyncHandler } = require('../middleware/errorHandler')
const { uploadAndParse, uploadAndGenerate } = require('../controllers/uploadController')

// ─── Multer storage config ─────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `upload_${uuidv4()}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/json'
  ]
  const ext = path.extname(file.originalname).toLowerCase()
  const allowedExt = ['.csv', '.xls', '.xlsx', '.json']

  if (allowed.includes(file.mimetype) || allowedExt.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type. Allowed: CSV, XLSX, XLS, JSON. Got: ${file.originalname}`), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }  // 10MB
})

// POST /api/upload — parse file, return preview
router.post('/', upload.single('file'), asyncHandler(uploadAndParse))

// POST /api/upload/generate — parse + generate story from first row
router.post('/generate', upload.single('file'), asyncHandler(uploadAndGenerate))

module.exports = router
