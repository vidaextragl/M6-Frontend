import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../../../src/routes/protected-route'
import { GuestRoute } from '../../../src/routes/guest-route'
import { useAuth } from '../../../src/hooks/use-auth'

vi.mock('../../../src/hooks/use-auth')

function renderWithRoute(
  RouteComponent: typeof ProtectedRoute,
  initialPath: string,
) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/protegida"
          element={
            <RouteComponent>
              <div>Contenido protegido</div>
            </RouteComponent>
          }
        />
        <Route path="/login" element={<div>Pantalla de login</div>} />
        <Route path="/dashboard" element={<div>Pantalla de dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('redirige a /login cuando no hay sesión activa', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    renderWithRoute(ProtectedRoute, '/protegida')
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
  })

  it('muestra el contenido cuando hay sesión activa', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Juan', email: 'juan@test.com', avatarUrl: null, createdAt: '2026-01-01T00:00:00.000Z' },
      token: 'fake-token',
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    renderWithRoute(ProtectedRoute, '/protegida')
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })

  it('no muestra contenido ni redirige mientras isLoading es true', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    renderWithRoute(ProtectedRoute, '/protegida')
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument()
  })
})

describe('GuestRoute', () => {
  it('redirige a /dashboard cuando ya hay sesión activa', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Juan', email: 'juan@test.com', avatarUrl: null, createdAt: '2026-01-01T00:00:00.000Z' },
      token: 'fake-token',
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    renderWithRoute(GuestRoute, '/protegida')
    expect(screen.getByText('Pantalla de dashboard')).toBeInTheDocument()
  })

  it('muestra el contenido cuando no hay sesión activa', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    renderWithRoute(GuestRoute, '/protegida')
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })

  it('no muestra contenido ni redirige mientras isLoading es true', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    renderWithRoute(GuestRoute, '/protegida')
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
    expect(screen.queryByText('Pantalla de dashboard')).not.toBeInTheDocument()
  })
})