import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { RegisterPage } from '../../../src/pages/register-page'
import { useAuth } from '../../../src/hooks/use-auth'
import { useTheme } from '../../../src/hooks/use-theme'

vi.mock('../../../src/hooks/use-auth')
vi.mock('../../../src/hooks/use-theme')

const mockRegister = vi.fn()

function renderRegisterPage() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  )
}

async function fillTerms(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('checkbox'))
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      register: mockRegister,
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

    mockRegister.mockReset()
  })

  it('renderiza los campos de nombre, email, contraseña y confirmar contraseña', () => {
    renderRegisterPage()
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument()
  })

  it('no muestra la lista de requisitos cuando el campo de contraseña está vacío', () => {
    renderRegisterPage()
    expect(screen.queryByText('Al menos 8 caracteres')).not.toBeInTheDocument()
  })

  it('marca "Al menos una mayúscula" en verde solo cuando la contraseña tiene una', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText('Contraseña'), 'abc')
    const requirement = screen.getByText('Al menos una mayúscula').closest('li')
    expect(requirement).not.toHaveClass('met')

    await user.type(screen.getByLabelText('Contraseña'), 'A')
    expect(requirement).toHaveClass('met')
  })

  it('el botón de mostrar/ocultar contraseña funciona de forma independiente para cada campo', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    const passwordInput = screen.getByLabelText('Contraseña')
    const confirmInput = screen.getByLabelText('Confirmar contraseña')
    const toggleButtons = screen.getAllByRole('button', { name: /mostrar contraseña/i })

    await user.click(toggleButtons[0])
    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(confirmInput).toHaveAttribute('type', 'password')
  })

  it('muestra error cuando la contraseña no cumple los requisitos de fortaleza', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Elizondo')
    await user.type(screen.getByLabelText(/email/i), 'juan@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'contraseñadebil')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'contraseñadebil')
    await fillTerms(user)
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(await screen.findByText('La contraseña no cumple los requisitos')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('muestra error cuando las contraseñas no coinciden', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Elizondo')
    await user.type(screen.getByLabelText(/email/i), 'juan@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'Segura123!')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'Distinta456!')
    await fillTerms(user)
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('muestra error cuando no se aceptan los términos y condiciones', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Elizondo')
    await user.type(screen.getByLabelText(/email/i), 'juan@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'Segura123!')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'Segura123!')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(await screen.findByText('Tenés que aceptar los términos y condiciones')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('llama a register con los datos correctos cuando el formulario es válido', async () => {
    const user = userEvent.setup()
    mockRegister.mockResolvedValue(undefined)
    renderRegisterPage()

    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Elizondo')
    await user.type(screen.getByLabelText(/email/i), 'juan@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'Segura123!')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'Segura123!')
    await fillTerms(user)
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Juan Elizondo',
        email: 'juan@test.com',
        password: 'Segura123!',
      })
    })
  })
})