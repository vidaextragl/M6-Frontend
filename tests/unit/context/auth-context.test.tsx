import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../../../src/context/auth-context'
import { useAuth } from '../../../src/hooks/use-auth'
import { authApi } from '../../../src/api/auth.api'
import { usersApi } from '../../../src/api/users.api'

vi.mock('../../../src/api/auth.api')
vi.mock('../../../src/api/users.api')

const TOKEN_STORAGE_KEY = 'vida-extra:token'
const USER_STORAGE_KEY = 'vida-extra:user'

const testUser = {
  id: '1',
  name: 'Juan',
  email: 'juan@test.com',
  avatarUrl: null,
  createdAt: '2026-01-01T00:00:00.000Z',
}

function TestConsumer() {
  const { user, token, isAuthenticated, login, register, logout, refreshUser } = useAuth()

  return (
    <div>
      <p data-testid="user-name">{user?.name ?? 'sin usuario'}</p>
      <p data-testid="token">{token ?? 'sin token'}</p>
      <p data-testid="is-authenticated">{String(isAuthenticated)}</p>
      <button
        onClick={() =>
          login({ email: 'juan@test.com', password: 'Segura123!' }).catch(() => {})
        }
      >
        Login
      </button>
      <button
        onClick={() =>
          register({ name: 'Juan', email: 'juan@test.com', password: 'Segura123!' }).catch(
            () => {},
          )
        }
      >
        Register
      </button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => refreshUser()}>Refresh</button>
    </div>
  )
}

function renderAuthProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(authApi.login).mockReset()
    vi.mocked(authApi.register).mockReset()
    vi.mocked(usersApi.getMe).mockReset()
  })

  it('inicia sin sesión cuando no hay nada guardado en localStorage', () => {
    renderAuthProvider()

    expect(screen.getByTestId('user-name')).toHaveTextContent('sin usuario')
    expect(screen.getByTestId('token')).toHaveTextContent('sin token')
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
  })

  it('hidrata la sesión desde localStorage cuando hay token y usuario guardados', () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'stored-token')
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(testUser))

    renderAuthProvider()

    expect(screen.getByTestId('user-name')).toHaveTextContent('Juan')
    expect(screen.getByTestId('token')).toHaveTextContent('stored-token')
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
  })

  it('login guarda el usuario y el token en el estado y en localStorage', async () => {
    const user = userEvent.setup()
    vi.mocked(authApi.login).mockResolvedValue({ user: testUser, token: 'new-token' })
    renderAuthProvider()

    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Juan')
    })
    expect(screen.getByTestId('token')).toHaveTextContent('new-token')
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe('new-token')
    expect(JSON.parse(localStorage.getItem(USER_STORAGE_KEY) ?? '')).toEqual(testUser)
  })

  it('propaga el error cuando authApi.login rechaza la promesa', async () => {
    const user = userEvent.setup()
    vi.mocked(authApi.login).mockRejectedValue(new Error('Email o contraseña incorrectos'))
    renderAuthProvider()

    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
    })
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull()
  })

  it('register guarda el usuario y el token igual que login', async () => {
    const user = userEvent.setup()
    vi.mocked(authApi.register).mockResolvedValue({ user: testUser, token: 'register-token' })
    renderAuthProvider()

    await user.click(screen.getByRole('button', { name: 'Register' }))

    await waitFor(() => {
      expect(screen.getByTestId('token')).toHaveTextContent('register-token')
    })
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe('register-token')
  })

  it('logout limpia el usuario, el token y el localStorage', async () => {
    const user = userEvent.setup()
    localStorage.setItem(TOKEN_STORAGE_KEY, 'stored-token')
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(testUser))
    renderAuthProvider()

    await user.click(screen.getByRole('button', { name: 'Logout' }))

    expect(screen.getByTestId('user-name')).toHaveTextContent('sin usuario')
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem(USER_STORAGE_KEY)).toBeNull()
  })

  it('refreshUser actualiza el usuario pidiéndolo a usersApi.getMe', async () => {
    const user = userEvent.setup()
    localStorage.setItem(TOKEN_STORAGE_KEY, 'stored-token')
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(testUser))
    const updatedUser = { ...testUser, name: 'Juan Actualizado' }
    vi.mocked(usersApi.getMe).mockResolvedValue({ user: updatedUser })
    renderAuthProvider()

    await user.click(screen.getByRole('button', { name: 'Refresh' }))

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Juan Actualizado')
    })
    expect(JSON.parse(localStorage.getItem(USER_STORAGE_KEY) ?? '')).toEqual(updatedUser)
  })

  it('refreshUser no llama a la API cuando no hay una sesión activa', async () => {
    const user = userEvent.setup()
    renderAuthProvider()

    await user.click(screen.getByRole('button', { name: 'Refresh' }))

    expect(usersApi.getMe).not.toHaveBeenCalled()
  })
})
