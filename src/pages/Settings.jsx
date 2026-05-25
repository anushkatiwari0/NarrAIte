import React, { useState } from 'react'
import { useAuth } from '../App'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { User, Settings2, Bell, Shield, LogOut, ChevronRight } from 'lucide-react'

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    org: user?.org || '',
    orgType: user?.orgType || 'NGO / Non-profit',
  })

  const [prefs, setPrefs] = useState({
    defaultAudience: 'Donors',
    defaultTone: 'Emotional & Inspiring',
    defaultLength: 'medium',
    defaultSector: 'Education',
  })

  const [notifs, setNotifs] = useState({
    batchComplete: true,
    weeklyDigest: false,
    newFeatures: true,
  })

  const [tab, setTab] = useState('profile')

  const setP = (k, v) => setProfile(f => ({ ...f, [k]: v }))
  const setPref = (k, v) => setPrefs(f => ({ ...f, [k]: v }))
  const setN = (k) => setNotifs(f => ({ ...f, [k]: !f[k] }))

  const saveProfile = () => {
    toast.success('Profile saved!')
  }

  const doLogout = () => {
    logout()
    navigate('/')
  }

  const TABS = [
    { id: 'profile', label: 'Profile', icon: <User size={15}/> },
    { id: 'ai', label: 'AI Preferences', icon: <Settings2 size={15}/> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={15}/> },
    { id: 'security', label: 'Security', icon: <Shield size={15}/> },
  ]

  return (
    <div className="animate-slide-up" style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 className="font-display" style={{ fontSize: 26 }}>Settings</h2>
        <p style={{ fontSize: 14, color: 'var(--ink3)', marginTop: 4 }}>Manage your account and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 20 }}>
        {/* Sidebar tabs */}
        <div className="card" style={{ padding: '8px', height: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500,
                transition: 'all 0.15s', textAlign: 'left',
                background: tab === t.id ? 'var(--accentL)' : 'transparent',
                color: tab === t.id ? 'var(--accent)' : 'var(--ink3)',
              }}>
              {t.icon} {t.label}
            </button>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }}/>
          <button onClick={doLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: 13, background: 'transparent',
              color: '#dc2626'
            }}>
            <LogOut size={15}/> Sign out
          </button>
        </div>

        {/* Content */}
        <div>
          {tab === 'profile' && (
            <div className="card">
              <div className="font-display" style={{ fontSize: 17, marginBottom: 20 }}>Profile Information</div>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '16px', background: 'var(--cream2)', borderRadius: 12 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #52B788, #1B4332)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 600, color: '#fff'
                }}>{user?.initials || 'U'}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{user?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{user?.email}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink4)', marginTop: 2 }}>{user?.role} · {user?.orgType}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 6 }}>First Name</label>
                  <input className="form-input" value={profile.firstName} onChange={e => setP('firstName', e.target.value)}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 6 }}>Last Name</label>
                  <input className="form-input" value={profile.lastName} onChange={e => setP('lastName', e.target.value)}/>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 6 }}>Email Address</label>
                <input className="form-input" type="email" value={profile.email} onChange={e => setP('email', e.target.value)}/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 6 }}>Organization</label>
                  <input className="form-input" value={profile.org} onChange={e => setP('org', e.target.value)}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 6 }}>Organization Type</label>
                  <select className="form-select" value={profile.orgType} onChange={e => setP('orgType', e.target.value)}>
                    {['NGO / Non-profit', 'CSR Organization', 'Healthcare', 'Education', 'Government', 'Startup'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" onClick={saveProfile}>Save changes</button>
            </div>
          )}

          {tab === 'ai' && (
            <div className="card">
              <div className="font-display" style={{ fontSize: 17, marginBottom: 20 }}>AI & Generation Preferences</div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 6 }}>Default Audience</label>
                <select className="form-select" value={prefs.defaultAudience} onChange={e => setPref('defaultAudience', e.target.value)}>
                  {['Donors', 'Investors', 'NGOs', 'Students', 'Healthcare', 'Government'].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 6 }}>Default Tone</label>
                <select className="form-select" value={prefs.defaultTone} onChange={e => setPref('defaultTone', e.target.value)}>
                  {['Emotional & Inspiring', 'Data-driven & Analytical', 'Formal & Professional', 'Conversational & Warm', 'Urgent & Action-oriented'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 6 }}>Default Length</label>
                  <select className="form-select" value={prefs.defaultLength} onChange={e => setPref('defaultLength', e.target.value)}>
                    <option value="short">Short (150–200 words)</option>
                    <option value="medium">Medium (300–400 words)</option>
                    <option value="long">Long (600–800 words)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 6 }}>Default Sector</label>
                  <select className="form-select" value={prefs.defaultSector} onChange={e => setPref('defaultSector', e.target.value)}>
                    {['Education', 'Healthcare', 'Environment', 'Women Empowerment', 'Livelihood', 'Other'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => toast.success('AI preferences saved!')}>Save preferences</button>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="card">
              <div className="font-display" style={{ fontSize: 17, marginBottom: 20 }}>Notification Settings</div>
              {[
                { key: 'batchComplete', label: 'Batch job completion', desc: 'Get notified when a batch processing job finishes' },
                { key: 'weeklyDigest', label: 'Weekly digest', desc: 'Summary of stories generated and analytics each week' },
                { key: 'newFeatures', label: 'New features', desc: 'Updates about new NarrAIte features and improvements' },
              ].map(n => (
                <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{n.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink3)' }}>{n.desc}</div>
                  </div>
                  <button onClick={() => setN(n.key)} style={{
                    width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                    background: notifs[n.key] ? 'var(--accent)' : 'var(--border2)',
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0
                  }}>
                    <div style={{
                      position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%', background: '#fff',
                      transition: 'left 0.2s', left: notifs[n.key] ? 21 : 3
                    }}/>
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'security' && (
            <div className="card">
              <div className="font-display" style={{ fontSize: 17, marginBottom: 20 }}>Security</div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 6 }}>Current Password</label>
                <input className="form-input" type="password" placeholder="••••••••"/>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 6 }}>New Password</label>
                <input className="form-input" type="password" placeholder="Min 8 characters"/>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 6 }}>Confirm New Password</label>
                <input className="form-input" type="password" placeholder="Repeat new password"/>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => toast.success('Password updated!')}>Update password</button>

              <div style={{ marginTop: 28, padding: 16, background: '#FEF2F2', borderRadius: 10, border: '1px solid #FECACA' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#991B1B', marginBottom: 6 }}>Danger Zone</div>
                <div style={{ fontSize: 12, color: '#B91C1C', marginBottom: 12 }}>Once you delete your account, there is no going back. All stories and data will be permanently removed.</div>
                <button className="btn btn-sm" style={{ background: '#dc2626', color: '#fff', border: 'none' }}
                  onClick={() => toast.error('Account deletion requires email confirmation')}>
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
