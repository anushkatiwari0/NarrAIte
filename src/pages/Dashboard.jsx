import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useStories } from '../App'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Sparkles, TrendingUp, BookOpen, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const TONE_COLORS = ['#52B788', '#2D6A4F', '#1B4332', '#95D5B2', '#D8F3DC', '#74C69D']

export default function Dashboard() {
  const { user } = useAuth()
  const { stories } = useStories()
  const navigate = useNavigate()
  const [quickName, setQuickName] = useState('')
  const [quickMetric, setQuickMetric] = useState('')
  const [quickAudience, setQuickAudience] = useState('Donors')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'there'

  const total = stories.length
  const isEmpty = total === 0

  const avgSentiment = total
    ? (stories.reduce((a, s) => a + (s.sentiment || 0), 0) / total).toFixed(1)
    : '—'
    
  const avgReadability = total
    ? Math.round(stories.reduce((a, s) => a + (parseInt(s.readability) || 0), 0) / total)
    : '—'

  const handleQuickGenerate = () => {
    if (!quickName.trim()) { toast.error('Please enter an organization name'); return }
    navigate(`/app/generator?name=${encodeURIComponent(quickName)}&metric=${encodeURIComponent(quickMetric)}&audience=${encodeURIComponent(quickAudience)}`)
  }

  // Build audience data
  const buildAudienceData = () => {
    const counts = {}
    stories.forEach(s => {
      const a = s.audience || 'Other'
      counts[a] = (counts[a] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value], i) => ({ name, value, color: TONE_COLORS[i % TONE_COLORS.length] }))
      .sort((a, b) => b.value - a.value)
  }
  const audienceData = buildAudienceData()

  // Build simple week data (mocked to just show volume if needed, or real)
  const buildWeekData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const data = days.map(day => ({ day, stories: 0 }))
    stories.forEach(s => {
      if (!s.date) return
      const d = new Date(s.date)
      let dayIndex = d.getDay() - 1 // 0 = Mon
      if (dayIndex < 0) dayIndex = 6
      if (data[dayIndex]) data[dayIndex].stories += 1
    })
    return data
  }
  const weekData = buildWeekData()

  return (
    <div className="animate-slide-up">
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 'clamp(22px, 4vw, 28px)', letterSpacing: '-0.5px' }}>
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink3)', marginTop: 4 }}>
          Here's what's happening with your impact narratives today.
        </p>
      </div>

      {isEmpty ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px', margin: '20px 0 40px' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✨</div>
          <div className="font-display" style={{ fontSize: 24, marginBottom: 12 }}>No data yet</div>
          <p style={{ fontSize: 15, color: 'var(--ink3)', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
            Welcome to NarrAIte! Your dashboard is currently empty. Use the Quick Generate tool below or head over to the Generator to create your first impact story.
          </p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Total Stories',  value: total, delta: 'Total generated',       up: true,  icon: <BookOpen size={18}/> },
              { label: 'Avg Sentiment',  value: avgSentiment + '/10',  delta: 'Average score',       up: true,  icon: <TrendingUp size={18}/> },
              { label: 'Avg Readability',value: avgReadability,        delta: 'Flesch-Kincaid score',  up: true,  icon: <Sparkles size={18}/> },
            ].map((stat, i) => (
              <div key={i} className="stat-card animate-slide-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--ink4)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accentL)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                    {stat.icon}
                  </div>
                </div>
                <div className="font-display" style={{ fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-1px', color: 'var(--ink)', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: '#16a34a', marginTop: 6 }}>
                  {stat.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14, marginBottom: 20 }}>
            {/* Bar Chart */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div className="font-display" style={{ fontSize: 16 }}>Stories Generated</div>
                  <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>By day of week</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={weekData} barSize={24}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9a9a9a' }}/>
                  <YAxis hide/>
                  <Tooltip
                    contentStyle={{ background: '#0D0D0D', border: 'none', borderRadius: 10, fontSize: 12, color: '#fff' }}
                    cursor={{ fill: 'rgba(82,183,136,0.06)' }}
                  />
                  <Bar dataKey="stories" fill="#52B788" radius={[5, 5, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="card">
              <div className="font-display" style={{ fontSize: 16, marginBottom: 4 }}>Audience Mix</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 10 }}>Story distribution</div>
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie data={audienceData} cx="50%" cy="50%" innerRadius={28} outerRadius={46} paddingAngle={3} dataKey="value">
                    {audienceData.map((d, i) => <Cell key={i} fill={d.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0D0D0D', border: 'none', borderRadius: 8, fontSize: 11, color: '#fff' }}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
                {audienceData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: d.color, flexShrink: 0 }}/>
                      <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink2)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recent stories + Quick generate */}
      <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        
        {/* Recent stories */}
        {!isEmpty && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="font-display" style={{ fontSize: 16 }}>Recent Stories</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/library')} style={{ gap: 4 }}>
                View all <ArrowRight size={13}/>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {stories.slice(0, 3).map(s => (
                <div key={s.id} className="card-hover" onClick={() => navigate('/app/library')}
                  style={{ padding: '11px 13px', borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4, flex: 1 }}>{s.title}</div>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'var(--accentL)', color: 'var(--accent)', flexShrink: 0, fontWeight: 500 }}>
                      {s.audience}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink4)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {s.excerpt}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 7 }}>
                    <span style={{ fontSize: 11, color: 'var(--ink4)' }}>💫 {s.sentiment?.toFixed(1)}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink4)' }}>📖 {s.readability}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink4)' }}>📝 {s.words}w</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick generate */}
        <div className="card">
          <div className="font-display" style={{ fontSize: 16, marginBottom: 4 }}>Quick Generate</div>
          <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 16 }}>Jump-start a new story in seconds</div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 5 }}>
              Organization / Project name
            </label>
            <input className="form-input" value={quickName} onChange={e => setQuickName(e.target.value)}
              placeholder="e.g. Asha Foundation" onKeyDown={e => e.key === 'Enter' && handleQuickGenerate()}/>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 5 }}>
              Key impact metric
            </label>
            <input className="form-input" value={quickMetric} onChange={e => setQuickMetric(e.target.value)}
              placeholder="e.g. 500 children educated"/>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 5 }}>
              Target audience
            </label>
            <select className="form-select" value={quickAudience} onChange={e => setQuickAudience(e.target.value)}>
              {['Donors', 'Investors', 'NGOs', 'Students', 'Healthcare', 'Government'].map(a => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleQuickGenerate}
            style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
            <Sparkles size={14}/> Generate Story
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .charts-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 400px) {
          .stat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
