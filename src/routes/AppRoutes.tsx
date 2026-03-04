import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import { ROUTES } from './paths'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <>{children}</>
}

export default function AppRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  return (
    <Routes>
      <Route
        path={ROUTES.root}
        element={<Navigate to={isAuthenticated ? ROUTES.dashboard : ROUTES.login} replace />}
      />
      <Route
        path={ROUTES.login}
        element={(
          <PublicRoute>
            <Login />
          </PublicRoute>
        )}
      />
      <Route
        path={ROUTES.register}
        element={(
          <PublicRoute>
            <Register />
          </PublicRoute>
        )}
      />
      <Route
        path={ROUTES.dashboard}
        element={(
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? ROUTES.dashboard : ROUTES.login} replace />}
      />
    </Routes>
  )
}
