import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'
import {
  LayoutDashboard, Sparkles, BookOpen,
  Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard',      path: '/app',           icon: LayoutDashboard, exact: true },
  { label: 'Story Generator',path: '/app/generator', icon: Sparkles },
  { label: 'Story Library',  path: '/app/library',   icon: BookOpen },
  { label: 'Settings',       path: '/app/settings',  icon: Settings },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)

  const go = (path) => { navigate(path); setSidebarOpen(false) }
  const doLogout = () => { logout(); navigate('/') }

  const pageTitle = NAV.find(n => isActive(n))?.label || 'Dashboard'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}/>
      )}

      {/* SIDEBAR */}
      <aside
        className={`sidebar-wrap${sidebarOpen ? ' open' : ''}`}
        style={{
          width: 220, minHeight: '100vh', background: '#0D0D0D',
          position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
          display: 'flex', flexDirection: 'column',
          transition: 'transform 0.3s ease',
        }}>
        {/* Logo */}
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="font-display" style={{ fontSize: 21, color: '#fff', letterSpacing: '-0.5px' }}>
              Narr<span style={{ color: '#52B788' }}>AI</span>te
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: 3 }}>
              Impact Narrative AI
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="sidebar-close-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4 }}>
            <X size={18}/>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          <div style={{ padding: '12px 20px 6px', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
            Workspace
          </div>
          {NAV.slice(0, 3).map(item => {
            const active = isActive(item)
            const Icon = item.icon
            return (
              <button key={item.path} onClick={() => go(item.path)}
                className={`nav-item${active ? ' active' : ''}`}>
                <Icon size={15} style={{ flexShrink: 0 }}/>
                {item.label}
              </button>
            )
          })}
          <div style={{ padding: '16px 20px 6px', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
            Account
          </div>
          {NAV.slice(3).map(item => {
            const active = isActive(item)
            const Icon = item.icon
            return (
              <button key={item.path} onClick={() => go(item.path)}
                className={`nav-item${active ? ' active' : ''}`}>
                <Icon size={15} style={{ flexShrink: 0 }}/>
                {item.label}
              </button>
            )
          })}
          <button onClick={doLogout} className="nav-item" style={{ marginTop: 4 }}>
            <LogOut size={15} style={{ flexShrink: 0 }}/> Sign out
          </button>
        </nav>

        {/* User pill */}
        <div style={{ margin: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => go('/app/settings')}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #52B788, #1B4332)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0
          }}>{user?.initials || 'U'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{user?.orgType || 'Organization'}</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-content" style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          height: 58, background: 'var(--card)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12,
          position: 'sticky', top: 0, zIndex: 50
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mobile-menu-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink2)', padding: 6, borderRadius: 8, display: 'none' }}>
            <Menu size={20}/>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13, color: 'var(--ink4)', whiteSpace: 'nowrap' }}>NarrAIte</span>
            <ChevronRight size={13} color="var(--ink4)" style={{ flexShrink: 0 }}/>
            <span className="font-display" style={{ fontSize: 17, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pageTitle}</span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <button className="btn btn-outline btn-sm topbar-cta" onClick={() => navigate('/app/generator')}>
              <Sparkles size={13}/> <span className="btn-label">New Story</span>
            </button>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #D8F3DC, #52B788)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600, color: '#1B4332', cursor: 'pointer', flexShrink: 0
            }} onClick={() => navigate('/app/settings')}>
              {user?.initials || 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }} className="page-main">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-wrap { transform: translateX(-100%); }
          .sidebar-wrap.open { transform: translateX(0) !important; }
          .sidebar-close-btn { display: flex !important; }
          .main-content { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
          .page-main { padding: 16px !important; }
          .topbar-cta .btn-label { display: none; }
        }
        @media (min-width: 769px) {
          .sidebar-close-btn { display: none !important; }
        }
      `}</style>
    </div>
  )
}
