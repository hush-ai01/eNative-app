import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Dialler from './pages/Dialler'
import Contacts from './pages/Contacts'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Badges from './pages/Badges'
import ProfileSetup from './pages/ProfileSetup'

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: '#050507', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.26)' }}>CONNECTING...</div>
    </div>
  )
}

function PrivateRoute({ children }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (!profile?.enumber) return <Navigate to="/setup" replace />
  return children
}

function SetupRoute({ children }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (profile?.enumber) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<SetupRoute><ProfileSetup /></SetupRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
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
