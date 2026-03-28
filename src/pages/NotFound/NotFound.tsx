import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes/paths'
import './NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <p className="not-found-code">404</p>
        <h2>Página não encontrada</h2>
        <p>A página que você está procurando não existe ou foi movida.</p>
        <div className="not-found-actions">
          <button
            type="button"
            className="not-found-btn not-found-btn-secondary"
            onClick={() => navigate(-1)}
          >
            Voltar
          </button>
          <Link to={ROUTES.root} className="not-found-btn not-found-btn-primary">
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  )
}
