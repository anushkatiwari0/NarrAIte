import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStories } from '../App'
import { Search, Plus, Trash2, Copy, Download, X, Share2, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

const AUDIENCES = ['', 'Donors', 'Investors', 'NGOs', 'Students', 'Healthcare', 'Government']
const SECTORS = ['', 'Education', 'Healthcare', 'Environment', 'Women Empowerment', 'Livelihood', 'Child Welfare']

const BADGE_COLORS = {
  Donors: { bg: '#D8F3DC', color: '#1B4332' },
  Investors: { bg: '#DBEAFE', color: '#1E3A8A' },
  NGOs: { bg: '#EDE9FE', color: '#5B21B6' },
  Students: { bg: '#FEF3C7', color: '#B45309' },
  Healthcare: { bg: '#FCE7F3', color: '#9D174D' },
  Government: { bg: '#F3F4F6', color: '#374151' },
}

export default function Library() {
  const { stories, deleteStory } = useStories()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterAudience, setFilterAudience] = useState('')
  const [filterSector, setFilterSector] = useState('')
  const [selected, setSelected] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = stories.filter(s => {
    const q = search.toLowerCase()
    const matchQ = !q || s.title.toLowerCase().includes(q) || s.excerpt.toLowerCase().includes(q) || s.sector?.toLowerCase().includes(q)
    const matchA = !filterAudience || s.audience === filterAudience
    const matchS = !filterSector || s.sector === filterSector
    return matchQ && matchA && matchS
  })

  const handleCopy = (s, e) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(s.text).then(() => toast.success('Copied!'))
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    setConfirmDelete(id)
  }

  const confirmDel = () => {
    deleteStory(confirmDelete)
    setConfirmDelete(null)
    if (selected?.id === confirmDelete) setSelected(null)
    toast.success('Story deleted')
  }

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 className="font-display" style={{ fontSize: 26 }}>Story Library</h2>
          <p style={{ fontSize: 14, color: 'var(--ink3)', marginTop: 4 }}>
            {stories.length} impact {stories.length === 1 ? 'narrative' : 'narratives'} saved
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/app/generator')} style={{ gap: 8 }}>
          <Plus size={15}/> New Story
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, flex: 1, maxWidth: 280 }}>
          <Search size={14} color="var(--ink4)"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stories…"
            style={{ border: 'none', background: 'none', outline: 'none', fontSize: 13, fontFamily: 'DM Sans, sans-serif', flex: 1, color: 'var(--ink)' }}/>
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink4)', display: 'flex' }}><X size={13}/></button>}
        </div>
        <select className="form-select" value={filterAudience} onChange={e => setFilterAudience(e.target.value)} style={{ width: 'auto', minWidth: 140 }}>
          <option value="">All audiences</option>
          {AUDIENCES.slice(1).map(a => <option key={a}>{a}</option>)}
        </select>
        <select className="form-select" value={filterSector} onChange={e => setFilterSector(e.target.value)} style={{ width: 'auto', minWidth: 140 }}>
          <option value="">All sectors</option>
          {SECTORS.slice(1).map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--ink3)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--ink2)', marginBottom: 8 }}>
            {stories.length === 0 ? 'No stories yet' : 'No stories match your filters'}
          </div>
          <div style={{ fontSize: 14, marginBottom: 24 }}>
            {stories.length === 0 ? 'Generate your first impact narrative' : 'Try adjusting your search or filters'}
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/app/generator')}>Generate Story</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(s => {
            const colors = BADGE_COLORS[s.audience] || { bg: '#F3F4F6', color: '#374151' }
            return (
              <div key={s.id}
                onClick={() => setSelected(s)}
                className="card card-hover"
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, color: 'var(--ink)', flex: 1 }}>
                    {s.title}
                  </div>
                  <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, background: colors.bg, color: colors.color, fontWeight: 600, flexShrink: 0 }}>
                    {s.audience}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'var(--blueL, #DBEAFE)', color: '#1E3A8A' }}>{s.tone}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#EDE9FE', color: '#5B21B6' }}>{s.sector}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink4)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 14 }}>
                  {s.excerpt}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 11, color: 'var(--ink4)' }}>💫 {s.sentiment?.toFixed(1)}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink4)' }}>📖 {s.readability}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink4)' }}>📝 {s.words}w</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={e => handleCopy(s, e)}
                      style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--cream2)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink3)' }}>
                      <Copy size={12}/>
                    </button>
                    <button onClick={e => handleDelete(s.id, e)}
                      style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--cream2)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                      <Trash2 size={12}/>
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: 'var(--ink5, #c8c8c8)', marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  {s.date}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Story Detail Modal */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: 'var(--card)', borderRadius: 20, maxWidth: 680, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: 32, position: 'relative' }}>
            <button onClick={() => setSelected(null)}
              style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: 'var(--cream2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink3)' }}>
              <X size={16}/>
            </button>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {[selected.audience, selected.tone, selected.sector].map(t => (
                <span key={t} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: 'var(--accentL)', color: 'var(--accent)', fontWeight: 500 }}>{t}</span>
              ))}
            </div>
            <h2 className="font-display" style={{ fontSize: 24, marginBottom: 20, lineHeight: 1.3 }}>{selected.title}</h2>
            <div className="story-box" style={{ marginBottom: 20, fontSize: 14 }}>
              <div style={{ whiteSpace: 'pre-line', lineHeight: 1.85 }}>{selected.text}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
              {[
                { l: 'Sentiment', v: selected.sentiment?.toFixed(1) + '/10' },
                { l: 'Readability', v: selected.readability },
                { l: 'Words', v: selected.words },
              ].map(m => (
                <div key={m.l} style={{ padding: '12px', background: 'var(--cream2)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--ink4)', marginBottom: 4 }}>{m.l}</div>
                  <div className="font-display" style={{ fontSize: 22 }}>{m.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-outline btn-sm" onClick={() => handleCopy(selected, { stopPropagation: () => {} })}><Copy size={13}/> Copy</button>
              <button className="btn btn-outline btn-sm" onClick={() => {
                const w = window.open('', '_blank')
                w.document.write(`<html><head><title>${selected.title}</title></head><body style="font-family:Georgia;max-width:680px;margin:60px auto;padding:0 24px;line-height:1.8"><h1>${selected.title}</h1><p style="color:#888;margin-bottom:32px">${selected.audience} · ${selected.sector} · Generated by NarrAIte</p>${selected.text.split('\n\n').map(p=>`<p>${p}</p>`).join('')}</body></html>`)
                w.document.close(); w.print()
              }}><Download size={13}/> PDF</button>
              {selected.socialPost && (
                <button className="btn btn-outline btn-sm" onClick={() => {
                  navigator.clipboard?.writeText(selected.socialPost).then(() => toast.success('Social post copied!'))
                }}><Share2 size={13}/> Social Post</button>
              )}
              <button className="btn btn-danger btn-sm" style={{ marginLeft: 'auto', background: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA' }}
                onClick={() => { deleteStory(selected.id); setSelected(null); toast.success('Deleted') }}>
                <Trash2 size={13}/> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div onClick={() => setConfirmDelete(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: 'var(--card)', borderRadius: 16, padding: 28, maxWidth: 360, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🗑</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Delete this story?</div>
            <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 24 }}>This action cannot be undone.</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn" onClick={confirmDel} style={{ background: '#dc2626', color: '#fff', border: 'none' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
