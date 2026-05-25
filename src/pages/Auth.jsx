import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../App'
import toast from 'react-hot-toast'
import { ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react'

const ORG_TYPES = ['NGO / Non-profit', 'CSR Organization', 'Healthcare Institution', 'Educational Organization', 'Government Body', 'Startup', 'Other']

export default function Auth() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('mode') === 'signup' ? 'signup' : 'login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: 'demo@narraite.ai', password: 'demo1234',
    firstName: '', lastName: '', orgType: 'NGO / Non-profit', orgName: ''
  })
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    login({
      name: 'Anushka Tiwari', email: form.email,
      org: 'Asha Foundation', orgType: 'NGO / Non-profit',
      initials: 'AT', role: 'Admin'
    })
    toast.success('Welcome back!')
    navigate('/app')
    setLoading(false)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!form.firstName || !form.email || !form.password) { toast.error('Please fill required fields'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1100))
    login({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      org: form.orgName || form.orgType,
      orgType: form.orgType,
      initials: ((form.firstName[0]||'') + (form.lastName[0]||'')).toUpperCase() || 'U',
      role: 'Admin'
    })
    toast.success('Account created! Welcome to NarrAIte.')
    navigate('/app')
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)' }}>

      {/* LEFT PANEL */}
      <div style={{ width: 460, minHeight: '100vh', background: 'var(--card)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '40px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')} style={{ padding: '6px 10px' }}>
            <ArrowLeft size={14}/> Back
          </button>
          <div className="font-display" style={{ fontSize: 22 }}>
            Narr<span style={{ color: 'var(--accent3)' }}>AI</span>te
          </div>
        </div>

        {/* Tab row */}
        <div style={{ display: 'flex', background: 'var(--cream2)', borderRadius: 'var(--r)', padding: 3, marginBottom: 32 }}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '9px', borderRadius: 8, cursor: 'pointer',
                fontSize: 13, fontWeight: 500, border: 'none',
                fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
                background: mode === m ? 'var(--card)' : 'transparent',
                color: mode === m ? 'var(--ink)' : 'var(--ink3)',
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
              }}>
              {m === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <h2 className="font-display" style={{ fontSize: 26, marginBottom: 6 }}>Welcome back</h2>
            <p style={{ fontSize: 14, color: 'var(--ink3)', marginBottom: 28 }}>Sign in to your workspace</p>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 500, color: 'var(--ink2)' }}>Email address</label>
              <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@organization.com" required/>
            </div>

            <div className="form-group" style={{ marginBottom: 24, position: 'relative' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 500, color: 'var(--ink2)' }}>Password</label>
              <input className="form-input" type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required style={{ paddingRight: 40 }}/>
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 10, top: 30, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink4)' }}>
                {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }}/> Signing in…</> : 'Sign in to workspace'}
            </button>

            <div style={{ marginTop: 20, padding: 14, background: 'var(--cream2)', borderRadius: 'var(--r)', fontSize: 12, color: 'var(--ink3)' }}>
              <strong style={{ color: 'var(--ink2)' }}>Demo credentials</strong><br/>
              Email: demo@narraite.ai · Password: demo1234
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <h2 className="font-display" style={{ fontSize: 26, marginBottom: 6 }}>Create your account</h2>
            <p style={{ fontSize: 14, color: 'var(--ink3)', marginBottom: 28 }}>Start generating impact stories for free</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 500, color: 'var(--ink2)' }}>First name *</label>
                <input className="form-input" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Anushka" required/>
              </div>
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 500, color: 'var(--ink2)' }}>Last name</label>
                <input className="form-input" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Tiwari"/>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 500, color: 'var(--ink2)' }}>Work email *</label>
              <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@org.com" required/>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 500, color: 'var(--ink2)' }}>Organization name</label>
              <input className="form-input" value={form.orgName} onChange={e => set('orgName', e.target.value)} placeholder="Asha Foundation"/>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 500, color: 'var(--ink2)' }}>Organization type *</label>
              <select className="form-select" value={form.orgType} onChange={e => set('orgType', e.target.value)}>
                {ORG_TYPES.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 28, position: 'relative' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 500, color: 'var(--ink2)' }}>Password *</label>
              <input className="form-input" type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" required style={{ paddingRight: 40 }}/>
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 10, top: 30, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink4)' }}>
                {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }}/> Creating account…</> : 'Create free account →'}
            </button>
            <p style={{ fontSize: 11, color: 'var(--ink4)', textAlign: 'center', marginTop: 12 }}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -120, left: -80, width: 500, height: 500, borderRadius: '50%', background: 'rgba(82,183,136,0.05)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(82,183,136,0.04)', pointerEvents: 'none' }}/>

        <div style={{ maxWidth: 400, zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            <Sparkles size={18} color="var(--accent3)"/>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>AI-powered storytelling platform</span>
          </div>

          <h2 className="font-display" style={{ fontSize: 40, color: '#fff', lineHeight: 1.2, marginBottom: 24, letterSpacing: '-1px' }}>
            Stories that <span style={{ color: 'var(--accent3)', fontStyle: 'italic' }}>move</span> people to act
          </h2>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 40 }}>
            Transform your impact data into emotionally resonant, personalized narratives — for donors, investors, NGOs, governments, and more.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['✦', 'AI generates publication-ready stories from raw data'],
              ['◈', 'Personalize tone and style for any audience'],
              ['⊞', 'Batch process thousands of stories at once'],
              ['↓', 'Export to PDF, email, social media instantly'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--accent3)', fontSize: 14, marginTop: 1, flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Mini story preview */}
          <div className="story-box" style={{ marginTop: 36, fontSize: 13, background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="font-display" style={{ fontSize: 15, color: '#fff', marginBottom: 8 }}>
              500 Children. One Story. Infinite Impact.
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, fontSize: 12 }}>
              In the dusty lanes of Dharavi, Meera once believed school was not meant for girls like her. Today, she stands first in her class…
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
              {['Donors', 'Emotional'].map(t => (
                <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(82,183,136,0.15)', color: 'var(--accent3)', border: '1px solid rgba(82,183,136,0.2)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
