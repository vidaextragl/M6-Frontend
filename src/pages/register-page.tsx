import { useState, type SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'

const invaders = [
  { top: '12%', color: '#70e6b6', scale: 1, duration: '25s', delay: '0s' },
  { top: '60%', color: '#86f3c7', scale: 1.3, duration: '32s', delay: '-8s' },
  { top: '40%', color: '#70e6b6', scale: 0.9, duration: '28s', delay: '-16s' },
  { top: '85%', color: '#86f3c7', scale: 1.1, duration: '23s', delay: '-4s' },
  { top: '25%', color: '#70e6b6', scale: 1, duration: '30s', delay: '-12s' },
]

function CoinMark({ gradientId }: { gradientId: string }) {
  return (
    <svg className="professional-coin-svg" viewBox="0 0 190 190" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="45%" stopColor="#f4c430" />
          <stop offset="100%" stopColor="#c8890a" />
        </linearGradient>
      </defs>
      <g transform="translate(95,95)">
        <circle r="95" fill="#8a5a00" />
        <circle r="88" fill={`url(#${gradientId})`} stroke="#7a4a00" strokeWidth="4" />
        <circle r="68" fill="none" stroke="#7a4a00" strokeWidth="3" strokeDasharray="4 6" />
        <path d="M -95 -30 A 95 95 0 0 1 -30 -95 L -10 -70 A 68 68 0 0 0 -70 -10 Z" fill="#fffce6" opacity="0.55" />
        <text x="0" y="26" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="80" fontWeight="700" fill="#5c3d00">V</text>
      </g>
    </svg>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (!acceptedTerms) {
      setError('Tenés que aceptar los términos y condiciones')
      return
    }

    setIsSubmitting(true)

    try {
      await register({ name, email, password })
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error al registrarte'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <div className="auth-hero">
          <div className="invaders-field">
            {invaders.map((inv, i) => (
              <div
                key={i}
                className="invader-pixel"
                style={{
                  top: inv.top,
                  animationDuration: inv.duration,
                  animationDelay: inv.delay,
                  ['--invader-color' as string]: inv.color,
                  ['--invader-scale' as string]: inv.scale,
                }}
              />
            ))}
          </div>

          <div className="hero-content">
            <CoinMark gradientId="registerCoinShine" />
            <h1>
              Sumate a la <span>comunidad</span>.
            </h1>
            <p>Creá tu cuenta y empezá a ganar cashback en cada compra gamer.</p>
          </div>
        </div>

        <div className="auth-panel-wrap">
          <div className="auth-panel">
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-form-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#70e6b6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7"></path>
                </svg>
                <h2>Crear cuenta</h2>
              </div>
              <p className="auth-form-subtitle">Es gratis y te toma un minuto.</p>

              <div className="auth-field">
                <label htmlFor="name">Nombre completo</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <div className="auth-checkbox-field">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <label htmlFor="terms">
                  Acepto los <a href="#">términos y condiciones</a> y la <a href="#">política de privacidad</a>.
                </label>
              </div>

              {error && <p className="auth-error" role="alert">{error}</p>}

              <button type="submit" className="auth-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>

              <p className="auth-switch">
                ¿Ya tienes cuenta? <Link to="/login">Iniciá sesión</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}