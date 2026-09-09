import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from '../../../src/pages/login-page'
import { useAuth } from '../../../src/hooks/use-auth'
import { useTheme } from '../../../src/hooks/use-theme'

vi.mock('../../../src/hooks/use-auth')
vi.mock('../../../src/hooks/use-theme')

const mockLogin = vi.fn()

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    })

    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    })

    mockLogin.mockReset()
  })

  it('renderiza los campos de email y contraseña', () => {
    renderLoginPage()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('el campo de contraseña empieza oculto (type password)', () => {
    renderLoginPage()
    const passwordInput = screen.getByLabelText('Contraseña')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('el botón de mostrar/ocultar contraseña cambia el type del input', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    const passwordInput = screen.getByLabelText('Contraseña')
    const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i })

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('llama a login con el email y contraseña ingresados al enviar el formulario', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValue(undefined)
    renderLoginPage()

    await user.type(screen.getByLabelText(/email/i), 'demo@vidaextra.com')
    await user.type(screen.getByLabelText('Contraseña'), 'MiClave123!')
    await user.click(screen.getByRole('button', { name: /ingresar/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'demo@vidaextra.com',
        password: 'MiClave123!',
      })
    })
  })

  it('muestra un mensaje de error cuando login rechaza la promesa', async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValue(new Error('Email o contraseña incorrectos'))
    renderLoginPage()

    await user.type(screen.getByLabelText(/email/i), 'demo@vidaextra.com')
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await user.click(screen.getByRole('button', { name: /ingresar/i }))

    expect(await screen.findByText('Email o contraseña incorrectos')).toBeInTheDocument()
  })
})