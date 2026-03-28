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

function ProtectedRoute({ children, requireLoginComplete = false, allowOnlyIncomplete = false }: { children: ReactNode, requireLoginComplete?: boolean, allowOnlyIncomplete?: boolean }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (requireLoginComplete && !user?.loginComplete) {
    return <Navigate to={ROUTES.onboarding} replace />
  }

  if (allowOnlyIncomplete && user?.loginComplete) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={user?.loginComplete ? ROUTES.dashboard : ROUTES.onboarding} replace />
  }

  return <>{children}</>
}

export default function AppRoutes() {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return null
  }

  return (
    <Routes>
      <Route
        path={ROUTES.root}
        element={<Navigate to={isAuthenticated ? (user?.loginComplete ? ROUTES.dashboard : ROUTES.onboarding) : ROUTES.login} replace />}
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
          <ProtectedRoute allowOnlyIncomplete={true}>
            <Onboarding />
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.dashboard}
        element={(
          <ProtectedRoute requireLoginComplete={true}>
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.chat}
        element={(
          <ProtectedRoute requireLoginComplete={true}>
            <DashboardLayout>
              <Chat />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.connect}
        element={(
          <ProtectedRoute requireLoginComplete={true}>
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
