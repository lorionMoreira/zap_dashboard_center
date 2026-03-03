import { useEffect, useState } from 'react'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import { navigateTo, onNavigate } from './utils/navigation'
import './App.css'

const PUBLIC_ROUTES = new Set(['/login', '/register'])

function getCurrentPath() {
  const path = window.location.pathname || '/'
  if (path === '/') {
    return '/'
  }

  return path.replace(/\/+$/, '')
}

function App() {
  const { isAuthenticated, loading } = useAuth()
  const [pathname, setPathname] = useState(getCurrentPath)

  useEffect(() => {
    return onNavigate(() => setPathname(getCurrentPath()))
  }, [])

  useEffect(() => {
    if (loading) {
      return
    }

    if (!isAuthenticated && !PUBLIC_ROUTES.has(pathname)) {
      navigateTo('/login', true)
      return
    }

    if (isAuthenticated && pathname !== '/dashboard') {
      navigateTo('/dashboard', true)
    }
  }, [isAuthenticated, loading, pathname])

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    if (pathname === '/register') {
      return <Register />
    }

    return <Login />
  }

  return <Home />
}

export default App
