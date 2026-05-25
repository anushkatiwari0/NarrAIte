import React, { createContext, useContext, useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Generator from './pages/Generator'
import Library from './pages/Library'
import Settings from './pages/Settings'

// ─── Auth Context ─────────────────────────────────────────
export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

// ─── Story Context ─────────────────────────────────────────
export const StoryContext = createContext(null)
export const useStories = () => useContext(StoryContext)

const SEED_STORIES = []

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('narraite_user')) } catch { return null }
  })
  const [stories, setStories] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('narraite_stories'))
      return saved?.length ? saved : SEED_STORIES
    } catch { return SEED_STORIES }
  })

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('narraite_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('narraite_user')
  }

  const addStory = (story) => {
    const updated = [story, ...stories]
    setStories(updated)
    localStorage.setItem('narraite_stories', JSON.stringify(updated))
  }

  const deleteStory = (id) => {
    const updated = stories.filter(s => s.id !== id)
    setStories(updated)
    localStorage.setItem('narraite_stories', JSON.stringify(updated))
  }

  useEffect(() => {
    if (!localStorage.getItem('narraite_stories')) {
      localStorage.setItem('narraite_stories', JSON.stringify(SEED_STORIES))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <StoryContext.Provider value={{ stories, addStory, deleteStory }}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#0D0D0D', color: '#fff', borderRadius: '12px', fontSize: '13px' },
            success: { iconTheme: { primary: '#52B788', secondary: '#0D0D0D' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#0D0D0D' } },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="generator" element={<Generator />} />
            <Route path="library" element={<Library />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </StoryContext.Provider>
    </AuthContext.Provider>
  )
}
