/**
 * NarrAIte API Service
 * All backend communication goes through here
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class ApiError extends Error {
  constructor(message, code, status) {
    super(message)
    this.code = code
    this.status = status
    this.name = 'ApiError'
  }
}

// ─── Core fetch wrapper ────────────────────────────────────
const apiFetch = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  })

  const data = await res.json().catch(() => ({ message: 'Invalid server response' }))

  if (!res.ok) {
    throw new ApiError(
      data.message || `Request failed (${res.status})`,
      data.error || 'API_ERROR',
      res.status
    )
  }
  return data
}

// ─── Health ───────────────────────────────────────────────
export const checkHealth = () => apiFetch('/api/health')

// ─── Story Generation ─────────────────────────────────────
export const generateStory = async (payload) => {
  return apiFetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export const saveStory = async (narrative, meta) => {
  return apiFetch('/api/generate/save', {
    method: 'POST',
    body: JSON.stringify({ narrative, ...meta })
  })
}

export const testAIConnection = () =>
  apiFetch('/api/generate/test', { method: 'POST', body: '{}' })

// ─── File Upload ──────────────────────────────────────────
export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData   // No Content-Type header — browser sets multipart boundary
  })
  const data = await res.json()
  if (!res.ok) throw new ApiError(data.message || 'Upload failed', data.error, res.status)
  return data
}

export const uploadAndGenerateStory = async (file, options) => {
  const formData = new FormData()
  formData.append('file', file)
  Object.entries(options).forEach(([k, v]) => formData.append(k, v))
  const res = await fetch(`${BASE_URL}/api/upload/generate`, {
    method: 'POST',
    body: formData
  })
  const data = await res.json()
  if (!res.ok) throw new ApiError(data.message || 'Upload failed', data.error, res.status)
  return data
}

// ─── Batch ────────────────────────────────────────────────
export const startBatchJob = async (file, options) => {
  const formData = new FormData()
  if (file) formData.append('file', file)
  Object.entries(options).forEach(([k, v]) => formData.append(k, String(v)))
  const res = await fetch(`${BASE_URL}/api/batch/start`, {
    method: 'POST',
    body: formData
  })
  const data = await res.json()
  if (!res.ok) throw new ApiError(data.message || 'Batch start failed', data.error, res.status)
  return data
}

export const getBatchStatus = (jobId) => apiFetch(`/api/batch/${jobId}`)
export const listBatchJobs = () => apiFetch('/api/batch')

// ─── Stories CRUD ─────────────────────────────────────────
export const fetchStories = (filters = {}) => {
  const params = new URLSearchParams(filters).toString()
  return apiFetch(`/api/stories${params ? '?' + params : ''}`)
}

export const deleteStoryFromServer = (id) =>
  apiFetch(`/api/stories/${id}`, { method: 'DELETE' })

// ─── Analytics ────────────────────────────────────────────
export const fetchAnalytics = () => apiFetch('/api/analytics')

// ─── Utility: check if backend is reachable ───────────────
export const isBackendOnline = async () => {
  try {
    await checkHealth()
    return true
  } catch {
    return false
  }
}
