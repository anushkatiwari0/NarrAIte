import React, { useState, useEffect } from 'react'
import { useStories } from '../App'
import { fetchAnalytics } from '../services/api'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import { RefreshCw } from 'lucide-react'

const TT = { background: '#0D0D0D', border: 'none', borderRadius: 10, fontSize: 12, color: '#fff' }

const TONE_COLORS = ['#52B788', '#2D6A4F', '#1B4332', '#95D5B2', '#D8F3DC', '#74C69D']

export default function Analytics() {
  const { stories } = useStories()
  const [serverStats, setServerStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetchAnalytics()
      if (res.success) setServerStats(res.stats)
    } catch {
      // Use local story data as fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAnalytics() }, [])

  // ── Derive all stats from real stories ──────────────────
  const total = stories.length

  const avgSentiment = total
    ? (stories.reduce((a, s) => a + (parseFloat(s.sentiment) || 0), 0) / total).toFixed(1)
    : '0.0'

  const avgReadability = total
    ? Math.round(stories.reduce((a, s) => a + (parseInt(s.readability) || 0), 0) / total)
    : 0

  const totalWords = stories.reduce((a, s) => a + (parseInt(s.words) || 0), 0)

  // ── Monthly trend from real story dates ─────────────────
  const buildMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const buckets = {}
    months.forEach(m => { buckets[m] = { stories: 0, sentimentSum: 0 } })

    stories.forEach(s => {
      if (!s.date) return
      const d = new Date(s.date)
      const m = months[d.getMonth()]
      if (m) {
        buckets[m].stories += 1
        buckets[m].sentimentSum += parseFloat(s.sentiment) || 0
      }
    })

    return months.map(m => ({
      month: m,
      stories: buckets[m].stories,
      sentiment: buckets[m].stories > 0
        ? parseFloat((buckets[m].sentimentSum / buckets[m].stories).toFixed(1))
        : 0
    }))
  }

  const monthlyData = buildMonthlyData()

  // ── Audience distribution from real stories ─────────────
  const buildAudienceData = () => {
    const counts = {}
    stories.forEach(s => {
      const a = s.audience || 'Other'
      counts[a] = (counts[a] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({ name, value, color: TONE_COLORS[i % TONE_COLORS.length] }))
  }

  const audienceData = buildAudienceData()

  // ── Sector distribution from real stories ───────────────
  const buildSectorData = () => {
    const counts = {}
    stories.forEach(s => {
      const sec = s.sector || 'Other'
      counts[sec] = (counts[sec] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([sector, count]) => ({ sector, stories: count }))
  }

  const sectorData = buildSectorData()

  // ── Radar: real averages ────────────────────────────────
  const radarData = [
    { metric: 'Sentiment', score: parseFloat(avgSentiment) * 10 },
    { metric: 'Readability', score: avgReadability },
    { metric: 'Engagement', score: total ? Math.min(Math.round(parseFloat(avgSentiment) * 9.5), 100) : 0 },
    { metric: 'Clarity', score: total ? Math.min(Math.round(avgReadability * 1.05), 100) : 0 },
    { metric: 'Empathy', score: total ? Math.min(Math.round(parseFloat(avgSentiment) * 10.2), 100) : 0 },
    { metric: 'Action', score: total ? Math.round(stories.filter(s => s.callToAction).length / total * 100) : 0 },
  ]

  // ── Tone distribution ───────────────────────────────────
  const toneCounts = {}
  stories.forEach(s => {
    const t = s.tone || 'Other'
    toneCounts[t] = (toneCounts[t] || 0) + 1
  })

  // ── Empty state ─────────────────────────────────────────
  const isEmpty = total === 0

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-display" style={{ fontSize: 26 }}>Analytics</h2>
          <p style={{ fontSize: 14, color: 'var(--ink3)', marginTop: 4 }}>
            {isEmpty ? 'Generate some stories to see real analytics here' : `Insights from ${total} generated ${total === 1 ? 'story' : 'stories'}`}
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={loadAnalytics} disabled={loading} style={{ gap: 6 }}>
          <RefreshCw size={13} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} /> Refresh
        </button>
      </div>

      {isEmpty ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px', margin: '40px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
          <div className="font-display" style={{ fontSize: 24, marginBottom: 12 }}>No data yet</div>
          <p style={{ fontSize: 15, color: 'var(--ink3)', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
            Your dashboard is currently empty. Head over to the Generator to create and save your first impact story. Once you do, your analytics and insights will appear here instantly!
          </p>
        </div>
      ) : (
        <>
          {/* Top stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Stories', value: total, delta: `${totalWords.toLocaleString()} total words`, up: true },
              { label: 'Avg Sentiment', value: avgSentiment + '/10', delta: parseFloat(avgSentiment) >= 8 ? '✨ Excellent' : parseFloat(avgSentiment) >= 6 ? '👍 Good' : '📈 Improving', up: parseFloat(avgSentiment) >= 7 },
              { label: 'Avg Readability (FK)', value: avgReadability, delta: avgReadability >= 70 ? 'Easy to read' : avgReadability >= 50 ? 'Moderate' : 'Complex', up: null },
              { label: 'Audiences Reached', value: audienceData.length, delta: audienceData.map(a => a.name).slice(0, 3).join(', '), up: true },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize: 11, color: 'var(--ink4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>{s.label}</div>
                <div className="font-display" style={{ fontSize: 28 }}>{s.value}</div>
                <div style={{ fontSize: 11, marginTop: 6, color: s.up === null ? 'var(--ink4)' : s.up ? '#16a34a' : '#dc2626' }}>{s.delta}</div>
              </div>
            ))}
          </div>
          {/* Area + Pie */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, marginBottom: 16 }}>
            <div className="card">
              <div className="font-display" style={{ fontSize: 17, marginBottom: 4 }}>Story Volume by Month</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 16 }}>Based on your generated stories</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyData.filter(d => d.stories > 0).length > 0 ? monthlyData : monthlyData}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#52B788" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#52B788" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9a9a9a' }} />
                  <YAxis hide />
                  <Tooltip contentStyle={TT} />
                  <Area type="monotone" dataKey="stories" stroke="#52B788" fill="url(#g1)" strokeWidth={2.5} name="Stories" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="font-display" style={{ fontSize: 17, marginBottom: 4 }}>Audience Mix</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 12 }}>Story distribution</div>
              {audienceData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={110}>
                    <PieChart>
                      <Pie data={audienceData} cx="50%" cy="50%" innerRadius={28} outerRadius={52} paddingAngle={3} dataKey="value">
                        {audienceData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip contentStyle={TT} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
                    {audienceData.map(d => (
                      <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                          <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{d.name}</span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600 }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--ink4)', fontSize: 12 }}>No data</div>
              )}
            </div>
          </div>

          {/* Sector + Radar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="card">
              <div className="font-display" style={{ fontSize: 17, marginBottom: 4 }}>Stories by Sector</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 16 }}>Volume breakdown</div>
              {sectorData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={sectorData} layout="vertical" barSize={14}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="sector" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9a9a9a' }} width={90} />
                    <Tooltip contentStyle={TT} />
                    <Bar dataKey="stories" fill="#52B788" radius={[0, 5, 5, 0]} name="Stories" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink4)', fontSize: 12 }}>No data</div>
              )}
            </div>

            <div className="card">
              <div className="font-display" style={{ fontSize: 17, marginBottom: 4 }}>Story Quality Radar</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 8 }}>Computed from your stories</div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#9a9a9a' }} />
                  <Radar dataKey="score" stroke="#52B788" fill="#52B788" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip contentStyle={TT} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment trend + Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card">
              <div className="font-display" style={{ fontSize: 17, marginBottom: 4 }}>Sentiment Score Trend</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 16 }}>Monthly average (1–10 scale)</div>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9a9a9a' }} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9a9a9a' }} width={25} />
                  <Tooltip contentStyle={TT} />
                  <Line type="monotone" dataKey="sentiment" stroke="#52B788" strokeWidth={2.5} dot={{ r: 4, fill: '#52B788', strokeWidth: 0 }} name="Sentiment" connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="font-display" style={{ fontSize: 17, marginBottom: 16 }}>Summary</div>
              {[
                { label: 'Total stories generated', value: String(total) },
                { label: 'Total words written', value: totalWords.toLocaleString() },
                { label: 'Unique audiences', value: String(audienceData.length) },
                { label: 'Unique sectors', value: String(sectorData.length) },
                { label: 'Avg readability score', value: avgReadability + ' / 100' },
                { label: 'Stories with call-to-action', value: stories.filter(s => s.callToAction).length + ' / ' + total },
              ].map(m => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{m.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
