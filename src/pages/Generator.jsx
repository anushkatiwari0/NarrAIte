import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useStories } from '../App'
import toast from 'react-hot-toast'
import {
  Sparkles, RefreshCw, Copy, Download, Save,
  FileText, X, AlertCircle, CheckCircle2, WifiOff, File,
  Minimize2, Heart
} from 'lucide-react'
import Papa from 'papaparse'
import {
  generateStory as generateStoryAPI,
  saveStory as saveStoryAPI,
  isBackendOnline
} from '../services/api'

// ─── Constants ────────────────────────────────────────────

const AUDIENCES = [
  { label: '💝 Donors',     value: 'Donors' },
  { label: '📈 Investors',  value: 'Investors' },
  { label: '🤝 NGOs',       value: 'NGOs' },
  { label: '🎓 Students',   value: 'Students' },
  { label: '🏥 Healthcare', value: 'Healthcare' },
  { label: '🏛 Government', value: 'Government' },
]

const TONES = [
  { label: 'Emotional & Inspiring', value: 'Emotional & Inspiring' },
  { label: 'Data-driven',           value: 'Data-driven & Analytical' },
  { label: 'Professional',          value: 'Formal & Professional' },
  { label: 'Conversational',        value: 'Conversational & Warm' },
  { label: 'Urgent',                value: 'Urgent & Action-oriented' },
]

const SECTORS = [
  'Education', 'Healthcare', 'Environment',
  'Women Empowerment', 'Livelihood', 'Child Welfare',
  'Rural Development', 'Other',
]

const LOADER_MSGS = [
  'Connecting to AI engine…',
  'Analyzing impact data…',
  'Crafting your narrative…',
  'Adding emotional depth…',
  'Personalizing for your audience…',
  'Polishing the final story…',
]

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--ink2)',
  marginBottom: 6,
}

// ─── Component ────────────────────────────────────────────

export default function Generator() {
  const [searchParams] = useSearchParams()
  const { addStory } = useStories()
  const navigate = useNavigate()

  const [inputMode,      setInputMode]      = useState('form')
  const [audience,       setAudience]       = useState('Donors')
  const [tone,           setTone]           = useState('Emotional & Inspiring')
  const [sector,         setSector]         = useState('Education')
  const [length,         setLength]         = useState('medium')
  const [format,         setFormat]         = useState('Full Narrative')
  const [loading,        setLoading]        = useState(false)
  const [loaderMsg,      setLoaderMsg]      = useState('')
  const [story,          setStory]          = useState(null)
  const [dragover,       setDragover]       = useState(false)
  const [uploadedFile,   setUploadedFile]   = useState(null)
  const [backendStatus,  setBackendStatus]  = useState(null)
  const [rawText,        setRawText]        = useState('')
  const [form,           setForm]           = useState({
    name: '', location: '', beneficiary: '',
    period: '', metrics: '', challenge: '',
    solution: '', humanStory: '',
  })

  const msgRef = useRef(null)

  useEffect(() => {
    const name   = searchParams.get('name')
    const metric = searchParams.get('metric')
    const aud    = searchParams.get('audience')
    if (name) setForm(f => ({ ...f, name, metrics: metric || '' }))
    if (aud)  setAudience(aud)
  }, []) // eslint-disable-line

  useEffect(() => {
    isBackendOnline().then(online => {
      setBackendStatus(online ? 'online' : 'offline')
      if (!online) {
        toast.error('Backend offline — run: cd server && npm run dev', { duration: 6000 })
      }
    })
  }, [])

  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const buildDataString = () => {
    if (inputMode === 'form') {
      if (!form.name.trim()) {
        toast.error('Please enter an organization or project name')
        return null
      }
      return [
        'Organization: ' + form.name,
        'Location: ' + (form.location || 'India'),
        'Beneficiary: ' + (form.beneficiary || 'community members'),
        'Period: ' + (form.period || '2024'),
        'Key Impact Metrics:\n' + (form.metrics || 'significant positive impact'),
        'Challenge: ' + (form.challenge || 'resource constraints'),
        'Solution: ' + (form.solution || 'community-centered interventions'),
        form.humanStory ? 'Human Story: ' + form.humanStory : null,
      ].filter(Boolean).join('\n')
    }
    if (inputMode === 'text') {
      if (!rawText.trim()) {
        toast.error('Please paste some impact data or text')
        return null
      }
      return rawText
    }
    if (inputMode === 'upload') {
      if (!uploadedFile) {
        toast.error('Please upload a file first')
        return null
      }
      return uploadedFile.content || 'Uploaded dataset with impact data'
    }
    return null
  }

  const doGenerate = async () => {
    if (backendStatus === 'offline') {
      toast.error('Start backend first: cd server && npm run dev')
      return
    }
    const data = buildDataString()
    if (!data) return

    setLoading(true)
    setStory(null)
    let mi = 0
    setLoaderMsg(LOADER_MSGS[0])
    msgRef.current = setInterval(() => {
      mi = (mi + 1) % LOADER_MSGS.length
      setLoaderMsg(LOADER_MSGS[mi])
    }, 1000)

    try {
      const response = await generateStoryAPI({ data, audience, tone, length, format, sector })
      if (!response.success || !response.narrative) {
        throw new Error('Invalid response from server')
      }
      const n = response.narrative
      const newStory = {
        id:               'g_' + Date.now(),
        title:            n.title            || 'Impact Story',
        text:             n.story            || '',
        summary:          n.summary          || '',
        keyStats:         Array.isArray(n.keyStats) ? n.keyStats : [],
        callToAction:     n.callToAction     || '',
        socialPost:       n.socialPost       || '',
        emailSubject:     n.emailSubject     || n.title || '',
        keyQuote:         n.keyQuote         || '',
        excerpt:          (n.story || '').slice(0, 140) + '…',
        audience,
        tone:             tone.split(' ')[0],
        sector,
        format,
        sentiment:        parseFloat(n.sentiment)  || 8.0,
        readability:      parseInt(n.readability)  || 70,
        words:            n.wordCount || (n.story || '').split(/\s+/).filter(Boolean).length,
        estimatedReadTime: n.estimatedReadTime || '2 min read',
        tags:             Array.isArray(n.tags) ? n.tags : [],
        date:             new Date().toISOString().split('T')[0],
      }
      setStory(newStory)
      toast.success('Story generated!')
    } catch (err) {
      console.error('Generation error:', err)
      if (err.code === 'INVALID_API_KEY') {
        toast.error('AI API key is invalid. Check server/.env', { duration: 8000 })
      } else if (err.code === 'API_NOT_CONFIGURED') {
        toast.error('Add OPENROUTER_API_KEY to server/.env', { duration: 8000 })
      } else if (err.code === 'RATE_LIMITED') {
        toast.error('Rate limit reached. Wait a moment and retry.')
      } else if (err.name === 'TypeError') {
        toast.error('Cannot reach backend — is it running on port 5000?', { duration: 8000 })
        setBackendStatus('offline')
      } else {
        toast.error(err.message || 'Generation failed. Please try again.')
      }
    } finally {
      clearInterval(msgRef.current)
      setLoading(false)
    }
  }

  /* Quick-action: regenerate with overrides (e.g. shorter / more emotional) */
  const doGenerateWith = async (overrides = {}) => {
    if (backendStatus === 'offline') {
      toast.error('Start backend first: cd server && npm run dev')
      return
    }
    const data = buildDataString()
    if (!data) return

    setLoading(true)
    setStory(null)
    let mi = 0
    setLoaderMsg(LOADER_MSGS[0])
    msgRef.current = setInterval(() => {
      mi = (mi + 1) % LOADER_MSGS.length
      setLoaderMsg(LOADER_MSGS[mi])
    }, 1000)

    try {
      const response = await generateStoryAPI({
        data,
        audience,
        tone: overrides.tone || tone,
        length: overrides.length || length,
        format,
        sector
      })
      if (!response.success || !response.narrative) {
        throw new Error('Invalid response from server')
      }
      const n = response.narrative
      const usedTone = overrides.tone || tone
      const newStory = {
        id:               'g_' + Date.now(),
        title:            n.title            || 'Impact Story',
        text:             n.story            || '',
        summary:          n.summary          || '',
        keyStats:         Array.isArray(n.keyStats) ? n.keyStats : [],
        callToAction:     n.callToAction     || '',
        socialPost:       n.socialPost       || '',
        emailSubject:     n.emailSubject     || n.title || '',
        keyQuote:         n.keyQuote         || '',
        excerpt:          (n.story || '').slice(0, 140) + '\u2026',
        audience,
        tone:             usedTone.split(' ')[0],
        sector,
        format,
        sentiment:        parseFloat(n.sentiment)  || 8.0,
        readability:      parseInt(n.readability)  || 70,
        words:            n.wordCount || (n.story || '').split(/\s+/).filter(Boolean).length,
        estimatedReadTime: n.estimatedReadTime || '2 min read',
        tags:             Array.isArray(n.tags) ? n.tags : [],
        date:             new Date().toISOString().split('T')[0],
      }
      setStory(newStory)
      toast.success(
        overrides.length === 'short' ? 'Shorter version ready!' :
        overrides.tone ? 'Emotional version ready!' :
        'Story generated!'
      )
    } catch (err) {
      console.error('Generation error:', err)
      toast.error(err.message || 'Generation failed. Please try again.')
    } finally {
      clearInterval(msgRef.current)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!story) return
    try {
      await saveStoryAPI(
        {
          title: story.title, story: story.text, summary: story.summary,
          keyStats: story.keyStats, callToAction: story.callToAction,
          socialPost: story.socialPost, emailSubject: story.emailSubject,
          keyQuote: story.keyQuote, sentiment: story.sentiment,
          readability: story.readability, wordCount: story.words, tags: story.tags,
        },
        { audience, tone, sector, format }
      )
    } catch (_) { /* fallback to local only */ }
    addStory(story)
    toast.success('Saved to Story Library!')
  }

  const handleCopy = () => {
    if (!story) return
    navigator.clipboard.writeText(story.text)
      .then(() => toast.success('Copied to clipboard!'))
  }

  const handleExportPDF = async () => {
    if (!story) return
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const margin = 20
    const maxW = pageW - margin * 2
    let y = 25

    const addPage = () => { doc.addPage(); y = 20 }
    const checkPage = (needed = 12) => { if (y + needed > 275) addPage() }

    // Title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(27, 67, 50)
    const titleLines = doc.splitTextToSize(story.title, maxW)
    doc.text(titleLines, margin, y)
    y += titleLines.length * 8 + 4

    // Meta line
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(140, 140, 140)
    doc.text(`${story.audience}  |  ${story.tone}  |  ${story.sector}  |  ${story.words} words  |  ${story.estimatedReadTime || '2 min read'}`, margin, y)
    y += 6

    // Divider
    doc.setDrawColor(210, 210, 210)
    doc.line(margin, y, pageW - margin, y)
    y += 8

    // Body paragraphs
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(30, 30, 30)
    const paragraphs = story.text.split('\n\n')
    paragraphs.forEach(para => {
      const lines = doc.splitTextToSize(para.replace(/\n/g, ' '), maxW)
      lines.forEach(line => {
        checkPage()
        doc.text(line, margin, y)
        y += 5.5
      })
      y += 3
    })

    // Key quote
    if (story.keyQuote) {
      checkPage(20)
      y += 2
      doc.setDrawColor(82, 183, 136)
      doc.setLineWidth(0.8)
      doc.line(margin, y, margin, y + 12)
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(10)
      doc.setTextColor(80, 80, 80)
      const quoteLines = doc.splitTextToSize('"' + story.keyQuote + '"', maxW - 8)
      quoteLines.forEach(line => {
        doc.text(line, margin + 4, y + 4)
        y += 5
      })
      y += 6
    }

    // Key stats
    if (story.keyStats && story.keyStats.length > 0) {
      checkPage(20)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text('KEY STATISTICS', margin, y)
      y += 6
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(50, 50, 50)
      story.keyStats.forEach(stat => {
        checkPage()
        doc.text('\u2192 ' + stat, margin + 2, y)
        y += 5.5
      })
      y += 4
    }

    // Call to action
    if (story.callToAction) {
      checkPage(16)
      doc.setFillColor(27, 67, 50)
      doc.roundedRect(margin, y, maxW, 12, 2, 2, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(255, 255, 255)
      doc.text('\u2192 ' + story.callToAction, margin + 6, y + 8)
      y += 18
    }

    // Footer
    checkPage(14)
    y = Math.max(y, 260)
    doc.setDrawColor(230, 230, 230)
    doc.line(margin, y, pageW - margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(170, 170, 170)
    doc.text('Generated by NarrAIte \u2014 AI Impact Narrative Generator', margin, y)
    doc.text(story.date, pageW - margin, y, { align: 'right' })

    const filename = story.title.slice(0, 50).replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_') + '.pdf'
    doc.save(filename)
    toast.success('PDF downloaded!')
  }

  const handleExportTXT = () => {
    if (!story) return
    const parts = [
      story.title,
      '='.repeat(story.title.length),
      '',
      story.text,
      '',
    ]
    if (story.keyQuote) {
      parts.push('Key Quote:')
      parts.push('"' + story.keyQuote + '"')
      parts.push('')
    }
    if (story.keyStats && story.keyStats.length > 0) {
      parts.push('Key Statistics:')
      story.keyStats.forEach(s => parts.push('  \u2022 ' + s))
      parts.push('')
    }
    if (story.callToAction) {
      parts.push('Call to Action:')
      parts.push(story.callToAction)
      parts.push('')
    }
    parts.push('\u2500'.repeat(50))
    parts.push('Audience: ' + story.audience + '  |  Tone: ' + story.tone + '  |  Sector: ' + story.sector)
    parts.push('Sentiment: ' + story.sentiment + '/10  |  Readability: ' + story.readability + '  |  Words: ' + story.words)
    parts.push('Generated by NarrAIte on ' + story.date)

    const blob = new Blob([parts.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = story.title.slice(0, 50).replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_') + '.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('TXT file downloaded!')
  }

  const handleExportWord = () => {
    if (!story) return
    const statRows = story.keyStats && story.keyStats.length > 0
      ? '\n\nKey Statistics:\n' + story.keyStats.map(s => '  \u2022 ' + s).join('\n')
      : ''
    const quoteBlock = story.keyQuote
      ? '\n\n"' + story.keyQuote + '"'
      : ''
    const ctaBlock = story.callToAction
      ? '\n\nCall to Action: ' + story.callToAction
      : ''

    const content = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='UTF-8'/><style>
@page { margin: 1in; }
body { font-family: 'Calibri', 'Segoe UI', sans-serif; font-size: 12pt; line-height: 1.8; color: #222; }
h1 { font-size: 22pt; color: #1B4332; margin-bottom: 8pt; }
.meta { font-size: 10pt; color: #888; margin-bottom: 20pt; padding-bottom: 10pt; border-bottom: 2px solid #D8F3DC; }
.badge { display: inline-block; padding: 2px 10px; border-radius: 4px; background: #D8F3DC; color: #1B4332; font-size: 9pt; margin-right: 6px; font-weight: bold; }
p { margin-bottom: 10pt; }
blockquote { margin: 14pt 0; padding: 10pt 16pt; border-left: 3px solid #52B788; background: #f4faf6; font-style: italic; }
.stats { background: #f5f5f5; padding: 12pt; border-radius: 4pt; margin: 14pt 0; }
.stats h3 { font-size: 10pt; color: #555; text-transform: uppercase; margin-bottom: 6pt; }
.cta { margin-top: 18pt; padding: 10pt 14pt; background: #1B4332; color: #fff; border-radius: 4pt; font-weight: 600; }
.footer { margin-top: 36pt; padding-top: 10pt; border-top: 1px solid #eee; font-size: 9pt; color: #aaa; }
</style></head><body>
<h1>${story.title}</h1>
<div class="meta">
<span class="badge">${story.audience}</span>
<span class="badge" style="background:#DBEAFE;color:#1E3A8A">${story.tone}</span>
<span class="badge" style="background:#EDE9FE;color:#5B21B6">${story.sector}</span>
&nbsp;&nbsp;${story.words} words &middot; ${story.estimatedReadTime || '2 min read'}
</div>
${story.text.split('\n\n').map(p => '<p>' + p.replace(/\n/g, '<br/>') + '</p>').join('')}
${story.keyQuote ? '<blockquote>"' + story.keyQuote + '"</blockquote>' : ''}
${story.keyStats && story.keyStats.length > 0 ? '<div class="stats"><h3>Key Statistics</h3><ul>' + story.keyStats.map(s => '<li>' + s + '</li>').join('') + '</ul></div>' : ''}
${story.callToAction ? '<div class="cta">&rarr; ' + story.callToAction + '</div>' : ''}
<div class="footer">Generated by NarrAIte &mdash; AI Impact Narrative Generator &middot; ${story.date}</div>
</body></html>`

    const blob = new Blob(['\ufeff' + content], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = story.title.slice(0, 50).replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_') + '.doc'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Word document downloaded!')
  }

  const handleFile = (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const rows    = result.data.slice(0, 3)
          const content = rows
            .map(row =>
              Object.entries(row)
                .filter(([, v]) => v)
                .map(([k, v]) => k + ': ' + v)
                .join('\n')
            )
            .join('\n\n')
          setUploadedFile({ name: file.name, size: file.size, content, rawFile: file })
          toast.success(file.name + ' — ' + result.data.length + ' records detected')
        },
      })
    } else {
      setUploadedFile({ name: file.name, size: file.size, content: '', rawFile: file })
      toast.success(file.name + ' uploaded')
    }
  }

  const readabilityLabel = (score) => {
    if (score > 70) return 'Easy to Read'
    if (score > 50) return 'Moderate'
    return 'Advanced'
  }

  const clearAll = () => {
    setForm({ name: '', location: '', beneficiary: '', period: '', metrics: '', challenge: '', solution: '', humanStory: '' })
    setRawText('')
    setUploadedFile(null)
    setStory(null)
  }

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <div className="animate-slide-up" style={{ maxWidth: 860, margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 26 }}>Story Generator</h2>
            <p style={{ fontSize: 14, color: 'var(--ink3)', marginTop: 4 }}>
              Craft emotionally resonant impact narratives with real AI
            </p>
          </div>

          {backendStatus && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '6px 14px', borderRadius: 20,
              fontSize: 12, fontWeight: 500,
              background: backendStatus === 'online' ? 'var(--accentL)' : '#FEE2E2',
              color:      backendStatus === 'online' ? 'var(--accent)'  : '#991B1B',
              border: '1px solid ' + (backendStatus === 'online' ? 'rgba(82,183,136,0.3)' : '#FECACA'),
            }}>
              {backendStatus === 'online'
                ? <><CheckCircle2 size={13} /> Backend Online</>
                : <><WifiOff size={13} /> Backend Offline</>
              }
            </div>
          )}
        </div>
      </div>

      {/* Offline warning */}
      {backendStatus === 'offline' && (
        <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12 }}>
          <AlertCircle size={18} color="#B45309" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#92400E', marginBottom: 6 }}>Backend server not running</div>
            <div style={{ fontSize: 12, color: '#B45309', lineHeight: 1.8 }}>
              Open a second terminal and run:<br />
              <code style={{ background: 'rgba(0,0,0,0.08)', padding: '2px 8px', borderRadius: 4 }}>
                cd server &amp;&amp; cp .env.example .env
              </code>
              <br />
               Add your API key to <code style={{ background: 'rgba(0,0,0,0.08)', padding: '2px 8px', borderRadius: 4 }}>server/.env</code>, then:
              <br />
              <code style={{ background: 'rgba(0,0,0,0.08)', padding: '2px 8px', borderRadius: 4 }}>
                npm install &amp;&amp; npm run dev
              </code>
            </div>
          </div>
        </div>
      )}

      {/* ── DATA INPUT CARD ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="font-display" style={{ fontSize: 17, marginBottom: 16 }}>Data Input</div>

        {/* Mode tabs */}
        <div style={{ display: 'flex', background: 'var(--cream2)', borderRadius: 10, padding: 3, marginBottom: 20, maxWidth: 400 }}>
          {[['form', 'Manual Form'], ['text', 'Paste Text'], ['upload', 'Upload File']].map(([m, l]) => (
            <button
              key={m}
              onClick={() => setInputMode(m)}
              style={{
                flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s',
                background: inputMode === m ? 'var(--card)'       : 'transparent',
                color:      inputMode === m ? 'var(--ink)'        : 'var(--ink3)',
                boxShadow:  inputMode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Manual form */}
        {inputMode === 'form' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Organization / Project Name *</label>
                <input className="form-input" value={form.name} onChange={e => setF('name', e.target.value)} placeholder="Asha Foundation – Education Initiative" />
              </div>
              <div>
                <label style={labelStyle}>Location / Region</label>
                <input className="form-input" value={form.location} onChange={e => setF('location', e.target.value)} placeholder="Mumbai, Maharashtra" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Primary Beneficiary</label>
                <input className="form-input" value={form.beneficiary} onChange={e => setF('beneficiary', e.target.value)} placeholder="1,200 underprivileged children" />
              </div>
              <div>
                <label style={labelStyle}>Impact Period</label>
                <input className="form-input" value={form.period} onChange={e => setF('period', e.target.value)} placeholder="Jan – Dec 2024" />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Key Impact Metrics *</label>
              <textarea
                className="form-textarea"
                value={form.metrics}
                onChange={e => setF('metrics', e.target.value)}
                style={{ minHeight: 90 }}
                placeholder={'• 500 children received quality education\n• Dropout rate reduced by 40%\n• 12 new classrooms built\n• 150 teachers trained'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Challenge / Problem</label>
                <input className="form-input" value={form.challenge} onChange={e => setF('challenge', e.target.value)} placeholder="Lack of access to quality schools" />
              </div>
              <div>
                <label style={labelStyle}>Solution Implemented</label>
                <input className="form-input" value={form.solution} onChange={e => setF('solution', e.target.value)} placeholder="Mobile learning centers + digital labs" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                Beneficiary Story{' '}
                <span style={{ color: 'var(--ink4)', fontWeight: 400 }}>(optional — adds a powerful human angle)</span>
              </label>
              <textarea
                className="form-textarea"
                value={form.humanStory}
                onChange={e => setF('humanStory', e.target.value)}
                style={{ minHeight: 70 }}
                placeholder="Riya, 10, was the first in her family to attend school. When she received her first textbook…"
              />
            </div>
          </div>
        )}

        {/* Paste text */}
        {inputMode === 'text' && (
          <div>
            <label style={labelStyle}>Paste your impact data, report excerpt, or notes</label>
            <textarea
              className="form-textarea"
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              style={{ minHeight: 220 }}
              placeholder={'Paste any unstructured text, bullet points, or data here.\n\nExample:\n• 500 girls returned to education\n• 78% attendance increase\n• 15 villages served'}
            />
          </div>
        )}

        {/* Upload file */}
        {inputMode === 'upload' && (
          <div>
            <div
              className={'upload-zone' + (dragover ? ' dragover' : '')}
              onClick={() => document.getElementById('gen-file-input').click()}
              onDragOver={e => { e.preventDefault(); setDragover(true) }}
              onDragLeave={() => setDragover(false)}
              onDrop={e => { e.preventDefault(); setDragover(false); handleFile(e.dataTransfer.files[0]) }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>📂</div>
              <div style={{ fontSize: 14, color: 'var(--ink2)', marginBottom: 4, fontWeight: 500 }}>
                Drop your file here or click to browse
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink4)' }}>
                CSV, Excel (.xlsx), JSON supported · Max 10 MB
              </div>
              <input
                type="file"
                id="gen-file-input"
                style={{ display: 'none' }}
                accept=".csv,.xlsx,.xls,.json"
                onChange={e => handleFile(e.target.files[0])}
              />
            </div>

            {uploadedFile && (
              <div style={{ marginTop: 12, padding: '12px 14px', background: 'var(--accentL)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(82,183,136,0.3)' }}>
                <span style={{ fontSize: 20 }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{uploadedFile.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink3)' }}>
                    {(uploadedFile.size / 1024).toFixed(1)} KB — story generated from first record
                  </div>
                </div>
                <button onClick={() => setUploadedFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink4)' }}>
                  <X size={14} />
                </button>
              </div>
            )}

            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ink4)' }}>
              💡 Upload a CSV with your organization data to auto-fill the form fields.
            </div>
          </div>
        )}
      </div>

      {/* ── PERSONALIZATION CARD ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="font-display" style={{ fontSize: 17, marginBottom: 16 }}>Personalization</div>

        <div className="generator-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 10 }}>Target Audience *</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {AUDIENCES.map(a => (
                <button
                  key={a.value}
                  onClick={() => setAudience(a.value)}
                  className={'tone-chip' + (audience === a.value ? ' selected' : '')}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 10 }}>Narrative Tone</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TONES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={'tone-chip' + (tone === t.value ? ' selected' : '')}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '0 0 20px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div>
            <label style={labelStyle}>Story Length</label>
            <select className="form-select" value={length} onChange={e => setLength(e.target.value)}>
              <option value="short">Short (150–200 words)</option>
              <option value="medium">Medium (300–400 words)</option>
              <option value="long">Long (600–800 words)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Sector</label>
            <select className="form-select" value={sector} onChange={e => setSector(e.target.value)}>
              {SECTORS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Output Format</label>
            <select className="form-select" value={format} onChange={e => setFormat(e.target.value)}>
              {['Full Narrative', 'Social Media Post', 'Email Newsletter', 'Executive Summary', 'Press Release'].map(f => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── ACTION ROW ── */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginBottom: 24 }}>
        <button className="btn btn-outline" onClick={clearAll}>Clear</button>
        <button
          className="btn btn-primary btn-lg"
          onClick={doGenerate}
          disabled={loading}
          style={{ gap: 8, minWidth: 220, justifyContent: 'center', opacity: loading ? 0.85 : 1 }}
        >
          {loading
            ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16, borderTopColor: 'rgba(255,255,255,0.8)' }} />
                {loaderMsg}
              </>
            )
            : (
              <>
                <Sparkles size={16} />
                Generate Story with AI
              </>
            )
          }
        </button>
      </div>

      {/* ── OUTPUT CARD ── */}
      {story && (
        <div className="card animate-slide-up" style={{ marginBottom: 24 }}>

          {/* Output header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div className="font-display" style={{ fontSize: 17 }}>Generated Story</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>
                {story.audience} · {story.tone} · {story.sector}
                {story.estimatedReadTime ? ' · ' + story.estimatedReadTime : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-outline btn-sm" onClick={() => doGenerateWith({ length: 'short' })} disabled={loading} style={{ gap: 6 }}>
                <Minimize2 size={13} /> Shorter
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => doGenerateWith({ tone: 'Emotional & Inspiring' })} disabled={loading} style={{ gap: 6, color: 'var(--accent3)' }}>
                <Heart size={13} /> Emotional
              </button>
              <button className="btn btn-outline btn-sm" onClick={doGenerate} disabled={loading} style={{ gap: 6 }}>
                <RefreshCw size={13} /> Regenerate
              </button>
              <button className="btn btn-outline btn-sm" onClick={handleCopy} style={{ gap: 6 }}>
                <Copy size={13} /> Copy
              </button>
            </div>
          </div>

          {/* Story box */}
          <div className="story-box">
            <h2 className="font-display" style={{ fontSize: 22, marginBottom: 12, color: 'var(--ink)', lineHeight: 1.3 }}>
              {story.title}
            </h2>

            {/* Audience / tone / sector tags */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
              {[story.audience, story.tone, story.sector].map(tag => (
                <span key={tag} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: 'var(--accentL)', color: 'var(--accent)', fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
              {story.tags && story.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: 'var(--cream3)', color: 'var(--ink3)' }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Story text rendered as readable paragraphs — NOT JSON */}
            <div style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--ink2)' }}>
              {story.text.split('\n\n').map((para, i) => (
                <p key={i} style={{ marginBottom: i < story.text.split('\n\n').length - 1 ? 16 : 0 }}>
                  {para}
                </p>
              ))}
            </div>

            {/* Key quote */}
            {story.keyQuote && (
              <div style={{ marginTop: 20, padding: '14px 18px', borderLeft: '3px solid var(--accent3)', background: 'rgba(82,183,136,0.06)', borderRadius: '0 8px 8px 0', fontStyle: 'italic', fontSize: 14, color: 'var(--accent2)' }}>
                "{story.keyQuote}"
              </div>
            )}
          </div>

          {/* Key stats */}
          {story.keyStats && story.keyStats.length > 0 && (
            <div style={{ margin: '16px 0', padding: '14px 16px', background: 'var(--cream2)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                Key Statistics
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {story.keyStats.map((stat, i) => (
                  <div key={i} style={{ fontSize: 12, color: 'var(--ink2)', padding: '6px 12px', background: 'var(--card)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    → {stat}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to action */}
          {story.callToAction && (
            <div style={{ margin: '0 0 16px', padding: '12px 16px', background: 'var(--accentL)', borderRadius: 10, fontSize: 13, color: 'var(--accent)', fontWeight: 500, border: '1px solid rgba(82,183,136,0.2)' }}>
              💡 {story.callToAction}
            </div>
          )}

          {/* Quality metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '16px 0' }}>
            {[
              { label: 'Sentiment Score', value: story.sentiment.toFixed(1) + '/10', pct: story.sentiment * 10 },
              { label: 'Readability (FK)', value: story.readability, pct: story.readability, sub: readabilityLabel(story.readability) },
              { label: 'Word Count', value: story.words, pct: Math.min((story.words / 800) * 100, 100), sub: story.date },
            ].map(m => (
              <div key={m.label} style={{ padding: '14px 16px', background: 'var(--cream2)', borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--ink4)', marginBottom: 4 }}>{m.label}</div>
                <div className="font-display" style={{ fontSize: 24, color: 'var(--ink)' }}>{m.value}</div>
                <div className="progress-bar" style={{ marginTop: 8 }}>
                  <div className="progress-fill" style={{ width: m.pct + '%' }} />
                </div>
                {m.sub && <div style={{ fontSize: 10, color: 'var(--ink4)', marginTop: 4 }}>{m.sub}</div>}
              </div>
            ))}
          </div>

          {/* Export row */}
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 16px' }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--ink4)', marginRight: 4 }}>Export as:</span>
            <button className="btn btn-outline btn-sm" onClick={handleExportPDF}  style={{ gap: 6 }}><FileText size={13} /> PDF</button>
            <button className="btn btn-outline btn-sm" onClick={handleExportTXT}  style={{ gap: 6 }}><Download size={13} /> TXT</button>
            <button className="btn btn-outline btn-sm" onClick={handleExportWord} style={{ gap: 6 }}><File size={13} /> Word</button>
            <div style={{ flex: 1 }} />
            <button className="btn btn-primary btn-sm" onClick={handleSave} style={{ gap: 6 }}>
              <Save size={13} /> Save to Library
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
