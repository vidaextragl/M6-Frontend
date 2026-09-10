import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SettingsPage } from '../../../src/pages/settings-page'
import { useAuth } from '../../../src/hooks/use-auth'
import { useTheme } from '../../../src/hooks/use-theme'
import { usersApi } from '../../../src/api/users.api'

vi.mock('../../../src/hooks/use-auth')
vi.mock('../../../src/hooks/use-theme')
vi.mock('../../../src/api/users.api')

const mockLogout = vi.fn()
const mockRefreshUser = vi.fn()

const testUser = {
  id: '1',
  name: 'Juan',
  email: 'juan@test.com',
  avatarUrl: null,
  createdAt: '2026-01-01T00:00:00.000Z',
}

function renderSettingsPage() {
  return render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>,
  )
}

describe('SettingsPage', () => {
  beforeEach(() => {
    localStorage.clear()

    vi.mocked(useAuth).mockReturnValue({
      user: testUser,
      token: 'fake-token',
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
      refreshUser: mockRefreshUser,
    })

    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    })

    mockLogout.mockReset()
    mockRefreshUser.mockReset()
    mockRefreshUser.mockResolvedValue(undefined)
    vi.mocked(usersApi.updateProfile).mockReset()
  })

  it('el email del usuario no es editable', async () => {
    renderSettingsPage()
    expect(await screen.findByLabelText('Email address')).toHaveAttribute('readonly')
  })

  it('permite editar el nombre y guardar el perfil correctamente', async () => {
    const user = userEvent.setup()
    vi.mocked(usersApi.updateProfile).mockResolvedValue({ user: testUser })
    renderSettingsPage()

    await user.click(await screen.findByRole('button', { name: 'Edit profile' }))
    const nameInput = screen.getByLabelText('Full name')
    expect(nameInput).not.toHaveAttribute('readonly')

    await user.clear(nameInput)
    await user.type(nameInput, 'Juan Actualizado')
    await user.click(screen.getByRole('button', { name: 'Save profile' }))

    await waitFor(() => {
      expect(usersApi.updateProfile).toHaveBeenCalledWith({ name: 'Juan Actualizado' })
    })
    expect(mockRefreshUser).toHaveBeenCalled()
    expect(await screen.findByText('✓ Profile saved successfully.')).toBeInTheDocument()
  })

  it('muestra un mensaje de error cuando falla el guardado del perfil', async () => {
    const user = userEvent.setup()
    vi.mocked(usersApi.updateProfile).mockRejectedValue(new Error('No se pudo guardar'))
    renderSettingsPage()

    await user.click(await screen.findByRole('button', { name: 'Edit profile' }))
    await user.click(screen.getByRole('button', { name: 'Save profile' }))

    expect(await screen.findByText('✓ No se pudo guardar')).toBeInTheDocument()
  })

  it('togglea las notificaciones push y persiste el valor en localStorage', async () => {
    const user = userEvent.setup()
    renderSettingsPage()

    const pushSwitch = await screen.findByRole('switch', { name: 'Push notifications' })
    expect(pushSwitch).toHaveAttribute('aria-checked', 'true')

    await user.click(pushSwitch)

    expect(pushSwitch).toHaveAttribute('aria-checked', 'false')
    expect(localStorage.getItem('vida-extra:push-notifications')).toBe('false')
  })

  it('togglea las notificaciones por email y persiste el valor en localStorage', async () => {
    const user = userEvent.setup()
    renderSettingsPage()

    const emailSwitch = await screen.findByRole('switch', { name: 'Email notifications' })
    expect(emailSwitch).toHaveAttribute('aria-checked', 'true')

    await user.click(emailSwitch)

    expect(emailSwitch).toHaveAttribute('aria-checked', 'false')
    expect(localStorage.getItem('vida-extra:email-notifications')).toBe('false')
  })

  it('togglea las alertas de cambio y persiste el valor en localStorage', async () => {
    const user = userEvent.setup()
    renderSettingsPage()

    const exchangeSwitch = await screen.findByRole('switch', { name: 'Exchange alerts' })
    expect(exchangeSwitch).toHaveAttribute('aria-checked', 'true')

    await user.click(exchangeSwitch)

    expect(exchangeSwitch).toHaveAttribute('aria-checked', 'false')
    expect(localStorage.getItem('vida-extra:exchange-alerts')).toBe('false')
  })
})
