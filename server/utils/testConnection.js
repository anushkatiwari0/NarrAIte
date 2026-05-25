/**
 * Test AI API connection (via OpenRouter)
 * Run: node utils/testConnection.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { testConnection } = require('../services/openaiService')

;(async () => {
  console.log('Testing AI API connection...')
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in .env')
    process.exit(1)
  }
  try {
    const result = await testConnection()
    console.log('✅ AI API connected:', result)
  } catch (err) {
    console.error('❌ Connection failed:', err.message)
  }
})()
