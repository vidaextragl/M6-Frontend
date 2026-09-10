import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { WorkspacePage } from '../../../src/pages/workspace-page'
import { useAuth } from '../../../src/hooks/use-auth'
import { useTheme } from '../../../src/hooks/use-theme'
import { exchangeApi } from '../../../src/api/exchange.api'

vi.mock('../../../src/hooks/use-auth')
vi.mock('../../../src/hooks/use-theme')
vi.mock('../../../src/api/exchange.api')

const testUser = {
  id: '1',
  name: 'Juan',
  email: 'juan@test.com',
  avatarUrl: null,
  createdAt: '2026-01-01T00:00:00.000Z',
}

const testQuote = {
  from: 'ARS',
  to: 'USD',
  rate: 900,
  provider: 'Test Provider',
  fetchedAt: '2026-01-01T10:00:00.000Z',
  source: 'live' as const,
}

function renderExchangeWorkspace() {
  return render(
    <MemoryRouter>
      <WorkspacePage type="exchange" />
    </MemoryRouter>,
  )
}

describe('ExchangeContent', () => {
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

    vi.mocked(exchangeApi.getRate).mockReset()
    vi.mocked(exchangeApi.swap).mockReset()
    vi.mocked(exchangeApi.getRate).mockResolvedValue(testQuote)
  })

  it('carga la tasa de cambio al montar y la muestra', async () => {
    renderExchangeWorkspace()

    expect(await screen.findByText('Rate provided by Test Provider.')).toBeInTheDocument()
    expect(exchangeApi.getRate).toHaveBeenCalledWith('ARS', 'USD')
  })

  it('calcula automáticamente el monto a pagar a partir de la tasa y el monto a recibir', async () => {
    renderExchangeWorkspace()

    await screen.findByText('Rate provided by Test Provider.')
    const amountToPayInput = screen.getByLabelText(
      'Amount to pay (calculated automatically, not editable)',
    )
    expect(amountToPayInput).toHaveValue('0.11')
  })

  it('hace un swap exitoso y muestra un mensaje de éxito', async () => {
    const user = userEvent.setup()
    vi.mocked(exchangeApi.swap).mockResolvedValue({
      transaction: {} as never,
      fromBalance: { currency: 'ARS', amount: '900' },
      toBalance: { currency: 'USD', amount: '100' },
      rate: 900,
    })
    renderExchangeWorkspace()

    await screen.findByText('Rate provided by Test Provider.')
    await user.click(screen.getByRole('button', { name: 'Swap to USD' }))

    expect(await screen.findByText('Exchange completed successfully.')).toBeInTheDocument()
    expect(exchangeApi.swap).toHaveBeenCalledWith('ARS', 'USD', '100')
  })

  it('maneja un error del backend al hacer swap y muestra el mensaje', async () => {
    const user = userEvent.setup()
    vi.mocked(exchangeApi.swap).mockRejectedValue(new Error('El cambio de divisas no está disponible'))
    renderExchangeWorkspace()

    await screen.findByText('Rate provided by Test Provider.')
    await user.click(screen.getByRole('button', { name: 'Swap to USD' }))

    expect(
      await screen.findByText('El cambio de divisas no está disponible'),
    ).toBeInTheDocument()
  })

  it('muestra un mensaje de error genérico cuando el swap rechaza con algo que no es un Error', async () => {
    const user = userEvent.setup()
    vi.mocked(exchangeApi.swap).mockRejectedValue('fallo inesperado')
    renderExchangeWorkspace()

    await screen.findByText('Rate provided by Test Provider.')
    await user.click(screen.getByRole('button', { name: 'Swap to USD' }))

    expect(await screen.findByText('Exchange failed.')).toBeInTheDocument()
  })

  it('deshabilita el botón de swap cuando origen y destino son la misma moneda', async () => {
    const user = userEvent.setup()
    renderExchangeWorkspace()

    await screen.findByText('Rate provided by Test Provider.')
    await user.selectOptions(screen.getByLabelText('Currency to pay'), 'USD')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Swap to USD' })).toBeDisabled()
    })
  })

  it('revierte las monedas al hacer click en el botón de reversa', async () => {
    const user = userEvent.setup()
    renderExchangeWorkspace()

    await screen.findByText('Rate provided by Test Provider.')
    await user.click(screen.getByRole('button', { name: 'Reverse currencies' }))

    expect(screen.getByLabelText('Currency to pay')).toHaveValue('USD')
    expect(screen.getByLabelText('Currency to receive')).toHaveValue('ARS')
  })
})
