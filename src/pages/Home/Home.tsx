import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../routes/paths'
import './Home.css'

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.login, { replace: true })
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Dashboard Center</h1>
          <div className="user-section">
            <span className="user-name">Olá, {user?.name || user?.username}!</span>
            <button onClick={handleLogout} className="btn-logout">
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="welcome-card">
          <h2>Bem-vindo ao Dashboard!</h2>
          <p>
            Você está logado como:{' '}
            <strong>{user?.email || user?.username || 'Usuário autenticado'}</strong>
          </p>
          <p className="info-text">
            Este é um template inicial. Você pode começar a adicionar seus componentes e páginas aqui.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Estatística 1</h3>
            <p className="stat-value">0</p>
          </div>
          <div className="stat-card">
            <h3>Estatística 2</h3>
            <p className="stat-value">0</p>
          </div>
          <div className="stat-card">
            <h3>Estatística 3</h3>
            <p className="stat-value">0</p>
          </div>
          <div className="stat-card">
            <h3>Estatística 4</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
      </main>
    </div>
  )
}
