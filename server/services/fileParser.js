/**
 * NarrAIte File Parser Service
 * Handles CSV, XLSX, JSON parsing and normalization
 */

const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const XLSX = require('xlsx')

// ─── Parse CSV file ────────────────────────────────────────
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
      .pipe(csv({
        trim: true,
        skipEmptyLines: true
      }))
      .on('data', (row) => {
        // Filter out completely empty rows
        const hasData = Object.values(row).some(v => v && v.toString().trim())
        if (hasData) results.push(row)
      })
      .on('end', () => resolve(results))
      .on('error', reject)
  })
}

// ─── Parse XLSX file ───────────────────────────────────────
const parseXLSX = (filePath) => {
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(sheet, {
    defval: '',
    blankrows: false
  })
  return rows
}

// ─── Parse JSON file ───────────────────────────────────────
const parseJSON = (filePath) => {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const parsed = JSON.parse(raw)
  // Normalize: accept array or {data: [...]}
  if (Array.isArray(parsed)) return parsed
  if (parsed.data && Array.isArray(parsed.data)) return parsed.data
  if (typeof parsed === 'object') return [parsed]
  throw new Error('JSON must contain an array of records or a {data: [...]} object')
}

// ─── Convert rows to narrative data strings ────────────────
const rowToDataString = (row) => {
  if (typeof row === 'string') return row
  return Object.entries(row)
    .filter(([k, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}

// ─── Main parse function ───────────────────────────────────
const parseFile = async (filePath, mimetype) => {
  const ext = path.extname(filePath).toLowerCase()

  let rows = []

  if (ext === '.csv' || mimetype === 'text/csv') {
    rows = await parseCSV(filePath)
  } else if (['.xlsx', '.xls'].includes(ext) ||
    mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimetype === 'application/vnd.ms-excel') {
    rows = parseXLSX(filePath)
  } else if (ext === '.json' || mimetype === 'application/json') {
    rows = parseJSON(filePath)
  } else {
    throw new Error(`Unsupported file type: ${ext}. Supported: CSV, XLSX, XLS, JSON`)
  }

  if (!rows || rows.length === 0) {
    throw new Error('File appears to be empty or could not be parsed')
  }

  return {
    rows,
    count: rows.length,
    columns: rows.length > 0 ? Object.keys(rows[0]) : [],
    preview: rows.slice(0, 3),
    sample: rowToDataString(rows[0])
  }
}

// ─── Cleanup uploaded file ─────────────────────────────────
const cleanupFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (err) {
    console.warn('Could not delete temp file:', filePath, err.message)
  }
}

module.exports = { parseFile, parseCSV, parseXLSX, parseJSON, rowToDataString, cleanupFile }
