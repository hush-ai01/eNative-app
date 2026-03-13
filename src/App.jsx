import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Dialler from './pages/Dialler'
import Contacts from './pages/Contacts'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Badges from './pages/Badges'
import ProfileSetup from './pages/ProfileSetup'

function PrivateRoute({ children }) {
  const { user, profile, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050507', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.26)' }}>CONNECTING...</div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (user && profile && !profile.enumber) return <Navigate to="/setup" replace />
  return children
}

function AuthRoute({ children }) {
  const { user, profile, loading } = useAuth()
  if (loading) return null
  if (user && profile?.enumber) return <Navigate to="/" replace />
  if (user && !profile?.enumber) return <Navigate to="/setup" replace />
  return children
}

export default function App() {
  return (
    <Routes>
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/dialler" element={<PrivateRoute><Dialler /></PrivateRoute>} />
        <Route path="/contacts" element={<PrivateRoute><Contacts /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/badge" element={<PrivateRoute><Badges /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}
