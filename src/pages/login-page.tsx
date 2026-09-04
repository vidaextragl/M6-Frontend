import { useState, type SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'
import { useTheme } from '../hooks/use-theme'

const invaders = [
  { top: '8%', color: '#70e6b6', scale: 1, duration: '22s', delay: '0s' },
  { top: '68%', color: '#86f3c7', scale: 1.4, duration: '30s', delay: '-6s' },
  { top: '35%', color: '#70e6b6', scale: 0.8, duration: '26s', delay: '-14s' },
  { top: '82%', color: '#86f3c7', scale: 1, duration: '24s', delay: '-3s' },
  { top: '52%', color: '#70e6b6', scale: 1.2, duration: '34s', delay: '-20s' },
  { top: '18%', color: '#86f3c7', scale: 0.7, duration: '28s', delay: '-9s' },
  { top: '44%', color: '#86f3c7', scale: 1, duration: '20s', delay: '-16s' },
  { top: '60%', color: '#70e6b6', scale: 1.3, duration: '32s', delay: '-11s' },
  { top: '92%', color: '#70e6b6', scale: 0.9, duration: '25s', delay: '-2s' },
  { top: '26%', color: '#86f3c7', scale: 1.1, duration: '29s', delay: '-23s' },
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

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="#99a2ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-3.22 4.36M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#99a2ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  )
}

function ThemeIcon({ theme }: { theme: 'light' | 'dark' }) {
  if (theme === 'dark') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path>
    </svg>
  )
}

export function LoginPage() {
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error al iniciar sesión'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <button
        type="button"
        className="auth-theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        <ThemeIcon theme={theme} />
      </button>

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
            <CoinMark gradientId="loginCoinShine" />
            <h1>
              Tu dinero, a <span>otro nivel</span>.
            </h1>
            <p>Cambiá divisas, cobrá cashback y gestioná tu plata gamer desde un solo lugar.</p>
          </div>
        </div>

        <div className="auth-panel-wrap">
          <div className="auth-panel">
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-form-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#70e6b6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="10" width="16" height="10" rx="2"></rect>
                  <path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
                </svg>
                <h2>Iniciar sesión</h2>
              </div>
              <p className="auth-form-subtitle">Entrá con tu cuenta de Vida Extra.</p>

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
                <div className="password-input-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {error && <p className="auth-error" role="alert">{error}</p>}

              <button type="submit" className="auth-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </button>

              <p className="auth-switch">
                ¿No tienes cuenta? <Link to="/register">Registrate</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}