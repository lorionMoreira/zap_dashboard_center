import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import Onboarding from '../pages/Onboarding/Onboarding'
import Chat from '../pages/Chat/Chat'
import Connect from '../pages/Connect/Connect'
import DashboardLayout from '../componentes/Layout/DashboardLayout'
import NotFound from '../pages/NotFound/NotFound'
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
    return <Navigate to={ROUTES.onboarding} replace />
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
        element={<Navigate to={isAuthenticated ? ROUTES.onboarding : ROUTES.login} replace />}
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
        path={ROUTES.onboarding}
        element={(
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.dashboard}
        element={(
          <ProtectedRoute>
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.chat}
        element={(
          <ProtectedRoute>
            <DashboardLayout>
              <Chat />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.connect}
        element={(
          <ProtectedRoute>
            <DashboardLayout>
              <Connect />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  )
}
