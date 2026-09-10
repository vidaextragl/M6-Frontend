import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { WorkspacePage } from '../../../src/pages/workspace-page'
import { useAuth } from '../../../src/hooks/use-auth'
import { useTheme } from '../../../src/hooks/use-theme'
import { walletsApi } from '../../../src/api/wallets.api'

vi.mock('../../../src/hooks/use-auth')
vi.mock('../../../src/hooks/use-theme')
vi.mock('../../../src/api/wallets.api')

const testUser = {
  id: '1',
  name: 'Juan',
  email: 'juan@test.com',
  avatarUrl: null,
  createdAt: '2026-01-01T00:00:00.000Z',
}

const testWallet = {
  totalBalance: 1000,
  monthlyChangePercentage: 5,
  balanceHistory: [],
  currencies: [
    { code: 'USD' as const, name: 'US Dollar', symbol: '$', balance: 500, changePercentage: 2 },
    { code: 'ARS' as const, name: 'Argentine Peso', symbol: '$', balance: 500, changePercentage: -1 },
  ],
}

function renderWalletWorkspace() {
  return render(
    <MemoryRouter>
      <WorkspacePage type="wallet" />
    </MemoryRouter>,
  )
}

describe('WalletContent', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: testUser,
      token: 'fake-token',
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    })

    vi.mocked(walletsApi.getWallet).mockReset()
    vi.mocked(walletsApi.deposit).mockReset()
    vi.mocked(walletsApi.withdraw).mockReset()
    vi.mocked(walletsApi.getWallet).mockResolvedValue(testWallet)
  })

  it('abre el modal de depósito al hacer click en "Deposit"', async () => {
    const user = userEvent.setup()
    renderWalletWorkspace()

    await user.click(await screen.findByRole('button', { name: 'Deposit' }))

    expect(screen.getByRole('heading', { name: 'Deposit funds' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm deposit' })).toBeInTheDocument()
  })

  it('abre el modal de retiro al hacer click en "Withdraw"', async () => {
    const user = userEvent.setup()
    renderWalletWorkspace()

    await user.click(await screen.findByRole('button', { name: 'Withdraw' }))

    expect(screen.getByRole('heading', { name: 'Withdraw funds' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm withdrawal' })).toBeInTheDocument()
  })

  it('el botón de cerrar (×) cierra el modal sin enviar la operación', async () => {
    const user = userEvent.setup()
    renderWalletWorkspace()

    await user.click(await screen.findByRole('button', { name: 'Deposit' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('heading', { name: 'Deposit funds' })).not.toBeInTheDocument()
    expect(walletsApi.deposit).not.toHaveBeenCalled()
  })

  it('rechaza un monto menor o igual a cero antes de llamar a la API', async () => {
    const user = userEvent.setup()
    renderWalletWorkspace()

    await user.click(await screen.findByRole('button', { name: 'Deposit' }))
    const amountInput = screen.getByPlaceholderText('0.00')

    // El input es type="number" con min="0.01": disparar un click en el botón
    // dispara la validación HTML5 nativa (que bloquea el submit antes de llegar
    // a React) en vez de nuestra validación en JS. Se dispara el submit
    // directamente para poder probar esa rama de getAmountValidationError.
    fireEvent.change(amountInput, { target: { value: '0' } })
    fireEvent.submit(amountInput.closest('form') as HTMLFormElement)

    expect(await screen.findByText('Enter an amount greater than zero.')).toBeInTheDocument()
    expect(walletsApi.deposit).not.toHaveBeenCalled()
  })

  it('rechaza un monto con más de 16 dígitos enteros antes de llamar a la API', async () => {
    const user = userEvent.setup()
    renderWalletWorkspace()

    await user.click(await screen.findByRole('button', { name: 'Deposit' }))
    const amountInput = screen.getByPlaceholderText('0.00')
    await user.type(amountInput, '12345678901234567')
    await user.click(screen.getByRole('button', { name: 'Confirm deposit' }))

    expect(
      await screen.findByText('Amount is too large — the maximum is 16 digits.'),
    ).toBeInTheDocument()
    expect(walletsApi.deposit).not.toHaveBeenCalled()
  })

  it('hace un depósito exitoso, recarga la wallet y cierra el modal', async () => {
    const user = userEvent.setup()
    vi.mocked(walletsApi.deposit).mockResolvedValue(undefined)
    renderWalletWorkspace()

    await user.click(await screen.findByRole('button', { name: 'Deposit' }))
    const amountInput = screen.getByPlaceholderText('0.00')
    await user.type(amountInput, '100')
    await user.click(screen.getByRole('button', { name: 'Confirm deposit' }))

    await waitFor(() => {
      expect(walletsApi.deposit).toHaveBeenCalledWith('USD', '100')
    })
    expect(walletsApi.getWallet).toHaveBeenCalledTimes(2)
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Deposit funds' })).not.toBeInTheDocument()
    })
  })

  it('muestra un mensaje de error genérico cuando el depósito falla sin un Error válido', async () => {
    const user = userEvent.setup()
    vi.mocked(walletsApi.deposit).mockRejectedValue('fallo inesperado')
    renderWalletWorkspace()

    await user.click(await screen.findByRole('button', { name: 'Deposit' }))
    const amountInput = screen.getByPlaceholderText('0.00')
    await user.type(amountInput, '100')
    await user.click(screen.getByRole('button', { name: 'Confirm deposit' }))

    expect(
      await screen.findByText('The operation could not be completed.'),
    ).toBeInTheDocument()
  })
})
